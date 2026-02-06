// // src/api/api.js
// import axios from "axios";
// import {
//   dashboardInsights,
//   issueTrends,
//   areaPerformance,
//   recentReports,
//   heatmapReports,
// } from "./mockData";

// // 🌍 Backend Base URL
// const BASE_URL = 'http://localhost:3000/api' || process.env.REACT_APP_API_URL;

// // 🌐 Toggle Mock Mode
// const USE_MOCK = true;

// // 🕒 Simulated network delay helper
// const simulateNetworkDelay = (data, delay = 500) =>
//   new Promise((resolve) => setTimeout(() => resolve(data), delay));

// // ===============================
// // ✅ Axios Instance
// // ===============================
// const apiInstance = axios.create({
//   baseURL: BASE_URL,
//   headers: { "Content-Type": "application/json" },
//   timeout: 10000,
// });

// // ===============================
// // 🧩 AUTH ROUTES
// // ===============================
// export const AuthAPI = {
//   /**
//    * 👨‍💼 Admin / Government Worker Login
//    */
//   loginAdmin: async ({ email, password }) => {
//     if (USE_MOCK) {
//       return simulateNetworkDelay({
//         success: true,
//         message: "Login successful (mock)",
//         token: "dummy-token",
//         role: "Local",
//         admin: {
//           _id: "admin-dummy-" + Date.now(),
//           name: "Mock Admin",
//           email,
//         },
//       });
//     }

//     try {
//       const res = await apiInstance.post("/login-admin", { email, password });
//       console.log(res);
//       console.log(res.data);
//       // Return data directly for consistency
//       return res.data;
//     } catch (err) {
//       console.error("❌ Admin login failed:", err);
//       throw err.response?.data || { success: false, message: err.message || "Login failed" };
//     }
//   },
// };

// // 💾 Save JWT Token & User Data to Local Storage
// export const saveAuthData = (token, user) => {
//   try {
//     localStorage.setItem("token", token);
//     localStorage.setItem("user", JSON.stringify(user));
//   } catch (err) {
//     console.error("Failed to save auth data:", err);
//   }
// };

// // 🚪 Logout & Clear Session
// export const logout = () => {
//   try {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     window.location.href = "/";
//   } catch (err) {
//     console.error("Logout error:", err);
//   }
// };

// // ===============================
// // 📊 DASHBOARD & REPORT ROUTES
// // ===============================
// export const api = {
//   getDashboardInsights: async () => simulateNetworkDelay(dashboardInsights),
//   getIssueTrends: async () => simulateNetworkDelay(issueTrends),
//   getAreaPerformance: async () => simulateNetworkDelay(areaPerformance),

//   getRecentReports: async () => {
//     if (USE_MOCK) return simulateNetworkDelay(recentReports);

//     try {
//       const res = await apiInstance.get("/admin/all-reports");
//       return res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
//     } catch (err) {
//       console.warn("⚠️ Backend unavailable, using mock data");
//       return recentReports;
//     }
//   },

//   getHeatmapReports: async (status = "All") => {
//     if (USE_MOCK) return simulateNetworkDelay(heatmapReports);

//     try {
//       const res = await apiInstance.get("/admin/all-reports");
//       const reports = res.data;
//       if (status.toLowerCase() === "all") return reports;

//       return reports.filter(
//         (r) => r.status && r.status.toLowerCase() === status.toLowerCase()
//       );
//     } catch (err) {
//       console.warn("⚠️ Backend unavailable, using mock heatmap data");
//       return heatmapReports;
//     }
//   },

//   getReportById: async (reportId) => {
//     if (USE_MOCK) return simulateNetworkDelay(recentReports.find((r) => r._id === reportId));

//     try {
//       const res = await apiInstance.get(`/reports/${reportId}`);
//       return res.data;
//     } catch (err) {
//       console.error("Report fetch failed:", err);
//       throw new Error("Report not found");
//     }
//   },

//   getDashboardStatsSummary: async () => {
//     if (USE_MOCK) return simulateNetworkDelay({
//       totalReports: 10,
//       resolved: 5,
//       pending: 3,
//       inProgress: 2,
//       resolutionRate: "50.0",
//     });

//     try {
//       const res = await apiInstance.get("/admin/all-reports");
//       const reports = res.data;

//       const totalReports = reports.length;
//       const resolved = reports.filter((r) => r.status?.toLowerCase() === "resolved").length;
//       const pending = reports.filter((r) => r.status?.toLowerCase() === "pending").length;
//       const inProgress = reports.filter((r) => r.status?.toLowerCase() === "in progress").length;

//       return {
//         totalReports,
//         resolved,
//         pending,
//         inProgress,
//         resolutionRate: totalReports ? ((resolved / totalReports) * 100).toFixed(1) : "0.0",
//       };
//     } catch (err) {
//       console.warn("⚠️ Backend unavailable, using mock dashboard summary");
//       return {
//         totalReports: 0,
//         resolved: 0,
//         pending: 0,
//         inProgress: 0,
//         resolutionRate: "0.0",
//       };
//     }
//   },

//   getAllReports: async () => {
//     if (USE_MOCK) return simulateNetworkDelay(recentReports);

//     try {
//       const res = await apiInstance.get("/admin/all-reports");
//       return res.data;
//     } catch (err) {
//       console.warn("⚠️ Backend unavailable, returning mock reports");
//       return recentReports;
//     }
//   }, 
// };

// export default api;

import axios from "axios";

// 🌍 Backend Base URL
const BASE_URL ="http://localhost:3000/api";

// 🌐 Toggle Mock Mode (for fallback if backend is down)
const USE_MOCK = false;

// ===============================
// ✅ Axios Instance
// ===============================
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

  getDashboardStatsSummary: async () => {
    try {
      const res = await apiInstance.get("/admin/dashboard-summary");
      return res.data;
    } catch (err) {
      console.error("Failed to fetch dashboard summary:", err);
      throw err.response?.data || { success: false, message: "Could not fetch dashboard summary" };
    }
  },
};

export default api;
