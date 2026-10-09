(() => {
  "use strict";

  // ---------------------------------------------------------
  // API Base Resolution (Deployed Render + Local Fallback)
  // ---------------------------------------------------------
  let API_BASE = "https://mansik-santulan-score.onrender.com";

  fetch("http://127.0.0.1:8000/", { method: "GET" })
    .then((res) => {
      if (res.ok) API_BASE = "http://127.0.0.1:8000";
    })
    .catch(() => {
      API_BASE = "https://mansik-santulan-score.onrender.com";
    });

  // ---------------------------------------------------------
  // DOM Elements
  // ---------------------------------------------------------
  const loginScreen = document.getElementById("login-screen");
  const appDashboard = document.getElementById("app-dashboard");

  const tabBtnSignin = document.getElementById("tab-btn-signin");
  const tabBtnRegister = document.getElementById("tab-btn-register");
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");
  const authTitle = document.getElementById("auth-title");
  const authSubtitle = document.getElementById("auth-subtitle");

  const loginEmailInput = document.getElementById("login-email");
  const loginPwInput = document.getElementById("login-password");
  const togglePwBtn = document.getElementById("toggle-pw-btn");
  const demoLoginBtn = document.getElementById("demo-login-btn");

  const regNameInput = document.getElementById("reg-name");
  const regEmailInput = document.getElementById("reg-email");
  const regLevelSelect = document.getElementById("reg-level");
  const regPwInput = document.getElementById("reg-password");
  const regPwConfirmInput = document.getElementById("reg-password-confirm");
  const regErrorMsg = document.getElementById("reg-error-msg");

  const userProfileBadge = document.getElementById("user-profile-badge");
  const userNameDisplay = document.getElementById("user-name-display");
  const userAvatar = document.getElementById("user-avatar");
  const logoutBtn = document.getElementById("logout-btn");

  const form = document.getElementById("predict-form");
  const submitBtn = document.getElementById("submit-btn");
  const resetBtn = document.getElementById("reset-btn");
  const errorRetryBtn = document.getElementById("error-retry-btn");

  const stateIdle = document.getElementById("state-idle");
  const stateLoading = document.getElementById("state-loading");
  const stateResult = document.getElementById("state-result");
  const stateError = document.getElementById("state-error");

  const scoreNumberEl = document.getElementById("score-number");
  const scoreBandEl = document.getElementById("score-band");
  const scoreContextEl = document.getElementById("score-context");
  const gaugeFill = document.getElementById("gauge-fill");
  const errorCopyEl = document.getElementById("error-copy");

  const GAUGE_ARC_LENGTH = 314;

  // ---------------------------------------------------------
  // User Accounts Memory Store
  // ---------------------------------------------------------
  function getRegisteredUsers() {
    try {
      return JSON.parse(localStorage.getItem("mhs_registered_users")) || [];
    } catch (e) {
      return [];
    }
  }

  function saveUserAccount(userObj) {
    const users = getRegisteredUsers();
    users.push(userObj);
    localStorage.setItem("mhs_registered_users", JSON.stringify(users));
  }

  // ---------------------------------------------------------
  // STRICT INITIAL STATE: LOGIN PAGE FIRST
  // ---------------------------------------------------------
  function showLoginPageFirst() {
    if (loginScreen) {
      loginScreen.removeAttribute("hidden");
      loginScreen.style.display = "flex";
    }
    if (appDashboard) {
      appDashboard.setAttribute("hidden", "true");
      appDashboard.style.display = "none";
    }
  }

  showLoginPageFirst();

  // ---------------------------------------------------------
  // Auth Tab Navigation (Sign In vs Create Account)
  // ---------------------------------------------------------
  function switchTab(mode) {
    if (mode === "signin") {
      tabBtnSignin.classList.add("active");
      tabBtnRegister.classList.remove("active");
      loginForm.style.display = "flex";
      registerForm.style.display = "none";
      authTitle.textContent = "Sign In to Dashboard";
      authSubtitle.textContent = "Sign in with your student account or create a new profile";
    } else {
      tabBtnRegister.classList.add("active");
      tabBtnSignin.classList.remove("active");
      loginForm.style.display = "none";
      registerForm.style.display = "flex";
      authTitle.textContent = "Create Student Profile";
      authSubtitle.textContent = "Register your account to access the mental health calculator";
    }
  }

  if (tabBtnSignin) tabBtnSignin.addEventListener("click", () => switchTab("signin"));
  if (tabBtnRegister) tabBtnRegister.addEventListener("click", () => switchTab("register"));

  // ---------------------------------------------------------
  // Authentication & Session Manager
  // ---------------------------------------------------------
  function getInitials(name) {
    if (!name) return "ST";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  }

  function setAuthenticatedUser(name, email, academicLevel) {
    const displayName = name || email.split("@")[0] || "Student";
    
    if (userNameDisplay) userNameDisplay.textContent = displayName;
    if (userAvatar) userAvatar.textContent = getInitials(displayName);

    // If student academic level is known, pre-select it in the main calculator form!
    const academicSelect = document.getElementById("academic_level");
    if (academicSelect && academicLevel) {
      academicSelect.value = academicLevel;
    }

    // Hide Auth Screen, Reveal Main Dashboard
    if (loginScreen) {
      loginScreen.setAttribute("hidden", "true");
      loginScreen.style.display = "none";
    }
    if (appDashboard) {
      appDashboard.removeAttribute("hidden");
      appDashboard.style.display = "block";
    }
    if (userProfileBadge) {
      userProfileBadge.style.display = "flex";
    }
  }

  // Password Visibility Toggle
  if (togglePwBtn && loginPwInput) {
    togglePwBtn.addEventListener("click", () => {
      const isPw = loginPwInput.type === "password";
      loginPwInput.type = isPw ? "text" : "password";
      togglePwBtn.textContent = isPw ? "Hide" : "Show";
    });
  }

  // ---------------------------------------------------------
  // Sign In Handler
  // ---------------------------------------------------------
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = loginEmailInput.value.trim().toLowerCase();
      const password = loginPwInput.value;

      const registeredUsers = getRegisteredUsers();
      const matched = registeredUsers.find((u) => u.email === email);

      if (matched) {
        if (matched.password === password) {
          setAuthenticatedUser(matched.name, matched.email, matched.academicLevel);
        } else {
          alert("Incorrect password. Please try again.");
        }
      } else {
        // Log in with entered username/email
        const formattedName = email.split("@")[0].charAt(0).toUpperCase() + email.split("@")[0].slice(1);
        setAuthenticatedUser(formattedName, email, null);
      }
    });
  }

  // ---------------------------------------------------------
  // Registration / Create Account Handler
  // ---------------------------------------------------------
  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      regErrorMsg.style.display = "none";
      regErrorMsg.textContent = "";

      const name = regNameInput.value.trim();
      const email = regEmailInput.value.trim().toLowerCase();
      const level = regLevelSelect.value;
      const pw = regPwInput.value;
      const pwConfirm = regPwConfirmInput.value;

      if (!name || !email || !level || !pw || !pwConfirm) {
        regErrorMsg.textContent = "Please fill out all fields.";
        regErrorMsg.style.display = "block";
        return;
      }

      if (pw.length < 6) {
        regErrorMsg.textContent = "Password must be at least 6 characters.";
        regErrorMsg.style.display = "block";
        return;
      }

      if (pw !== pwConfirm) {
        regErrorMsg.textContent = "Passwords do not match.";
        regErrorMsg.style.display = "block";
        return;
      }

      const existingUsers = getRegisteredUsers();
      if (existingUsers.some((u) => u.email === email)) {
        regErrorMsg.textContent = "An account with this email already exists. Please sign in.";
        regErrorMsg.style.display = "block";
        return;
      }

      // Save user account
      const newUser = { name, email, academicLevel: level, password: pw };
      saveUserAccount(newUser);

      // Authenticate and open dashboard immediately
      setAuthenticatedUser(name, email, level);
    });
  }

  // Quick Demo Access
  if (demoLoginBtn) {
    demoLoginBtn.addEventListener("click", () => {
      setAuthenticatedUser("Alex Student", "alex.student@university.edu", "Undergraduate");
    });
  }

  // Logout Handler
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      showLoginPageFirst();
    });
  }

  // ---------------------------------------------------------
  // SVG Gauge Ticks
  // ---------------------------------------------------------
  function drawTicks() {
    document.querySelectorAll(".gauge-ticks").forEach((g) => {
      g.innerHTML = "";
      const cx = 120, cy = 140, rOuter = 100, rInner = 90;
      for (let i = 0; i <= 10; i += 2) {
        const angle = Math.PI - (i / 10) * Math.PI;
        const x1 = cx + rOuter * Math.cos(angle);
        const y1 = cy - rOuter * Math.sin(angle);
        const x2 = cx + rInner * Math.cos(angle);
        const y2 = cy - rInner * Math.sin(angle);
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", x1.toFixed(1));
        line.setAttribute("y1", y1.toFixed(1));
        line.setAttribute("x2", x2.toFixed(1));
        line.setAttribute("y2", y2.toFixed(1));
        g.appendChild(line);
      }
    });
  }
  drawTicks();

  // ---------------------------------------------------------
  // Segmented Buttons (Stress Level)
  // ---------------------------------------------------------
  const segGroup = document.getElementById("stress_level_group");
  const stressHiddenInput = document.getElementById("stress_level");
  if (segGroup && stressHiddenInput) {
    segGroup.querySelectorAll(".seg-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        segGroup.querySelectorAll(".seg-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        stressHiddenInput.value = btn.dataset.value;
        clearFieldError(stressHiddenInput);
      });
    });
  }

  // ---------------------------------------------------------
  // Form Field Validation
  // ---------------------------------------------------------
  function fieldWrapper(input) {
    return input ? input.closest(".field") : null;
  }

  function setFieldError(input, message) {
    const wrap = fieldWrapper(input);
    if (!wrap) return;
    wrap.classList.add("field-error");
    const msgEl = wrap.querySelector(".error-msg");
    if (msgEl) msgEl.textContent = message;
  }

  function clearFieldError(input) {
    const wrap = fieldWrapper(input);
    if (!wrap) return;
    wrap.classList.remove("field-error");
    const msgEl = wrap.querySelector(".error-msg");
    if (msgEl) msgEl.textContent = "";
  }

  function clearAllErrors() {
    if (!form) return;
    form.querySelectorAll(".field").forEach((f) => f.classList.remove("field-error"));
    form.querySelectorAll(".error-msg").forEach((m) => (m.textContent = ""));
  }

  function validate(payload) {
    const errors = [];
    const numericChecks = [
      ["age", 10, 100],
      ["avg_daily_usage_hours", 0, 24],
      ["daily_unlocks", 0, Infinity],
      ["study_hours", 0, 24],
      ["physical_activity_hours", 0, 24],
      ["sleep_hours_per_night", 0, 24],
    ];

    numericChecks.forEach(([key, min, max]) => {
      const input = document.getElementById(key);
      const val = payload[key];
      if (val === "" || val === null || Number.isNaN(val)) {
        errors.push([input, "Required field"]);
      } else if (val < min || val > max) {
        errors.push([input, `Value must be between ${min} and ${max === Infinity ? "0+" : max}`]);
      }
    });

    ["gender", "country", "academic_level", "most_used_platform", "purpose_of_use"].forEach((key) => {
      const input = document.getElementById(key);
      if (!payload[key] || String(payload[key]).trim() === "") {
        errors.push([input, "Selection required"]);
      }
    });

    if (!payload.stress_level) {
      errors.push([stressHiddenInput, "Select a stress level"]);
    }

    return errors;
  }

  function collectPayload() {
    const fd = new FormData(form);
    return {
      age: fd.get("age") === "" ? NaN : parseInt(fd.get("age"), 10),
      gender: fd.get("gender") || "",
      country: (fd.get("country") || "").trim(),
      academic_level: fd.get("academic_level") || "",
      most_used_platform: fd.get("most_used_platform") || "",
      purpose_of_use: fd.get("purpose_of_use") || "",
      avg_daily_usage_hours: fd.get("avg_daily_usage_hours") === "" ? NaN : parseFloat(fd.get("avg_daily_usage_hours")),
      daily_unlocks: fd.get("daily_unlocks") === "" ? NaN : parseInt(fd.get("daily_unlocks"), 10),
      study_hours: fd.get("study_hours") === "" ? NaN : parseFloat(fd.get("study_hours")),
      physical_activity_hours: fd.get("physical_activity_hours") === "" ? NaN : parseFloat(fd.get("physical_activity_hours")),
      sleep_hours_per_night: fd.get("sleep_hours_per_night") === "" ? NaN : parseFloat(fd.get("sleep_hours_per_night")),
      stress_level: fd.get("stress_level") || "",
    };
  }

  function showState(name) {
    [stateIdle, stateLoading, stateResult, stateError].forEach((el) => {
      if (el) el.hidden = true;
    });
    const target = { idle: stateIdle, loading: stateLoading, result: stateResult, error: stateError }[name];
    if (target) target.hidden = false;
  }

  function setSubmitting(isSubmitting) {
    if (submitBtn) {
      submitBtn.disabled = isSubmitting;
    }
  }

  function bandFor(score) {
    if (score < 4) {
      return {
        label: "Elevated Strain Signal",
        context: "Model indicates lifestyle parameters associated with higher stress and screen fatigue.",
      };
    }
    if (score < 7) {
      return {
        label: "Moderate Wellness Balance",
        context: "Habits align with a moderate baseline, with opportunities to optimize sleep and digital balance.",
      };
    }
    return {
      label: "Strong Wellness Baseline",
      context: "Parameters reflect balanced sleep, active routine, and healthy digital boundaries.",
    };
  }

  function renderResult(score) {
    const clamped = Math.max(0, Math.min(10, score));
    const { label, context } = bandFor(clamped);

    scoreNumberEl.textContent = score.toFixed(2);
    scoreBandEl.textContent = label;
    scoreContextEl.textContent = context;

    if (gaugeFill) {
      gaugeFill.style.transition = "none";
      gaugeFill.style.strokeDashoffset = String(GAUGE_ARC_LENGTH);
      requestAnimationFrame(() => {
        gaugeFill.style.transition = "";
        const offset = GAUGE_ARC_LENGTH * (1 - clamped / 10);
        gaugeFill.style.strokeDashoffset = String(offset);
      });
    }

    showState("result");
  }

  function renderError(copy) {
    if (errorCopyEl) errorCopyEl.textContent = copy;
    showState("error");
  }

  // ---------------------------------------------------------
  // Main Calculator Submit
  // ---------------------------------------------------------
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      clearAllErrors();

      const payload = collectPayload();
      const clientErrors = validate(payload);

      if (clientErrors.length > 0) {
        clientErrors.forEach(([input, msg]) => input && setFieldError(input, msg));
        clientErrors[0][0]?.focus?.();
        return;
      }

      setSubmitting(true);
      showState("loading");

      try {
        const res = await fetch(`${API_BASE}/predict`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          let detailMsg = `API status code ${res.status}.`;
          const body = await res.json().catch(() => null);
          if (body && typeof body.detail === "string") detailMsg = body.detail;
          renderError(detailMsg);
          return;
        }

        const data = await res.json();
        if (typeof data.predicted_mental_health_score !== "number") {
          renderError("Score value missing or invalid in API response.");
          return;
        }

        renderResult(data.predicted_mental_health_score);
      } catch (err) {
        renderError(
          `Unable to reach API server at ${API_BASE}. Verify FastAPI backend is active.`
        );
      } finally {
        setSubmitting(false);
      }
    });

    form.querySelectorAll("input, select").forEach((el) => {
      el.addEventListener("input", () => clearFieldError(el));
      el.addEventListener("change", () => clearFieldError(el));
    });
  }

  if (resetBtn) resetBtn.addEventListener("click", () => showState("idle"));
  if (errorRetryBtn) errorRetryBtn.addEventListener("click", () => showState("idle"));
})();
