/* ==========================================================================
   MANSANTULAN (मन संतुलन) — AUTHENTICATION & SESSION MANAGEMENT
   Architecture: Client-side storage placeholder with cryptographic hashing
   Backend integration hooks ready for future FastAPI / Flask JWT endpoints.
   ========================================================================== */

/* ==========================================================================
   FUTURE BACKEND ENDPOINTS TO ADD TO main.py:
   --------------------------------------------------------------------------
   1. POST /auth/register
      Body: { "name": str, "email": EmailStr, "password": str, "age_group": str }
      Returns: { "access_token": str, "token_type": "bearer", "user": { ... } }

   2. POST /auth/login
      Body: { "email": EmailStr, "password": str }
      Returns: { "access_token": str, "token_type": "bearer", "user": { ... } }

   3. POST /auth/forgot-password
      Body: { "email": EmailStr }
      Returns: { "message": "Password reset instructions sent." }

   4. POST /auth/reset-password
      Body: { "token": str, "new_password": str }
      Returns: { "message": "Password updated successfully." }

   5. GET /auth/me
      Header: Authorization: Bearer <token>
      Returns: Current user profile object.
   ========================================================================== */

(() => {
  "use strict";

  const STORAGE_USERS_KEY = "mansantulan_registered_users";
  const STORAGE_SESSION_KEY = "mansantulan_active_session";

  // SHA-256 client-side hash helper to prevent plaintext storage
  async function hashString(str) {
    if (!window.crypto || !window.crypto.subtle) {
      // Fallback simple checksum if SubtleCrypto is unavailable in insecure contexts
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash |= 0;
      }
      return "hash_" + Math.abs(hash);
    }
    const msgBuffer = new TextEncoder().encode(str);
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  // User retrieval
  function getUsers() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_USERS_KEY)) || [];
    } catch {
      return [];
    }
  }

  function saveUsers(users) {
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
  }

  // Active session management
  function getSession() {
    try {
      const session = JSON.parse(localStorage.getItem(STORAGE_SESSION_KEY));
      return session && session.email ? session : null;
    } catch {
      return null;
    }
  }

  function setSession(user, remember = true) {
    const sessionData = {
      name: user.name,
      email: user.email,
      ageGroup: user.ageGroup || "18-24",
      loggedInAt: new Date().toISOString()
    };
    if (remember) {
      localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(sessionData));
    } else {
      sessionStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(sessionData));
    }
  }

  function clearSession() {
    localStorage.removeItem(STORAGE_SESSION_KEY);
    sessionStorage.removeItem(STORAGE_SESSION_KEY);
  }

  // Core Auth API (Simulated with async promises)
  async function registerUser({ name, email, password, ageGroup }) {
    // TODO: Replace with: await fetch(`${API_BASE}/auth/register`, { ... })
    const users = getUsers();
    const cleanEmail = email.trim().toLowerCase();

    if (users.some((u) => u.email === cleanEmail)) {
      throw new Error("An account with this email address already exists.");
    }

    const passwordHash = await hashString(password);
    const newUser = {
      name: name.trim(),
      email: cleanEmail,
      passwordHash,
      ageGroup,
      registeredAt: new Date().toISOString()
    };

    users.push(newUser);
    saveUsers(users);
    setSession(newUser, true);
    return newUser;
  }

  async function loginUser(email, password, remember = true) {
    // TODO: Replace with: await fetch(`${API_BASE}/auth/login`, { ... })
    const cleanEmail = email.trim().toLowerCase();
    const users = getUsers();
    const user = users.find((u) => u.email === cleanEmail);

    if (!user) {
      // Demo fallback: If user hasn't registered yet, create a provisional student account
      const passwordHash = await hashString(password);
      const provisionalName = cleanEmail.split("@")[0].replace(/[^a-zA-Z]/g, " ");
      const formattedName = provisionalName ? (provisionalName.charAt(0).toUpperCase() + provisionalName.slice(1)) : "Student";
      const newUser = {
        name: formattedName,
        email: cleanEmail,
        passwordHash,
        ageGroup: "18-24",
        registeredAt: new Date().toISOString()
      };
      users.push(newUser);
      saveUsers(users);
      setSession(newUser, remember);
      return newUser;
    }

    const inputHash = await hashString(password);
    if (user.passwordHash !== inputHash) {
      throw new Error("Incorrect password. Please verify your credentials.");
    }

    setSession(user, remember);
    return user;
  }

  function loginDemoUser() {
    const demoUser = {
      name: "Alex Sharma",
      email: "alex.sharma@university.edu",
      ageGroup: "18-24"
    };
    setSession(demoUser, true);
    return demoUser;
  }

  function logoutUser() {
    // TODO: Replace with: await fetch(`${API_BASE}/auth/logout`, { ... })
    clearSession();
    window.location.href = "login.html";
  }

  // Password strength calculator (0 to 4 score)
  function calculatePasswordStrength(password) {
    let score = 0;
    if (!password) return { score: 0, label: "Empty", color: "var(--border-default)" };

    if (password.length >= 6) score += 1;
    if (password.length >= 10) score += 1;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) score += 1;

    const levels = [
      { score: 1, label: "Weak", color: "var(--coral)" },
      { score: 2, label: "Fair", color: "var(--coral-dark)" },
      { score: 3, label: "Good", color: "var(--calm-blue-dark)" },
      { score: 4, label: "Strong & Safe", color: "var(--sage-dark)" }
    ];

    return levels[Math.max(0, score - 1)];
  }

  // Guard: Redirect unauthenticated users
  function enforceAuthentication() {
    const currentSession = getSession();
    if (!currentSession) {
      window.location.href = "login.html";
    }
    return currentSession;
  }

  // Expose as global namespace
  window.ManSantulanAuth = {
    getSession,
    setSession,
    clearSession,
    registerUser,
    loginUser,
    loginDemoUser,
    logoutUser,
    calculatePasswordStrength,
    enforceAuthentication
  };
})();
