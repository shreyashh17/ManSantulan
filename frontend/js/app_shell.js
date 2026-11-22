/* ==========================================================================
   MANSANTULAN (मन संतुलन) — APP SHELL CONTROLLER
   Full-stack Client Shell: Sidebar, Theme, Language, Live Search & Notifications
   ========================================================================== */

(() => {
  "use strict";

  // 1. Sidebar Collapse State
  function setupSidebar() {
    const sidebar = document.getElementById("app-sidebar");
    const toggleBtn = document.getElementById("sidebar-toggle-btn");
    if (!sidebar || !toggleBtn) return;

    const savedState = localStorage.getItem("sidebar_collapsed");
    if (savedState === "true") {
      sidebar.classList.add("collapsed");
    }

    toggleBtn.addEventListener("click", () => {
      sidebar.classList.toggle("collapsed");
      localStorage.setItem("sidebar_collapsed", sidebar.classList.contains("collapsed"));
    });
  }

  // 2. Theme Toggle (Light / Dark)
  function setupTheme() {
    const themeBtn = document.getElementById("theme-btn");
    const currentTheme = localStorage.getItem("mansantulan_theme") || "light";
    document.documentElement.setAttribute("data-theme", currentTheme);
    updateThemeIcon(currentTheme);

    if (themeBtn) {
      themeBtn.addEventListener("click", () => {
        const nextTheme = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", nextTheme);
        localStorage.setItem("mansantulan_theme", nextTheme);
        updateThemeIcon(nextTheme);
      });
    }
  }

  function updateThemeIcon(theme) {
    const icon = document.getElementById("theme-icon");
    if (!icon) return;
    icon.setAttribute("data-lucide", theme === "dark" ? "sun" : "moon");
    if (window.lucide) window.lucide.createIcons();
  }

  // 3. Language Selector
  function setupLanguage() {
    const langBtn = document.getElementById("lang-btn");
    const langMenu = document.getElementById("lang-menu");
    if (!langBtn || !langMenu) return;

    langBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      langMenu.classList.toggle("open");
    });

    document.addEventListener("click", () => langMenu.classList.remove("open"));

    document.querySelectorAll("[data-lang-choice]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const lang = btn.getAttribute("data-lang-choice");
        if (window.i18n) window.i18n.setLanguage(lang);
        langMenu.classList.remove("open");
      });
    });
  }

  // 4. Global Search Modal (Ctrl+K) & Live Filtering
  const SEARCH_ITEMS = [
    {
      title: "Student Sanctuary (Dashboard)",
      desc: "Daily balance score, weekly trends, streak counter & affirmations",
      category: "Sanctuary",
      url: "/dashboard",
      icon: "layout-dashboard",
      keywords: "home dashboard overview streak progress stats score weekly"
    },
    {
      title: "AI Mental Balance Assessment",
      desc: "12-factor predictive assessment powered by student social habit model",
      category: "Assessment",
      url: "/assessment",
      icon: "sparkles",
      keywords: "predict machine learning test score survey habit screening diagnostic"
    },
    {
      title: "Wellness Sanctuary Toolkit",
      desc: "4-4-4-4 Box Breathing, Study Pomodoro Timer, and Ambient Audio",
      category: "Wellness",
      url: "/wellness",
      icon: "heart",
      keywords: "breathe breathing meditation pomodoro focus timer ambient sounds calm relax"
    },
    {
      title: "Box Breathing Technique (4-4-4-4)",
      desc: "Vagus nerve reset exercise for acute stress and exam anxiety",
      category: "Wellness",
      url: "/wellness#breathing",
      icon: "wind",
      keywords: "breathing panic exam heart rate calm grounding box 4444"
    },
    {
      title: "Study Pomodoro Focus Timer",
      desc: "Interval productivity timer tuned for student cognitive retention",
      category: "Wellness",
      url: "/wellness#pomodoro",
      icon: "clock",
      keywords: "focus study timer pomodoro intervals sprint concentration"
    },
    {
      title: "Data Observatory & Insights",
      desc: "Statistical analysis of 5,000 student social media & mental health records",
      category: "Data",
      url: "/insights",
      icon: "bar-chart-2",
      keywords: "data insights statistics correlation charts dataset research analytics"
    },
    {
      title: "24/7 Verified Crisis Helplines",
      desc: "Immediate 1-click calling: Tele-MANAS (14416), iCall (TISS), Vandrevala",
      category: "Crisis",
      url: "/helplines",
      icon: "phone-call",
      keywords: "help emergency crisis distress suicide call support telemanas icall free"
    },
    {
      title: "Student Coping Guides",
      desc: "Evidence-based reading on exam anxiety, sleep hygiene, and digital fatigue",
      category: "Resources",
      url: "/resources",
      icon: "book-open",
      keywords: "articles guides tips reading coping sleep exam burnout fatigue"
    },
    {
      title: "Student Profile & Identity",
      desc: "View academic info, age group, role, and connected university profile",
      category: "Account",
      url: "/profile",
      icon: "user",
      keywords: "profile account user details name email edit"
    },
    {
      title: "Security & Credentials",
      desc: "Update password, review active sessions, and configure login security",
      category: "Account",
      url: "/security",
      icon: "shield",
      keywords: "security password change login sessions credentials"
    },
    {
      title: "Privacy Center & Data Export",
      desc: "Download full JSON personal data archive or exercise right to be forgotten",
      category: "Account",
      url: "/privacy-center",
      icon: "lock",
      keywords: "privacy data export download gdpr delete erase account sovereign"
    },
    {
      title: "Platform Overview & Features",
      desc: "Detailed tour of all algorithms, clinical guardrails, and tools",
      category: "General",
      url: "/features",
      icon: "layers",
      keywords: "features about overview platform tools"
    },
    {
      title: "Frequently Asked Questions (FAQ)",
      desc: "Answers regarding privacy, ML algorithm accuracy, and student safety",
      category: "General",
      url: "/faq",
      icon: "help-circle",
      keywords: "faq questions help answers doubts"
    }
  ];

  function ensureSearchModalDOM() {
    let modal = document.getElementById("search-modal");
    if (!modal) {
      modal = document.createElement("div");
      modal.className = "modal-backdrop";
      modal.id = "search-modal";
      modal.setAttribute("role", "dialog");
      modal.setAttribute("aria-modal", "true");
      modal.setAttribute("aria-label", "Global Quick Search");
      modal.innerHTML = `
        <div class="modal-dialog search-modal-dialog">
          <div class="search-input-wrap">
            <i data-lucide="search" style="width: 20px; height: 20px; color: var(--text-muted); flex-shrink: 0;"></i>
            <input type="text" class="search-modal-input" id="global-search-input" placeholder="Search tools, assessments, coping guides... (Esc to close)" autocomplete="off" />
            <button type="button" class="icon-btn" id="close-search-btn" aria-label="Close search" style="width: 32px; height: 32px;">
              <i data-lucide="x" style="width: 16px; height: 16px;"></i>
            </button>
          </div>
          <div class="search-results-list" id="search-results"></div>
          <div style="padding: 10px 18px; border-top: 1px solid var(--border-subtle); background: var(--bg-card-hover); display: flex; justify-content: space-between; align-items: center; font-size: 0.75rem; color: var(--text-muted);">
            <span>Navigate with <kbd style="background: var(--bg-card); padding: 1px 5px; border-radius: 3px; border: 1px solid var(--border-default);">↑</kbd> <kbd style="background: var(--bg-card); padding: 1px 5px; border-radius: 3px; border: 1px solid var(--border-default);">↓</kbd> and <kbd style="background: var(--bg-card); padding: 1px 5px; border-radius: 3px; border: 1px solid var(--border-default);">Enter</kbd></span>
            <span>Close with <kbd style="background: var(--bg-card); padding: 1px 5px; border-radius: 3px; border: 1px solid var(--border-default);">Esc</kbd></span>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
      if (window.lucide) window.lucide.createIcons();
    }
    return modal;
  }

  function setupSearch() {
    const searchModal = ensureSearchModalDOM();
    const searchInput = document.getElementById("global-search-input");
    const resultsContainer = document.getElementById("search-results");
    const closeBtn = document.getElementById("close-search-btn");
    let activeIndex = -1;

    function renderResults(query = "") {
      const q = query.trim().toLowerCase();
      let matched = SEARCH_ITEMS;

      if (q) {
        matched = SEARCH_ITEMS.filter(item => {
          return item.title.toLowerCase().includes(q) ||
                 item.desc.toLowerCase().includes(q) ||
                 item.category.toLowerCase().includes(q) ||
                 item.keywords.toLowerCase().includes(q);
        });
      }

      activeIndex = -1;
      resultsContainer.innerHTML = "";

      if (matched.length === 0) {
        resultsContainer.innerHTML = `
          <div style="padding: 32px 16px; text-align: center; color: var(--text-muted);">
            <div style="font-size: 2rem; margin-bottom: 8px;">🔍</div>
            <p style="font-weight: 600; color: var(--text-primary); margin-bottom: 4px;">No matching results for "${escapeHtml(q)}"</p>
            <p style="font-size: 0.85rem;">Try searching for <em>assessment</em>, <em>breathing</em>, <em>pomodoro</em>, or <em>helplines</em>.</p>
          </div>
        `;
        return;
      }

      matched.forEach((item, index) => {
        const itemEl = document.createElement("a");
        itemEl.href = item.url;
        itemEl.className = "search-result-item";
        itemEl.dataset.index = index;
        itemEl.innerHTML = `
          <div style="display: flex; align-items: center; gap: 14px; min-width: 0;">
            <div style="width: 36px; height: 36px; border-radius: var(--radius-md); background: var(--bg-card-hover); display: flex; align-items: center; justify-content: center; flex-shrink: 0; color: var(--sage-dark);">
              <i data-lucide="${item.icon}" style="width: 18px; height: 18px;"></i>
            </div>
            <div style="min-width: 0;">
              <div style="font-weight: 600; font-size: 0.95rem; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                ${highlightMatch(item.title, q)}
              </div>
              <div style="font-size: 0.8rem; color: var(--text-secondary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                ${item.desc}
              </div>
            </div>
          </div>
          <span class="badge badge-sage" style="font-size: 0.7rem; flex-shrink: 0; padding: 2px 8px;">${item.category}</span>
        `;
        resultsContainer.appendChild(itemEl);
      });

      if (window.lucide) window.lucide.createIcons();
    }

    function highlightMatch(text, query) {
      if (!query) return escapeHtml(text);
      const safeText = escapeHtml(text);
      const safeQuery = escapeHtml(query);
      const regex = new RegExp(`(${safeQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, "gi");
      return safeText.replace(regex, `<mark style="background: rgba(127,182,158,0.3); color: inherit; padding: 0 2px; border-radius: 2px;">$1</mark>`);
    }

    function escapeHtml(str) {
      return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    }

    function openSearch() {
      searchModal.classList.add("open");
      if (searchInput) {
        searchInput.value = "";
        renderResults("");
        setTimeout(() => searchInput.focus(), 50);
      }
    }

    function closeSearch() {
      searchModal.classList.remove("open");
    }

    // Trigger button listeners
    document.querySelectorAll(".search-trigger").forEach((btn) => {
      btn.addEventListener("click", openSearch);
    });

    if (closeBtn) closeBtn.addEventListener("click", closeSearch);
    searchModal.addEventListener("click", (e) => {
      if (e.target === searchModal) closeSearch();
    });

    // Keyboard Shortcuts
    document.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (searchModal.classList.contains("open")) {
          closeSearch();
        } else {
          openSearch();
        }
      }
      if (e.key === "Escape" && searchModal.classList.contains("open")) {
        closeSearch();
      }
    });

    // Input filtering & Arrow Key navigation
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        renderResults(e.target.value);
      });

      searchInput.addEventListener("keydown", (e) => {
        const items = resultsContainer.querySelectorAll(".search-result-item");
        if (items.length === 0) return;

        if (e.key === "ArrowDown") {
          e.preventDefault();
          activeIndex = (activeIndex + 1) % items.length;
          updateHighlight(items);
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          activeIndex = (activeIndex - 1 + items.length) % items.length;
          updateHighlight(items);
        } else if (e.key === "Enter" && activeIndex >= 0 && items[activeIndex]) {
          e.preventDefault();
          items[activeIndex].click();
        }
      });
    }

    function updateHighlight(items) {
      items.forEach((it, idx) => {
        if (idx === activeIndex) {
          it.classList.add("highlighted");
          it.scrollIntoView({ block: "nearest" });
        } else {
          it.classList.remove("highlighted");
        }
      });
    }
  }

  // 5. Notifications Popover System
  const DEFAULT_NOTIFICATIONS = [
    {
      id: "notif-1",
      title: "Evening Mindful Check-in 🌙",
      desc: "Take 2 minutes to record your screen time and reflect on today's mental rhythm.",
      time: "10m ago",
      icon: "moon",
      link: "/assessment"
    },
    {
      id: "notif-2",
      title: "3-Day Consistency Streak! 🔥",
      desc: "Fantastic habit building. You've completed mindful pauses 3 days in a row.",
      time: "2h ago",
      icon: "sparkles",
      link: "/dashboard"
    },
    {
      id: "notif-3",
      title: "Digital Sunset Recommendation 🌅",
      desc: "Gradually power down screens 45 minutes before sleep to support melatonin release.",
      time: "5h ago",
      icon: "wind",
      link: "/wellness"
    },
    {
      id: "notif-4",
      title: "Weekly Insights Observatory Updated 📊",
      desc: "Aggregated statistical analysis on student sleep vs screen time is now available.",
      time: "1d ago",
      icon: "bar-chart-2",
      link: "/insights"
    }
  ];

  function setupNotifications() {
    const notifBtn = document.getElementById("notifications-btn");
    if (!notifBtn) return;

    // Ensure wrapper and popover panel exist
    let wrapper = notifBtn.closest(".notifications-wrapper");
    if (!wrapper) {
      wrapper = document.createElement("div");
      wrapper.className = "notifications-wrapper";
      notifBtn.parentNode.insertBefore(wrapper, notifBtn);
      wrapper.appendChild(notifBtn);
    }

    let panel = document.getElementById("notifications-panel");
    if (!panel) {
      panel = document.createElement("div");
      panel.className = "notifications-panel";
      panel.id = "notifications-panel";
      panel.innerHTML = `
        <div class="notifications-header">
          <div style="display: flex; align-items: center; gap: 8px;">
            <strong style="font-size: 0.95rem;">Notifications</strong>
            <span class="badge badge-sage" id="notifications-count-badge" style="font-size: 0.72rem; padding: 2px 8px;">3 New</span>
          </div>
          <button type="button" class="btn btn-secondary btn-sm" id="mark-all-read-btn" style="font-size: 0.75rem; padding: 4px 8px; border: none; background: transparent; color: var(--sage-dark); font-weight: 600;">Mark all read</button>
        </div>
        <div class="notifications-list" id="notifications-list"></div>
      `;
      wrapper.appendChild(panel);
    }

    const badgeDot = notifBtn.querySelector(".notification-badge-dot") || document.getElementById("notifications-badge");
    const countBadge = document.getElementById("notifications-count-badge");
    const listEl = document.getElementById("notifications-list");
    const markAllBtn = document.getElementById("mark-all-read-btn");

    function getReadIds() {
      try {
        return JSON.parse(localStorage.getItem("mansantulan_read_notifications") || "[]");
      } catch (e) {
        return [];
      }
    }

    function saveReadIds(ids) {
      localStorage.setItem("mansantulan_read_notifications", JSON.stringify(ids));
    }

    function renderNotifications() {
      const readIds = getReadIds();
      const unreadCount = DEFAULT_NOTIFICATIONS.filter(n => !readIds.includes(n.id)).length;

      if (badgeDot) {
        badgeDot.style.display = unreadCount > 0 ? "block" : "none";
      }
      if (countBadge) {
        countBadge.textContent = unreadCount > 0 ? `${unreadCount} New` : "All read";
        countBadge.className = unreadCount > 0 ? "badge badge-sage" : "badge";
      }

      if (!listEl) return;
      listEl.innerHTML = "";

      DEFAULT_NOTIFICATIONS.forEach(n => {
        const isUnread = !readIds.includes(n.id);
        const itemEl = document.createElement("div");
        itemEl.className = `notification-item ${isUnread ? "unread" : ""}`;
        itemEl.innerHTML = `
          <div style="width: 36px; height: 36px; border-radius: var(--radius-full); background: ${isUnread ? "var(--sage-light)" : "var(--bg-card-hover)"}; display: flex; align-items: center; justify-content: center; flex-shrink: 0; color: ${isUnread ? "var(--sage-dark)" : "var(--text-muted)"};">
            <i data-lucide="${n.icon}" style="width: 18px; height: 18px;"></i>
          </div>
          <div style="flex: 1; min-width: 0;">
            <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 2px;">
              <span style="font-weight: 600; font-size: 0.88rem; color: var(--text-primary);">${n.title}</span>
              <span style="font-size: 0.72rem; color: var(--text-muted);">${n.time}</span>
            </div>
            <p style="font-size: 0.8rem; color: var(--text-secondary); line-height: 1.4; margin: 0 0 6px 0;">${n.desc}</p>
            <a href="${n.link}" style="font-size: 0.75rem; font-weight: 600; color: var(--sage-dark); text-decoration: none; display: inline-flex; align-items: center; gap: 4px;">
              Open Tool <span>→</span>
            </a>
          </div>
          ${isUnread ? '<span style="width: 6px; height: 6px; border-radius: 50%; background: var(--coral-dark); flex-shrink: 0; margin-top: 6px;"></span>' : ''}
        `;

        itemEl.addEventListener("click", (e) => {
          if (!readIds.includes(n.id)) {
            readIds.push(n.id);
            saveReadIds(readIds);
            renderNotifications();
          }
        });

        listEl.appendChild(itemEl);
      });

      if (window.lucide) window.lucide.createIcons();
    }

    // Toggle panel
    notifBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      panel.classList.toggle("open");
    });

    // Close on outside click
    document.addEventListener("click", (e) => {
      if (!wrapper.contains(e.target)) {
        panel.classList.remove("open");
      }
    });

    // Mark all as read
    if (markAllBtn) {
      markAllBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const allIds = DEFAULT_NOTIFICATIONS.map(n => n.id);
        saveReadIds(allIds);
        renderNotifications();
      });
    }

    renderNotifications();
  }

  // 6. Offline Status Detector
  function setupOfflineBanner() {
    const banner = document.getElementById("offline-status-banner");
    if (!banner) return;

    function updateOnlineStatus() {
      if (!navigator.onLine) {
        banner.style.display = "flex";
      } else {
        banner.style.display = "none";
      }
    }

    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);
    updateOnlineStatus();
  }

  // 7. User Profile Display
  function setupUserProfile() {
    if (!window.api) return;
    const user = window.api.getUser();
    const nameEl = document.getElementById("shell-user-name");
    const avatarEl = document.getElementById("shell-user-avatar");
    const logoutBtn = document.getElementById("shell-logout-btn");

    if (user && nameEl) {
      nameEl.textContent = user.name.split(" ")[0];
    }
    if (user && avatarEl) {
      const initials = user.name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();
      avatarEl.textContent = initials || "ST";
    }
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => window.api.logout());
    }
  }

  // 8. Scroll Reveal Observer
  function setupScrollReveal() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.querySelectorAll(".reveal-on-scroll").forEach((el) => el.classList.add("is-revealed"));
      return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-revealed");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll(".reveal-on-scroll").forEach((el) => observer.observe(el));
  }

  // Initialize all components on DOM ready
  document.addEventListener("DOMContentLoaded", () => {
    setupSidebar();
    setupTheme();
    setupLanguage();
    setupSearch();
    setupNotifications();
    setupOfflineBanner();
    setupUserProfile();
    setupScrollReveal();

    if (window.lucide) {
      window.lucide.createIcons();
    }
  });
})();
