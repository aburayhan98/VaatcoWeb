// auth.js - Authentication Utility for VAATCO Admin Panel

class AuthManager {
  constructor() {
    this.API_BASE_URL = "https://vaatcobd-1e79cdd06ca7.herokuapp.com/api";
    this.TOKEN_COOKIE_NAME = "vaatco_admin_token";
    this.USER_COOKIE_NAME = "vaatco_admin_user";
    this.COOKIE_EXPIRE_DAYS = 30; // 30 days expiration
  }

  // Cookie management utilities
  setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = "expires=" + date.toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)};${expires};path=/;SameSite=None;Secure`;
  }

  getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  deleteCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }

  // Store authentication data
  setAuthData(token, userData) {
    try {
      console.log("userData", userData);
      this.setCookie(this.TOKEN_COOKIE_NAME, token, this.COOKIE_EXPIRE_DAYS);
      this.setCookie(
        this.USER_COOKIE_NAME,
        JSON.stringify(userData),
        this.COOKIE_EXPIRE_DAYS
      );

      // Also store in localStorage as backup
      localStorage.setItem("vaatco_admin_auth", "true");
      localStorage.setItem("vaatco_admin_token", token);
      localStorage.setItem("vaatco_admin_user", JSON.stringify(userData));

      console.log("Auth data stored successfully");
      return true;
    } catch (error) {
      console.error("Error storing auth data:", error);
      return false;
    }
  }

  // Get stored token
  getToken() {
    return (
      this.getCookie(this.TOKEN_COOKIE_NAME) ||
      localStorage.getItem("vaatco_admin_token")
    );
  }

  // Get stored user data
  getUserData() {
    try {
      const userData =
        this.getCookie(this.USER_COOKIE_NAME) ||
        localStorage.getItem("vaatco_admin_user");
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error("Error parsing user data:", error);
      return null;
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    const token = this.getToken();
    const userData = this.getUserData();
    return !!(token && userData);
  }

  // Clear authentication data
  clearAuth() {
    this.deleteCookie(this.TOKEN_COOKIE_NAME);
    this.deleteCookie(this.USER_COOKIE_NAME);

    // Also clear localStorage
    localStorage.removeItem("vaatco_admin_auth");
    localStorage.removeItem("vaatco_admin_token");
    localStorage.removeItem("vaatco_admin_user");

    console.log("Auth data cleared");
  }

  // Login function
  async login(email, password) {
    try {
      console.log("Attempting login...");

      const response = await fetch(`${this.API_BASE_URL}/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password.trim(),
        }),
      });

      const data = await response.json();
      console.log("Login response:", data);

      if (response.ok && data.status === true) {
        // Store authentication data
        const success = this.setAuthData(data.data.token, data.data.admin);

        if (success) {
          return {
            success: true,
            message: data.message || "Login successful",
            user: data.data.admin,
            token: data.data.token,
          };
        } else {
          return {
            success: false,
            message: "Failed to store authentication data",
          };
        }
      } else {
        return {
          success: false,
          message: data.message || "Login failed",
        };
      }
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message: "Network error. Please check your connection and try again.",
      };
    }
  }

  // Logout function
  logout() {
    this.clearAuth();
    console.log("User logged out successfully");

    // Redirect to login page
    if (
      window.location.pathname !== "/login.html" &&
      !window.location.pathname.endsWith("login.html")
    ) {
      window.location.href = "login.html";
    }
  }

  // Verify token with server (optional - for enhanced security)
  async verifyToken() {
    const token = this.getToken();
    if (!token) return false;

    try {
      const response = await fetch(`${this.API_BASE_URL}/admin/verify`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        return data.status === true;
      }

      return false;
    } catch (error) {
      console.error("Token verification error:", error);
      return false;
    }
  }

  // Get authorization headers for API requests
  getAuthHeaders() {
    const token = this.getToken();
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }

  // Make authenticated API request
  async makeAuthenticatedRequest(url, options = {}) {
    const token = this.getToken();

    if (!token) {
      throw new Error("No authentication token found");
    }

    const defaultOptions = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        ...options.headers,
      },
    };

    const mergedOptions = { ...defaultOptions, ...options };

    try {
      const response = await fetch(url, mergedOptions);

      // If unauthorized, clear auth and redirect to login
      if (response.status === 401) {
        this.clearAuth();
        window.location.href = "login.html";
        throw new Error("Authentication expired");
      }

      return response;
    } catch (error) {
      console.error("Authenticated request error:", error);
      throw error;
    }
  }

  // Redirect based on authentication status
  redirectIfNeeded() {
    const currentPage = window.location.pathname;
    const isLoginPage =
      currentPage.includes("login.html") || currentPage === "/login.html";
    const isDashboardPage =
      currentPage.includes("dashboard.html") ||
      currentPage === "/dashboard.html";

    if (this.isAuthenticated()) {
      // If logged in and on login page, redirect to dashboard
      if (isLoginPage) {
        console.log("User already authenticated, redirecting to dashboard");
        window.location.replace("dashboard.html");
        return;
      }
    } else {
      // If not logged in and on protected page, redirect to login
      if (!isLoginPage) {
        console.log("User not authenticated, redirecting to login");
        window.location.replace("login.html");
        return;
      }
    }
  }

  // Initialize auth checking for the current page
  init() {
    console.log("AuthManager initialized");

    // Set up automatic redirect based on auth status
    this.redirectIfNeeded();

    // Optional: Set up periodic token verification
    // this.setupTokenVerification();
  }

  // Setup periodic token verification (optional)
  setupTokenVerification() {
    // Verify token every 30 minutes
    setInterval(async () => {
      if (this.isAuthenticated()) {
        const isValid = await this.verifyToken();
        if (!isValid) {
          console.log("Token verification failed, logging out");
          this.logout();
        }
      }
    }, 30 * 60 * 1000); // 30 minutes
  }

  // Get current user info
  getCurrentUser() {
    return this.getUserData();
  }

  // Update user data
  updateUserData(newUserData) {
    const token = this.getToken();
    if (token && newUserData) {
      return this.setAuthData(token, newUserData);
    }
    return false;
  }
}

// Create global instance
window.authManager = new AuthManager();

// Auto-initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  window.authManager.init();
});

// Export for module usage (if needed)
if (typeof module !== "undefined" && module.exports) {
  module.exports = AuthManager;
}
