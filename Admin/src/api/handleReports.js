import axios from "axios";

// ✅ Base API configuration
const API_BASE_URL =  "http://localhost:3000/api" || process.env.REACT_APP_API_URL;

/**
 * Fetch all reports from the admin reports endpoint.
 *
 * @param {string|null} token - Optional admin authentication token.
 * @returns {Promise<Array>} - List of all reports.
 */
export const getAllReports = async (token = null) => {
  try {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await axios.get(`${API_BASE_URL}/admin/allreports`, { headers });

    if (response?.data) return response.data;

    throw new Error("Invalid response structure");
  } catch (error) {
    console.error("❌ Error fetching all reports:", error.message);
    throw error;
  }
};

/**
 * Fetch reports filtered by status.
 *
 * @param {string} status - "pending" | "inprogress" | "completed" | "all"
 * @param {string|null} token - Optional auth token.
 * @returns {Promise<Array>} - Filtered reports.
 */
export const getReports = async (status = "all", token = null) => {
  try {
    const allReports = await getAllReports(token);

    if (status.toLowerCase() === "all") return allReports;

    return allReports.filter(
      (report) => report.status?.toLowerCase() === status.toLowerCase()
    );
  } catch (error) {
    console.error(`❌ Error filtering reports by status (${status}):`, error.message);
    throw error;
  }
};

/**
 * Get summarized report statistics.
 *
 * @param {string|null} token - Optional auth token.
 * @returns {Promise<Object>} - Object containing counts by status.
 */
export const getReportStats = async (token = null) => {
  try {
    const allReports = await getAllReports(token);
    const normalized = allReports.map((r) => r.status?.toLowerCase());

    return {
      active: normalized.filter((s) => s === "inprogress" || s === "active").length,
      pending: normalized.filter((s) => s === "pending").length,
      completed: normalized.filter((s) => s === "completed" || s === "resolved").length,
      total: allReports.length,
    };
  } catch (error) {
    console.error("❌ Error fetching report stats:", error.message);
    throw error;
  }
};

/**
 * Helper: Print reports in readable format (optional).
 */
export const printReports = (reports) => {
  if (!Array.isArray(reports)) {
    console.log("No reports found or invalid format.");
    return;
  }

  reports.forEach((report, index) => {
    console.log(`\nReport #${index + 1}`);
    console.log(`Title: ${report.title}`);
    console.log(`Category: ${report.category}`);
    console.log(`Status: ${report.status}`);
    console.log(`Created By: ${report.createdBy}`);
    console.log(`Created At: ${new Date(report.createdAt).toLocaleString()}`);
    if (report.location?.coordinates) {
      console.log(`Location: [${report.location.coordinates.join(", ")}]`);
    }
  });
};
