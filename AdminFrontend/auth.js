// auth.js - Authentication Utility for VAATCO Admin Panel
// Uses localStorage only for token storage (no cookies)

class AuthManager {
  constructor() {
    // Auto-detect API URL based on current hostname
    const hostname = window.location.hostname;
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      this.API_BASE_URL = "http://localhost:5000/api";
    } else {
      // Production — use Heroku backend
      this.API_BASE_URL = "https://vaatcobd-1e79cdd06ca7.herokuapp.com/api";
    }
    console.log("AuthManager API URL:", this.API_BASE_URL);
  }

  // Store authentication data in localStorage
  setAuthData(token, userData) {
    try {
      if (!token || !userData) {
        console.error("setAuthData: missing token or userData");
        return false;
      }

      localStorage.setItem("vaatco_admin_token", token);
      localStorage.setItem("vaatco_admin_user", JSON.stringify(userData));
      localStorage.setItem("vaatco_admin_auth", "true");

      console.log("Auth data stored successfully, token length:", token.length);
      return true;
    } catch (error) {
      console.error("Error storing auth data:", error);
      return false;
    }
  }

  // Get stored token from localStorage
  getToken() {
    const token = localStorage.getItem("vaatco_admin_token");
    return token || null;
  }

  // Get stored user data from localStorage
  getUserData() {
    try {
      const userData = localStorage.getItem("vaatco_admin_user");
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
    localStorage.removeItem("vaatco_admin_auth");
    localStorage.removeItem("vaatco_admin_token");
    localStorage.removeItem("vaatco_admin_user");
    console.log("Auth data cleared");
  }

  // Login function
  async login(email, password) {
    try {
      console.log("Attempting login to:", `${this.API_BASE_URL}/admin/login`);

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
      console.log("Login response status:", response.status);

      if (response.ok && data.status === true) {
        // Store authentication data
        const success = this.setAuthData(data.data.token, data.data.admin);

        if (success) {
          // Verify it was stored
          const storedToken = this.getToken();
          console.log("Token stored and verified:", !!storedToken, "length:", storedToken?.length);

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
      console.error("makeAuthenticatedRequest: No token in localStorage!");
      throw new Error("No authentication token found");
    }

    // Build headers — Authorization is always set from localStorage token
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    // Only set Content-Type for non-FormData bodies
    if (!(options.body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    // Merge any additional headers from options (but never overwrite Authorization)
    if (options.headers) {
      Object.keys(options.headers).forEach((key) => {
        if (key.toLowerCase() !== "authorization") {
          headers[key] = options.headers[key];
        }
      });
    }

    const mergedOptions = {
      ...options,
      headers,
    };

    console.log(`API Request: ${options.method || "GET"} ${url}`);
    console.log("Token being sent:", token.substring(0, 20) + "...");

    try {
      const response = await fetch(url, mergedOptions);

      if (response.status === 401) {
        console.warn("401 Unauthorized from:", url);
      }

      // Return response — callers decide how to handle errors
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

    if (this.isAuthenticated()) {
      if (isLoginPage) {
        console.log("User already authenticated, redirecting to dashboard");
        window.location.replace("dashboard.html");
        return;
      }
    } else {
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
    console.log("Token present:", !!this.getToken());
    console.log("User present:", !!this.getUserData());

    // Set up automatic redirect based on auth status
    this.redirectIfNeeded();
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
