import Notification from "../models/notificationModel.js";

// Fetch notifications for a user
const getNotifications = async (req, res) => {
    try {
        const userId = req.user?._id;
        const userType = req.role === 'citizen' ? 'User' : (req.role === 'gigworker' ? 'Worker' : 'Admin');

        const notifications = await Notification.find({ userId, userType })
            .sort({ createdAt: -1 })
            .limit(50);

        res.status(200).json({ success: true, notifications });
    } catch (error) {
        console.error("Error fetching notifications:", error.message);
        res.status(500).json({ success: false, message: "Could not fetch notifications" });
    }
};

// Mark notification as read
const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        await Notification.findByIdAndUpdate(id, { isRead: true });
        res.status(200).json({ success: true, message: "Notification marked as read" });
    } catch (error) {
        console.error("Error marking notification as read:", error.message);
        res.status(500).json({ success: false, message: "Could not mark notification as read" });
    }
};

// Helper function to create notification (not an API endpoint)
const createNotification = async (userId, userType, type, message) => {
    try {
        await Notification.create({ userId, userType, type, message });
    } catch (error) {
        console.error("Error creating notification helper:", error.message);
    }
};

export { getNotifications, markAsRead, createNotification };
