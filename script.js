/* ==========================================================================
   MANSANTULAN (मन संतुलन) — APPLICATION CONTROLLER
   Integrates authentication, multi-step assessment wizard, machine learning API,
   interactive Chart.js visualizer, wellness toolkit, and accessibility logic.
   ========================================================================== */

(() => {
  "use strict";

  // --------------------------------------------------------------------------
  // 1. API BASE RESOLUTION (Local Development + Render Production Fallback)
  // --------------------------------------------------------------------------
  let API_BASE = "https://mansantulan.onrender.com";

  // Probe local FastAPI backend first
  fetch("http://127.0.0.1:8000/health", { method: "GET" })
    .then((res) => {
      if (res.ok) API_BASE = "http://127.0.0.1:8000";
    })
    .catch(() => {
      // Local server offline; keep production cloud URL
      API_BASE = "https://mansantulan.onrender.com";
    });

  // --------------------------------------------------------------------------
  // 2. AUTHENTICATION & SESSION GUARD
  // --------------------------------------------------------------------------
  let currentSession = null;
  if (window.ManSantulanAuth) {
    currentSession = window.ManSantulanAuth.getSession();
    if (!currentSession) {
      // Provide instant guest demo session so the landing page experience is immediately interactive
      currentSession = window.ManSantulanAuth.loginDemoUser();
    }
  }

  // Populate personalized user information
  function setupUserGreeting() {
    const userName = currentSession?.name || "Student";
    const userEmail = currentSession?.email || "student@university.edu";

    const heroNameEl = document.getElementById("hero-student-name");
    const navNameEl = document.getElementById("nav-user-name");
    const navAvatarEl = document.getElementById("nav-user-avatar");
    const dropdownEmailEl = document.getElementById("dropdown-user-email");
    const heroGreetingEl = document.getElementById("hero-greeting");

    if (heroNameEl) heroNameEl.textContent = userName.split(" ")[0];
    if (navNameEl) navNameEl.textContent = userName.split(" ")[0];
    if (dropdownEmailEl) dropdownEmailEl.textContent = userEmail;

    if (navAvatarEl) {
      const initials = userName
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
      navAvatarEl.textContent = initials || "ST";
    }

    // Time-based friendly greeting
    const hour = new Date().getHours();
    let timeGreeting = "Good morning";
    let icon = "🌅";
    if (hour >= 12 && hour < 17) {
      timeGreeting = "Good afternoon";
      icon = "☀️";
    } else if (hour >= 17) {
      timeGreeting = "Good evening";
      icon = "🌙";
    }
    if (heroGreetingEl) {
      heroGreetingEl.textContent = `${timeGreeting}`;
    }
  }

  // --------------------------------------------------------------------------
  // 3. THEME & LANGUAGE MANAGERS & ANIMATIONS
  // --------------------------------------------------------------------------
  function setupScrollAnimations() {
    // If user prefers reduced motion, reveal everything immediately
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.querySelectorAll(".reveal-on-scroll").forEach((el) => el.classList.add("is-revealed"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    document.querySelectorAll(".reveal-on-scroll").forEach((el) => {
      observer.observe(el);
    });
  }

  function setupHeroMoodChips() {
    const moodRow = document.getElementById("hero-mood-row");
    const tipBanner = document.getElementById("hero-mood-tip");
    if (!moodRow || !tipBanner) return;

    moodRow.querySelectorAll(".mood-chip-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        moodRow.querySelectorAll(".mood-chip-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        const tip = btn.getAttribute("data-tip");
        tipBanner.style.opacity = "0";
        setTimeout(() => {
          tipBanner.textContent = `"${tip}"`;
          tipBanner.style.opacity = "1";
        }, 150);
      });
    });
  }
  function setupThemeToggle() {
    const themeBtn = document.getElementById("theme-btn");
    const themeIcon = document.getElementById("theme-icon");
    const storedTheme = localStorage.getItem("mansantulan_theme") || "light";

    document.documentElement.setAttribute("data-theme", storedTheme);
    updateThemeIcon(storedTheme);

    if (themeBtn) {
      themeBtn.addEventListener("click", () => {
        const currentTheme = document.documentElement.getAttribute("data-theme");
        const nextTheme = currentTheme === "dark" ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", nextTheme);
        localStorage.setItem("mansantulan_theme", nextTheme);
        updateThemeIcon(nextTheme);
        renderCharts(); // Re-render charts with theme palette
      });
    }

    function updateThemeIcon(theme) {
      if (!themeIcon) return;
      themeIcon.setAttribute("data-lucide", theme === "dark" ? "sun" : "moon");
      if (window.lucide) window.lucide.createIcons();
    }
  }

  function setupLanguageMenu() {
    const langBtn = document.getElementById("lang-btn");
    const langMenu = document.getElementById("lang-menu");
    const langOptions = document.querySelectorAll(".lang-option");

    if (langBtn && langMenu) {
      langBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const isOpen = langMenu.classList.toggle("open");
        langBtn.setAttribute("aria-expanded", isOpen);
      });

      document.addEventListener("click", () => {
        langMenu.classList.remove("open");
        langBtn.setAttribute("aria-expanded", "false");
      });

      langOptions.forEach((btn) => {
        btn.addEventListener("click", () => {
          const lang = btn.getAttribute("data-lang");
          langOptions.forEach((b) => b.classList.remove("active"));
          btn.classList.add("active");
          if (window.ManSantulani18n) {
            window.ManSantulani18n.setLanguage(lang);
          }
          langMenu.classList.remove("open");
        });
      });
    }
  }

  function setupProfileMenu() {
    const profileBtn = document.getElementById("profile-btn");
    const profileDropdown = document.getElementById("profile-dropdown");
    const logoutBtn = document.getElementById("nav-logout-btn");

    if (profileBtn && profileDropdown) {
      profileBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const isOpen = profileDropdown.classList.toggle("open");
        profileBtn.setAttribute("aria-expanded", isOpen);
      });

      document.addEventListener("click", () => {
        profileDropdown.classList.remove("open");
        profileBtn.setAttribute("aria-expanded", "false");
      });
    }

    if (logoutBtn && window.ManSantulanAuth) {
      logoutBtn.addEventListener("click", () => {
        window.ManSantulanAuth.logoutUser();
      });
    }

    // Mobile nav drawer
    const mobileMenuBtn = document.getElementById("mobile-menu-btn");
    const mobileDrawer = document.getElementById("mobile-nav-drawer");
    if (mobileMenuBtn && mobileDrawer) {
      mobileMenuBtn.addEventListener("click", () => {
        mobileDrawer.classList.toggle("open");
      });
      mobileDrawer.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => mobileDrawer.classList.remove("open"));
      });
    }
  }

  // --------------------------------------------------------------------------
  // 4. ASSESSMENT WIZARD STATE MACHINE
  // --------------------------------------------------------------------------
  let currentStep = 1;
  const totalSteps = 4;

  const step1El = document.getElementById("wizard-step-1");
  const step2El = document.getElementById("wizard-step-2");
  const step3El = document.getElementById("wizard-step-3");
  const step4El = document.getElementById("wizard-step-4");
  const stepEls = [step1El, step2El, step3El, step4El];

  const prevBtn = document.getElementById("wizard-prev-btn");
  const nextBtn = document.getElementById("wizard-next-btn");
  const submitBtn = document.getElementById("wizard-submit-btn");
  const progressFill = document.getElementById("wizard-progress-fill");

  function setWizardStep(targetStep) {
    if (targetStep < 1 || targetStep > totalSteps) return;

    // Validate current step before advancing forward
    if (targetStep > currentStep && !validateCurrentStep(currentStep)) {
      return;
    }

    currentStep = targetStep;

    // Toggle active step panel
    stepEls.forEach((el, idx) => {
      if (!el) return;
      if (idx + 1 === currentStep) {
        el.classList.add("active");
      } else {
        el.classList.remove("active");
      }
    });

    // Update Step Indicators
    for (let i = 1; i <= totalSteps; i++) {
      const ind = document.getElementById(`indicator-${i}`);
      if (!ind) continue;
      ind.classList.remove("active", "completed");
      if (i === currentStep) {
        ind.classList.add("active");
      } else if (i < currentStep) {
        ind.classList.add("completed");
      }
    }

    // Update Progress Bar
    const progressPct = (currentStep / totalSteps) * 100;
    if (progressFill) progressFill.style.width = `${progressPct}%`;

    // Manage Prev / Next / Submit buttons
    if (prevBtn) {
      prevBtn.style.visibility = currentStep === 1 ? "hidden" : "visible";
    }

    if (currentStep === totalSteps) {
      if (nextBtn) nextBtn.style.display = "none";
      if (submitBtn) submitBtn.style.display = "inline-flex";
      populateReviewSummary();
    } else {
      if (nextBtn) nextBtn.style.display = "inline-flex";
      if (submitBtn) submitBtn.style.display = "none";
    }

    // Smooth scroll to wizard header on step change
    const wizardCard = document.querySelector(".wizard-card");
    if (wizardCard && window.innerWidth < 768) {
      wizardCard.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function validateCurrentStep(step) {
    let isValid = true;

    if (step === 1) {
      const age = parseInt(document.getElementById("age").value, 10);
      const gender = document.getElementById("gender").value;
      const country = document.getElementById("country").value;

      if (isNaN(age) || age < 10 || age > 100) {
        showFieldError("age-error", "Please select an age between 10 and 100.");
        isValid = false;
      } else {
        hideFieldError("age-error");
      }

      if (!gender) {
        showFieldError("gender-error", "Please select a gender.");
        isValid = false;
      } else {
        hideFieldError("gender-error");
      }

      if (!country) {
        showFieldError("country-error", "Please select a country.");
        isValid = false;
      } else {
        hideFieldError("country-error");
      }
    } else if (step === 2) {
      const academic = document.getElementById("academic_level").value;
      const platform = document.getElementById("most_used_platform").value;
      const purpose = document.getElementById("purpose_of_use").value;
      const usage = parseFloat(document.getElementById("avg_daily_usage_hours").value);
      const unlocks = parseInt(document.getElementById("daily_unlocks").value, 10);

      if (!academic) {
        showFieldError("academic-error", "Please select your academic level.");
        isValid = false;
      } else {
        hideFieldError("academic-error");
      }

      if (!platform) {
        showFieldError("platform-error", "Please select a primary platform.");
        isValid = false;
      } else {
        hideFieldError("platform-error");
      }

      if (!purpose) {
        showFieldError("purpose-error", "Please select your primary purpose of use.");
        isValid = false;
      } else {
        hideFieldError("purpose-error");
      }

      if (isNaN(usage) || usage < 0 || usage > 24) {
        showFieldError("usage-error", "Usage hours must be between 0 and 24.");
        isValid = false;
      } else {
        hideFieldError("usage-error");
      }

      if (isNaN(unlocks) || unlocks < 0) {
        showFieldError("unlocks-error", "Please provide a valid unlock count.");
        isValid = false;
      } else {
        hideFieldError("unlocks-error");
      }
    } else if (step === 3) {
      const study = parseFloat(document.getElementById("study_hours").value);
      const activity = parseFloat(document.getElementById("physical_activity_hours").value);
      const sleep = parseFloat(document.getElementById("sleep_hours_per_night").value);
      const stress = document.getElementById("stress_level").value;

      if (isNaN(study) || study < 0 || study > 24) {
        showFieldError("study-error", "Study hours must be between 0 and 24.");
        isValid = false;
      } else {
        hideFieldError("study-error");
      }

      if (isNaN(activity) || activity < 0 || activity > 24) {
        showFieldError("activity-error", "Physical activity hours must be between 0 and 24.");
        isValid = false;
      } else {
        hideFieldError("activity-error");
      }

      if (isNaN(sleep) || sleep < 0 || sleep > 24) {
        showFieldError("sleep-error", "Sleep hours must be between 0 and 24.");
        isValid = false;
      } else {
        hideFieldError("sleep-error");
      }

      if (!stress) {
        showFieldError("stress-error", "Please select a stress level.");
        isValid = false;
      } else {
        hideFieldError("stress-error");
      }
    }

    return isValid;
  }

  function showFieldError(id, msg) {
    const el = document.getElementById(id);
    if (el) {
      el.textContent = msg;
      el.classList.add("visible");
    }
  }

  function hideFieldError(id) {
    const el = document.getElementById(id);
    if (el) {
      el.textContent = "";
      el.classList.remove("visible");
    }
  }

  // Populate Review step summary
  function populateReviewSummary() {
    document.getElementById("rev-age").textContent = `${document.getElementById("age").value} yrs`;
    document.getElementById("rev-gender").textContent = document.getElementById("gender").value;
    document.getElementById("rev-country").textContent = document.getElementById("country").value;

    document.getElementById("rev-academic").textContent = document.getElementById("academic_level").value;
    document.getElementById("rev-platform").textContent = document.getElementById("most_used_platform").value;
    document.getElementById("rev-purpose").textContent = document.getElementById("purpose_of_use").value;
    document.getElementById("rev-usage").textContent = `${document.getElementById("avg_daily_usage_hours").value} hrs/day`;
    document.getElementById("rev-unlocks").textContent = `${document.getElementById("daily_unlocks").value} unlocks`;

    document.getElementById("rev-study").textContent = `${document.getElementById("study_hours").value} hrs/day`;
    document.getElementById("rev-activity").textContent = `${document.getElementById("physical_activity_hours").value} hrs/day`;
    document.getElementById("rev-sleep").textContent = `${document.getElementById("sleep_hours_per_night").value} hrs/night`;
    document.getElementById("rev-stress").textContent = document.getElementById("stress_level").value;
  }

  function setupWizardControls() {
    // Slider live value readouts
    const sliders = [
      { id: "age", displayId: "age-display", suffix: " yrs" },
      { id: "avg_daily_usage_hours", displayId: "usage-display", suffix: " hrs/day" },
      { id: "study_hours", displayId: "study-display", suffix: " hrs/day" },
      { id: "physical_activity_hours", displayId: "activity-display", suffix: " hr/day" },
      { id: "sleep_hours_per_night", displayId: "sleep-display", suffix: " hrs/night" }
    ];

    sliders.forEach(({ id, displayId, suffix }) => {
      const slider = document.getElementById(id);
      const display = document.getElementById(displayId);
      if (slider && display) {
        slider.addEventListener("input", () => {
          display.textContent = `${slider.value}${suffix}`;
        });
      }
    });

    // Chip selection groups (Gender, Academic, Platform, Purpose)
    document.querySelectorAll(".chip-group").forEach((group) => {
      const chips = group.querySelectorAll(".chip");
      chips.forEach((chip) => {
        chip.addEventListener("click", () => {
          chips.forEach((c) => c.classList.remove("active"));
          chip.classList.add("active");
          const name = chip.getAttribute("data-name");
          const val = chip.getAttribute("data-value");
          const hiddenInput = document.getElementById(name);
          if (hiddenInput) hiddenInput.value = val;
        });
      });
    });

    // Segmented stress level pills
    const stressGroup = document.getElementById("stress-pill-group");
    const stressHidden = document.getElementById("stress_level");
    if (stressGroup && stressHidden) {
      stressGroup.querySelectorAll(".pill-btn").forEach((pill) => {
        pill.addEventListener("click", () => {
          stressGroup.querySelectorAll(".pill-btn").forEach((p) => p.classList.remove("active"));
          pill.classList.add("active");
          stressHidden.value = pill.getAttribute("data-value");
        });
      });
    }

    // Step navigation buttons
    if (nextBtn) nextBtn.addEventListener("click", () => setWizardStep(currentStep + 1));
    if (prevBtn) prevBtn.addEventListener("click", () => setWizardStep(currentStep - 1));

    // Shortcut edits from Review step
    document.querySelectorAll(".wizard-review-edit").forEach((btn) => {
      btn.addEventListener("click", () => {
        const target = parseInt(btn.getAttribute("data-target-step"), 10);
        if (target) setWizardStep(target);
      });
    });
  }

  // --------------------------------------------------------------------------
  // 5. PREDICTION API DISPATCH & RESULT HANDLING
  // --------------------------------------------------------------------------
  function setupPredictionSubmission() {
    const form = document.getElementById("predict-form");
    const resultSection = document.getElementById("result-section");
    const resultLoading = document.getElementById("result-loading");
    const resultError = document.getElementById("result-error");
    const resultContent = document.getElementById("result-content");
    const errorMsgEl = document.getElementById("error-message");
    const retryBtn = document.getElementById("retry-calculation-btn");
    const retakeBtn = document.getElementById("retake-btn");
    const downloadBtn = document.getElementById("download-report-btn");
    const shareBtn = document.getElementById("share-btn");

    if (!form) return;

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      if (!validateCurrentStep(currentStep)) return;

      // Extract and format EXACT payload conforming to main.py / StudentData model
      const payload = {
        age: parseInt(document.getElementById("age").value, 10),
        gender: document.getElementById("gender").value,
        country: document.getElementById("country").value,
        academic_level: document.getElementById("academic_level").value,
        most_used_platform: document.getElementById("most_used_platform").value,
        purpose_of_use: document.getElementById("purpose_of_use").value,
        avg_daily_usage_hours: parseFloat(document.getElementById("avg_daily_usage_hours").value),
        daily_unlocks: parseInt(document.getElementById("daily_unlocks").value, 10),
        study_hours: parseFloat(document.getElementById("study_hours").value),
        physical_activity_hours: parseFloat(document.getElementById("physical_activity_hours").value),
        sleep_hours_per_night: parseFloat(document.getElementById("sleep_hours_per_night").value),
        stress_level: document.getElementById("stress_level").value
      };

      // Reveal Result Section & Enter Loading State
      resultSection.classList.remove("hidden");
      resultLoading.style.display = "flex";
      resultError.style.display = "none";
      resultContent.style.display = "none";
      resultSection.scrollIntoView({ behavior: "smooth", block: "start" });

      try {
        const response = await fetch(`${API_BASE}/predict`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          throw new Error(`API responded with status ${response.status}`);
        }

        const data = await response.json();
        const score = data.predicted_mental_health_score;

        if (typeof score !== "number" || isNaN(score)) {
          throw new Error("Invalid score received from model service.");
        }

        renderResult(score, payload);
      } catch (err) {
        resultLoading.style.display = "none";
        resultError.style.display = "flex";
        if (errorMsgEl) {
          errorMsgEl.textContent = `Unable to reach ${API_BASE}. Please verify that the FastAPI backend server is active.`;
        }
      }
    });

    if (retryBtn) {
      retryBtn.addEventListener("click", () => {
        form.dispatchEvent(new Event("submit"));
      });
    }

    if (retakeBtn) {
      retakeBtn.addEventListener("click", () => {
        resultSection.classList.add("hidden");
        setWizardStep(1);
      });
    }

    if (downloadBtn) {
      downloadBtn.addEventListener("click", () => {
        const score = document.getElementById("score-number").textContent;
        const badge = document.getElementById("score-badge-text").textContent;
        const explanation = document.getElementById("score-explanation").textContent;
        const studentName = currentSession?.name || "Student";
        const date = new Date().toLocaleDateString();

        const report = `================================================
MANSANTULAN (मन संतुलन) — WELLNESS SUMMARY
================================================
Student: ${studentName}
Date: ${date}

Mental Wellness Balance Score: ${score} / 10
Status Classification: ${badge}

Summary:
${explanation}

Recommendations:
- Maintain 7+ hours of uninterrupted sleep.
- Limit screen time within 45 minutes of bedtime.
- Incorporate daily active movement.

* Note: This report is generated by an educational machine learning tool
and does not constitute medical or clinical psychiatric advice.
================================================`;

        const blob = new Blob([report], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `ManSantulan_Wellness_Report_${date.replace(/\//g, "-")}.txt`;
        a.click();
        URL.revokeObjectURL(url);
      });
    }

    if (shareBtn) {
      shareBtn.addEventListener("click", async () => {
        const shareData = {
          title: "ManSantulan — Student Mental Health Calculator",
          text: "I just checked my digital balance and mental wellness habits on ManSantulan!",
          url: window.location.href
        };
        if (navigator.share) {
          try {
            await navigator.share(shareData);
          } catch {
            // User dismissed share dialog
          }
        } else {
          navigator.clipboard.writeText(window.location.href);
          alert("Link copied to clipboard! Share it with fellow students.");
        }
      });
    }
  }

  // --------------------------------------------------------------------------
  // 6. SENSITIVE RESULT RENDERING & SVG RING GAUGE ANIMATION
  // --------------------------------------------------------------------------
  function renderResult(rawScore, payload) {
    const score = Math.max(0, Math.min(10, rawScore));
    const resultLoading = document.getElementById("result-loading");
    const resultContent = document.getElementById("result-content");
    const scoreNumEl = document.getElementById("score-number");
    const badgeEl = document.getElementById("score-badge");
    const badgeIconEl = document.getElementById("score-badge-icon");
    const badgeTextEl = document.getElementById("score-badge-text");
    const explanationEl = document.getElementById("score-explanation");
    const ringFill = document.getElementById("gauge-circle-fill");
    const helplineBanner = document.getElementById("helpline-banner");
    const factorsList = document.getElementById("factors-list");
    const tipsList = document.getElementById("tips-list");

    resultLoading.style.display = "none";
    resultContent.style.display = "block";

    // Animated number count-up
    animateValue(scoreNumEl, 0, score, 1200);

    // SVG Circle Ring Animation (Circumference: 2 * PI * 85 ≈ 534)
    const circumference = 534;
    const targetOffset = circumference * (1 - score / 10);
    if (ringFill) {
      ringFill.style.strokeDashoffset = `${circumference}`;
      requestAnimationFrame(() => {
        ringFill.style.strokeDashoffset = `${targetOffset}`;
      });
    }

    // Status Band Categorization (Always supportive, never alarming)
    badgeEl.className = "score-badge";
    if (score >= 7.8) {
      badgeEl.classList.add("thriving");
      badgeIconEl.textContent = "🌟";
      badgeTextEl.textContent = "Thriving & Well Balanced";
      explanationEl.textContent =
        "Your lifestyle habits show exemplary harmony between screen usage, physical movement, and restorative sleep.";
      if (ringFill) ringFill.style.stroke = "var(--sage)";
      helplineBanner.style.display = "none";
    } else if (score >= 6.2) {
      badgeEl.classList.add("growing");
      badgeIconEl.textContent = "🌿";
      badgeTextEl.textContent = "Good Baseline Balance";
      explanationEl.textContent =
        "Your digital and lifestyle habits are largely sound. Minor adjustments to nightly sleep will help sustain your focus.";
      if (ringFill) ringFill.style.stroke = "var(--calm-blue)";
      helplineBanner.style.display = "none";
    } else if (score >= 5.0) {
      badgeEl.classList.add("finding-balance");
      badgeIconEl.textContent = "🌤️";
      badgeTextEl.textContent = "Moderate Digital Strain";
      explanationEl.textContent =
        "Screen time or study volume may be crowding out recovery. Incorporating regular mindful breaks can restore balance.";
      if (ringFill) ringFill.style.stroke = "var(--lavender)";
      helplineBanner.style.display = "none";
    } else {
      badgeEl.classList.add("needs-attention");
      badgeIconEl.textContent = "💙";
      badgeTextEl.textContent = "Rest & Support Recommended";
      explanationEl.textContent =
        "Your inputs indicate elevated fatigue and screen strain. Please be gentle with yourself; resting is productive.";
      if (ringFill) ringFill.style.stroke = "var(--coral)";
      helplineBanner.style.display = "flex";
    }

    // Populate Top Habit Factors
    if (factorsList) {
      factorsList.innerHTML = "";
      const factors = [];

      if (payload.sleep_hours_per_night < 6.5) {
        factors.push({ icon: "😴", text: `Sleep duration (${payload.sleep_hours_per_night}h) is below the recommended 7–8 hours.` });
      } else {
        factors.push({ icon: "✨", text: `Healthy nightly sleep routine (${payload.sleep_hours_per_night}h) supports cognitive recovery.` });
      }

      if (payload.avg_daily_usage_hours > 5.5) {
        factors.push({ icon: "📱", text: `High daily screen engagement (${payload.avg_daily_usage_hours}h) increases sensory fatigue.` });
      } else {
        factors.push({ icon: "🛡️", text: `Moderate daily screen usage (${payload.avg_daily_usage_hours}h) helps prevent overload.` });
      }

      if (payload.physical_activity_hours < 0.75) {
        factors.push({ icon: "🚶", text: "Low daily physical activity limits natural endorphin and dopamine regulation." });
      } else {
        factors.push({ icon: "🏃", text: `Consistent active movement (${payload.physical_activity_hours}h) aids stress resilience.` });
      }

      factors.forEach((f) => {
        const li = document.createElement("li");
        li.className = "factor-item";
        li.innerHTML = `<span class="factor-icon">${f.icon}</span><span>${f.text}</span>`;
        factorsList.appendChild(li);
      });
    }

    // Populate 3 Personalized, Actionable Self-Care Tips
    if (tipsList) {
      tipsList.innerHTML = "";
      const tips = [];

      if (payload.avg_daily_usage_hours > 4) {
        tips.push("Establish a '30-minute bedtime curfew' where devices charge across the room rather than bedside.");
      } else {
        tips.push("Practice 5-minute eye relaxation breaks every 50 minutes of focused digital study.");
      }

      if (payload.sleep_hours_per_night < 7) {
        tips.push("Aim for a consistent sleep and wake window, even on weekends, to stabilize circadian rhythm.");
      } else {
        tips.push("Pair your solid sleep baseline with gentle morning hydration before checking social feeds.");
      }

      if (payload.stress_level === "High" || payload.stress_level === "Very High") {
        tips.push("Try the Box Breathing exercise below for 3 minutes whenever academic deadlines feel overwhelming.");
      } else {
        tips.push("Engage in at least 20 minutes of outdoor daylight walking to uplift mood and energy.");
      }

      tips.forEach((tip, idx) => {
        const li = document.createElement("li");
        li.className = "tip-item";
        li.innerHTML = `<span class="tip-bullet">${idx + 1}</span><span>${tip}</span>`;
        tipsList.appendChild(li);
      });
    }

    if (window.lucide) window.lucide.createIcons();
  }

  function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const current = (progress * (end - start)) + start;
      obj.textContent = current.toFixed(2);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }

  // --------------------------------------------------------------------------
  // 7. CHART.JS DATASET VISUALIZATIONS (Based on 5,000 Student Records)
  // --------------------------------------------------------------------------
  let chartInstances = {};

  function renderCharts() {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    const textPrimary = isDark ? "#F3F4F6" : "#1F2A37";
    const textSecondary = isDark ? "#9CA3AF" : "#6B7280";
    const gridColor = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)";

    // Chart 1: Screen Time vs Sleep Duration
    const ctx1 = document.getElementById("chart-usage-vs-sleep");
    if (ctx1) {
      if (chartInstances.chart1) chartInstances.chart1.destroy();
      chartInstances.chart1 = new Chart(ctx1, {
        type: "line",
        data: {
          labels: ["1h", "2h", "3h", "4h", "5h", "6h", "7h", "8h+"],
          datasets: [
            {
              label: "Average Sleep (Hours)",
              data: [8.2, 7.9, 7.5, 7.1, 6.5, 6.1, 5.7, 5.2],
              borderColor: "#7FB69E",
              backgroundColor: "rgba(127, 182, 158, 0.15)",
              fill: true,
              tension: 0.35,
              pointBackgroundColor: "#5A9A7E",
              pointRadius: 4
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          scales: {
            x: {
              title: { display: true, text: "Daily Screen Time", color: textSecondary },
              grid: { color: gridColor },
              ticks: { color: textSecondary }
            },
            y: {
              title: { display: true, text: "Sleep Duration", color: textSecondary },
              min: 4,
              max: 9,
              grid: { color: gridColor },
              ticks: { color: textSecondary }
            }
          }
        }
      });
    }

    // Chart 2: Average Score by Platform
    const ctx2 = document.getElementById("chart-platform-scores");
    if (ctx2) {
      if (chartInstances.chart2) chartInstances.chart2.destroy();
      chartInstances.chart2 = new Chart(ctx2, {
        type: "bar",
        data: {
          labels: ["LinkedIn", "WhatsApp", "YouTube", "Instagram", "Facebook", "TikTok", "Snapchat"],
          datasets: [
            {
              label: "Avg Wellness Index",
              data: [7.2, 6.9, 6.7, 6.3, 6.1, 5.8, 5.6],
              backgroundColor: [
                "#7FB69E",
                "#8EC5E8",
                "#8EC5E8",
                "#B9A7E8",
                "#B9A7E8",
                "#F2A38C",
                "#F2A38C"
              ],
              borderRadius: 8
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          scales: {
            x: {
              grid: { display: false },
              ticks: { color: textSecondary, font: { size: 11 } }
            },
            y: {
              min: 4,
              max: 8,
              grid: { color: gridColor },
              ticks: { color: textSecondary }
            }
          }
        }
      });
    }

    // Chart 3: Perceived Stress Level Distribution
    const ctx3 = document.getElementById("chart-stress-dist");
    if (ctx3) {
      if (chartInstances.chart3) chartInstances.chart3.destroy();
      chartInstances.chart3 = new Chart(ctx3, {
        type: "doughnut",
        data: {
          labels: ["Low Stress (18%)", "Medium (42%)", "High (28%)", "Very High (12%)"],
          datasets: [
            {
              data: [18, 42, 28, 12],
              backgroundColor: ["#7FB69E", "#8EC5E8", "#B9A7E8", "#F2A38C"],
              borderWidth: 2,
              borderColor: isDark ? "#1D232E" : "#FFFFFF"
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "bottom",
              labels: { color: textSecondary, boxWidth: 12, padding: 12 }
            }
          },
          cutout: "68%"
        }
      });
    }
  }

  // --------------------------------------------------------------------------
  // 8. INTERACTIVE WELLNESS TOOLKIT
  // --------------------------------------------------------------------------
  function setupWellnessToolkit() {
    // 1. Box Breathing Reset
    const breatheWrap = document.getElementById("breathing-visual");
    const breatheLabel = document.getElementById("breathing-label");
    const breatheBtn = document.getElementById("breathing-toggle-btn");
    const breatheBtnText = document.getElementById("breathing-btn-text");
    let breathingInterval = null;
    let isBreathingActive = false;

    if (breatheBtn && breatheWrap && breatheLabel) {
      breatheBtn.addEventListener("click", () => {
        isBreathingActive = !isBreathingActive;

        if (isBreathingActive) {
          breatheBtnText.textContent = "Pause Exercise";
          breatheBtn.classList.replace("btn-secondary", "btn-ghost");
          runBreathingCycle();
        } else {
          breatheBtnText.textContent = "Start Breathing Exercise";
          breatheBtn.classList.replace("btn-ghost", "btn-secondary");
          clearInterval(breathingInterval);
          breatheWrap.className = "breathing-visual-wrap";
          breatheLabel.textContent = "Inhale";
        }
      });

      function runBreathingCycle() {
        let phase = 0; // 0: inhale (4s), 1: hold (4s), 2: exhale (4s), 3: hold (4s)
        const phases = [
          { text: "Inhale (4s)", class: "inhale" },
          { text: "Hold (4s)", class: "inhale" },
          { text: "Exhale (4s)", class: "exhale" },
          { text: "Rest (4s)", class: "exhale" }
        ];

        breatheWrap.className = `breathing-visual-wrap ${phases[0].class}`;
        breatheLabel.textContent = phases[0].text;

        breathingInterval = setInterval(() => {
          phase = (phase + 1) % 4;
          breatheWrap.className = `breathing-visual-wrap ${phases[phase].class}`;
          breatheLabel.textContent = phases[phase].text;
        }, 4000);
      }
    }

    // 2. Daily Affirmation Generator
    const newAffBtn = document.getElementById("new-affirmation-btn");
    const affText = document.getElementById("daily-affirmation-text");
    if (newAffBtn && affText) {
      newAffBtn.addEventListener("click", () => {
        if (window.ManSantulani18n) {
          affText.style.opacity = "0";
          setTimeout(() => {
            affText.textContent = `"${window.ManSantulani18n.getRandomAffirmation()}"`;
            affText.style.opacity = "1";
          }, 200);
        }
      });
    }

    // 3. Digital Detox Streak Counter
    const detoxCountEl = document.getElementById("detox-days-count");
    const detoxBtn = document.getElementById("detox-log-btn");
    const DETOX_KEY = "mansantulan_detox_streak";
    let currentStreak = parseInt(localStorage.getItem(DETOX_KEY), 10) || 3;

    if (detoxCountEl) detoxCountEl.textContent = currentStreak;

    if (detoxBtn) {
      detoxBtn.addEventListener("click", () => {
        currentStreak += 1;
        localStorage.setItem(DETOX_KEY, currentStreak);
        if (detoxCountEl) detoxCountEl.textContent = currentStreak;
        detoxBtn.disabled = true;
        detoxBtn.innerHTML = '<i data-lucide="check"></i> <span>Logged for Today!</span>';
        if (window.lucide) window.lucide.createIcons();
      });
    }
  }

  // --------------------------------------------------------------------------
  // 9. FAQ ACCORDION & EMERGENCY MODAL
  // --------------------------------------------------------------------------
  function setupAccordionAndModal() {
    // FAQ Accordion
    document.querySelectorAll(".faq-item").forEach((item) => {
      const btn = item.querySelector(".faq-question");
      if (!btn) return;
      btn.addEventListener("click", () => {
        const isOpen = item.classList.toggle("open");
        btn.setAttribute("aria-expanded", isOpen);
      });
    });

    // Emergency Floating Action Button (FAB) & Modal
    const helpFab = document.getElementById("help-fab");
    const helpModal = document.getElementById("help-modal");
    const helpClose = document.getElementById("help-modal-close");

    if (helpFab && helpModal) {
      helpFab.addEventListener("click", () => {
        helpModal.classList.add("open");
      });

      if (helpClose) {
        helpClose.addEventListener("click", () => {
          helpModal.classList.remove("open");
        });
      }

      helpModal.addEventListener("click", (e) => {
        if (e.target === helpModal) {
          helpModal.classList.remove("open");
        }
      });

      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && helpModal.classList.contains("open")) {
          helpModal.classList.remove("open");
        }
      });
    }
  }

  // --------------------------------------------------------------------------
  // 10. INITIALIZATION LIFECYCLE
  // --------------------------------------------------------------------------
  document.addEventListener("DOMContentLoaded", () => {
    setupUserGreeting();
    setupHeroMoodChips();
    setupScrollAnimations();
    setupThemeToggle();
    setupLanguageMenu();
    setupProfileMenu();
    setupWizardControls();
    setupPredictionSubmission();
    renderCharts();
    setupWellnessToolkit();
    setupAccordionAndModal();

    if (window.lucide) window.lucide.createIcons();
  });
})();
