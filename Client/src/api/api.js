import axios from "axios";

// Base URL (backend)
// const BASE_URL = "https://snapfix-fl1e.onrender.com/api";
const BASE_URL = import.meta.env.VITE_API_URL;

//  Axios instance
const api = axios.create({
  baseURL: BASE_URL,
});

//  Auto-attach JWT token if exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});


// ======================== AUTH ROUTES ========================
export const AuthAPI = {
  registerCitizen: async (data) => {
    return api.post("/auth/register-citizen", data);
  },

  loginCitizen: async (data) => {
    return api.post("/auth/login-citizen", data);
  },

// ======================== WORKER ROUTES ========================
  registerWorker: async (data) => { 
    return api.post("/auth/register-worker", data);
  },

  loginWorker: async (data) => {
    return api.post("/auth/login-worker", data);
  },
}

// ======================== CITIZEN ROUTES ========================
export const CitizenAPI = {
  createReport: (data,config) => api.post("/report/create-report", data, config),

  upvoteReport: (reportId) => api.post(`/report/upvote/${reportId}`),

  getReportById: (reportId) => api.get(`/report/get-report/${reportId}`),

  getNearbyReports: () => api.get("/report/location"),

  getMyReports: () => api.get("/user/my-reports"),

  verifyTask: (taskId, isSatisfied) => api.post(`/task/verify/${taskId}`, { isSatisfied }),
};
 
// ======================== WORKER ROUTES ========================
export const WorkerAPI = {
  getNearbyReports: () => api.get("/worker/location"),

  getProfile: () => api.get("/worker/profile"),

  createBid: (reportId, data) => api.post(`/bid/create-bid/${reportId}`, data),

  getBidsForReport: (reportId) => api.get(`/bid/getBid-report/${reportId}`),

  uploadTaskProof: (taskId, data) => api.post(`/task/proof-upload/${taskId}`, data),

  getMyTasks: () => api.get("/task/my-tasks"),

  getTaskDetail: (taskId) => api.get(`/task/${taskId}`),
};
// ======================== NOTIFICATION ROUTES ========================
export const NotificationAPI = {
  getNotifications: () => api.get("/notifications"),
  markAsRead: (id) => api.put(`/notifications/read/${id}`),
};
// ======================== HELPERS ========================
export const saveAuthData = (token, user) => {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/";
};

export default api;
