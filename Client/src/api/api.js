import axios from "axios";
import {
  DummyAPI,
  dummyReports,
  dummyCitizens,
  dummyWorkers,
  dummyAdmins,
  dummyBids,
  dummyTasks,
} from "./dummyData";

// 🌍 Toggle between dummy mode and real API
const USE_DUMMY = false; // 🔁 set false to connect to backend

// 🌍 Base URL (backend)
const BASE_URL = "http://localhost:3000/api";

// 🧩 Axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🛡️ Auto-attach JWT token if exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

//
// ======================== AUTH ROUTES ========================
//
export const AuthAPI = {
  // RegisterCitizen 
  registerCitizen: async (data) => {
    return api.post("/auth/register-citizen", data);
  },

  //LoginCitizen
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
  createReport: (data) =>
    USE_DUMMY
      ? Promise.resolve({
          data: {
            success: true,
            message: "Report raised successfully (dummy)",
            report: {
              _id: "rep-dummy-" + Date.now(),
              status: "Pending",
              upvotes: 0,
              createdBy: dummyCitizens[0],
              ...data,
            },
          },
        })
      : api.post("/report/create-report", data),

  upvoteReport: (reportId) =>
    USE_DUMMY
      ? Promise.resolve({
          data: {
            success: true,
            message: `Issue ${reportId} upvoted (dummy)`,
          },
        })
      : api.post(`/report/upvote/${reportId}`),

  getReportById: (reportId) =>
    USE_DUMMY
      ? Promise.resolve({
          data: {
            success: true,
            report: dummyReports.find((r) => r._id === reportId),
          },
        })
      : api.get(`/report/get-report/${reportId}`),

  getNearbyReports: () =>
    USE_DUMMY
      ? Promise.resolve({
          data: {
            success: true,
            message: "Fetched dummy reports based on location",
            count: dummyReports.length,
            reports: dummyReports,
          },
        })
      : api.get("/report/location"),

  getMyReports: () =>
    USE_DUMMY
      ? Promise.resolve({
          data: {
            success: true,
            message: "Successfully fetched user reports (dummy)",
            reports: dummyReports,
            upvotedReports: [dummyReports[1]],
          },
        })
      : api.get("/user/my-reports"),
};

//
// ======================== WORKER ROUTES ========================
//
export const WorkerAPI = {
  getNearbyReports: () =>
    USE_DUMMY
      ? Promise.resolve({
          data: {
            success: true,
            message: "Fetched nearby dummy reports",
            count: dummyReports.length,
            reports: dummyReports,
          },
        })
      : api.get("/worker/location"),

  getProfile: () =>
    USE_DUMMY
      ? Promise.resolve({
          data: {
            success: true,
            worker: dummyWorkers[0],
          },
        })
      : api.get("/worker/profile"),

  createBid: (reportId, data) =>
    USE_DUMMY
      ? Promise.resolve({
          data: {
            success: true,
            message: "Bid applied successfully (dummy)",
            bid: {
              _id: "bid-dummy-" + Date.now(),
              reportId,
              gigWorkerId: dummyWorkers[0],
              status: "Pending",
              ...data,
            },
          },
        })
      : api.post(`/bid/create-bid/${reportId}`, data),

  getBidsForReport: (reportId) =>
    USE_DUMMY
      ? Promise.resolve({
          data: {
            success: true,
            message: "Fetched dummy bids",
            bids: dummyBids.filter((b) => b.reportId === reportId),
          },
        })
      : api.get(`/bid/getBid-report/${reportId}`),

  uploadTaskProof: (taskId, data) =>
    USE_DUMMY
      ? Promise.resolve({
          data: {
            success: true,
            message: "Proof uploaded successfully (dummy)",
            task: {
              _id: taskId,
              reportId: dummyTasks[0].reportId,
              gigWorkerId: dummyWorkers[0]._id,
              proof: {
                ...data,
                uploadedAt: new Date().toISOString(),
                location: { lat: 18.52, lng: 73.85 },
              },
              status: "Completed",
            },
          },
        })
      : api.post(`/task/proof-upload/${taskId}`, data),

  getTaskDetail: (taskId) =>
    USE_DUMMY
      ? Promise.resolve({
          data: {
            success: true,
            message: "Task details fetched successfully (dummy)",
            task: dummyTasks.find((t) => t._id === taskId),
          },
        })
      : api.get(`/task/${taskId}`),
};

//
// ======================== ADMIN ROUTES ========================
//
export const AdminAPI = {
  getAllReports: () =>
    USE_DUMMY
      ? Promise.resolve({
          data: {
            success: true,
            message: "Reports fetched successfully (dummy)",
            reports: dummyReports,
          },
        })
      : api.get("/admin/all-reports"),

  getReportWithBids: (reportId) =>
    USE_DUMMY
      ? Promise.resolve({
          data: {
            success: true,
            message: "Report with bids fetched successfully (dummy)",
            report: dummyReports.find((r) => r._id === reportId),
            getBids: dummyBids.filter((b) => b.reportId === reportId),
          },
        })
      : api.get(`/admin/bids/${reportId}`),

  approveBid: (bidId) =>
    USE_DUMMY
      ? Promise.resolve({
          data: {
            success: true,
            message: "Bid approved (dummy)",
            bid: {
              _id: bidId,
              reportId: dummyBids[0].reportId,
              gigWorkerId: dummyWorkers[0]._id,
              status: "Approved",
            },
            task: {
              _id: "task-dummy-" + Date.now(),
              reportId: dummyBids[0].reportId,
              gigWorkerId: dummyWorkers[0]._id,
              status: "Assigned",
              paymentStatus: "Pending",
            },
          },
        })
      : api.put(`/admin/approve-bid/${bidId}`),
};

//
// ======================== HELPERS ========================
//
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
