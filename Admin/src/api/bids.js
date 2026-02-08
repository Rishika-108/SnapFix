import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

/**
 * ==========================
 * 🧩 Bids API Service
 * ==========================

 * ✅ Fetch a specific report and all its bids
 * @param {string} reportId - The ID of the report
 * @param {string} token - Admin auth token (optional)
 * @returns {Promise<Object>} Report + its bids
 */
export const getReportWithBids = async (reportId, token = null) => {
  try {
    console.log('TOKEN:', token);
    const res = await axios.get(`${API_BASE_URL}/admin/bids/${reportId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return res.data;
  } catch (error) {
    console.error("❌ Error fetching report and bids:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * ✅ Approve a bid and assign the issue to the gig worker
 * @param {string} token - Admin auth token (optional)
 * @returns {Promise<Object>} Approved bid + created task
 */
export const assignBid = async (bidId, token = null) => {
  try {
    const res = await axios.put(`${API_BASE_URL}/admin/approve-bid/${bidId}`, null, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    return res.data;
  } catch (error) {
    console.error("❌ Error assigning bid:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * ✅ Utility to auto-fetch and log report + bids for debugging
 * @param {string} reportId - The report ID
 * @param {string} token - Admin auth token
 */
export const previewBids = async (reportId, token = null) => {
  try {
    const data = await getReportWithBids(reportId, token);
    console.table(
      data.getBids.map((b) => ({
        BidID: b._id,
        BidAmount: b.bidAmount,
        Duration: b.duration,
        Worker: b.gigWorkerId?.name,
        Email: b.gigWorkerId?.email,
      }))
    );
  } catch (error) {
    console.error("⚠️ Failed to preview bids:", error.message);
  }
};
