import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

const apiInstance = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

// Attach JWT token automatically if available
apiInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ===============================
// 🧩 AUTH ROUTES
// ===============================
export const AuthAPI = {
  loginAdmin: async ({ email, password }) => {
    try {
      const res = await apiInstance.post("/auth/login-admin", { email, password });
      return res.data;
    } catch (err) {
      console.error("❌ Admin login failed:", err);
      throw err.response?.data || { success: false, message: err.message || "Login failed" };
    }
  },
};

// 💾 Save JWT Token & User Data to Local Storage
export const saveAuthData = (token, user) => {
  try {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
  } catch (err) {
    console.error("Failed to save auth data:", err);
  }
};

// 🚪 Logout & Clear Session
export const logout = () => {
  try {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  } catch (err) {
    console.error("Logout error:", err);
  }
};

// ===============================
// 📊 REPORT & DASHBOARD ROUTES
// ===============================
export const api = {
  getAllReports: async () => {
    try {
      const res = await apiInstance.get("/admin/all-reports");
      return res.data;
    } catch (err) {
      console.error("Failed to fetch reports:", err);
      throw err.response?.data || { success: false, message: "Failed to fetch reports" };
    }
  },

  getReportById: async (reportId) => {
    try {
      const res = await apiInstance.get(`/admin/report/${reportId}`);
      return res.data;
    } catch (err) {
      console.error("Failed to fetch report:", err);
      throw err.response?.data || { success: false, message: "Report not found" };
    }
  },

  // don't need this
  getReportWithBids: async (reportId) => {
    try {
      const res = await apiInstance.get(`/admin/bids/${reportId}`);
      return res.data;
    } catch (err) {
      console.error("Failed to fetch report with bids:", err);
      throw err.response?.data || { success: false, message: "Report with bids not found" };
    }
  },

  approveBid: async (bidId) => {
    try {
      const res = await apiInstance.put(`/admin/approve-bid/${bidId}`);
      return res.data;
    } catch (err) {
      console.error("Failed to approve bid:", err);
      throw err.response?.data || { success: false, message: "Could not approve bid" };
    }
  },

  releasePayment: async (taskId) => {
    try {
      const res = await apiInstance.put(`/admin/release-payment/${taskId}`);
      return res.data;
    } catch (err) {
      console.error("Failed to release payment:", err);
      throw err.response?.data || { success: false, message: "Could not release payment" };
    }
  },

  getCompletedTasks: async () => {
    try {
      const res = await apiInstance.get("/admin/completed-tasks");
      return res.data;
    } catch (err) {
      console.error("Failed to fetch completed tasks:", err);
      throw err.response?.data || { success: false, message: "Could not fetch completed tasks" };
    }
  },

  getDashboardStatsSummary: async () => {
    try {
      const res = await apiInstance.get("/admin/dashboard-summary");
      return res.data;
    } catch (err) {
      console.error("Failed to fetch dashboard summary:", err);
      throw err.response?.data || { success: false, message: "Could not fetch dashboard summary" };
    }
  },

  getNotifications: async () => {
    try {
      const res = await apiInstance.get("/notifications");
      return res.data;
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
      throw err.response?.data || { success: false, message: "Could not fetch notifications" };
    }
  },

  markAsRead: async (id) => {
    try {
      const res = await apiInstance.put(`/notifications/read/${id}`);
      return res.data;
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
      throw err.response?.data || { success: false, message: "Could not mark notification as read" };
    }
  },
};

export default api;
