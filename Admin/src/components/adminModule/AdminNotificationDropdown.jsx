import React, { useState, useEffect, useRef } from 'react';
import { FiBell, FiCheck, FiX } from 'react-icons/fi';
import { api } from '../../api/api';

const AdminNotificationDropdown = () => {
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const dropdownRef = useRef(null);

    const fetchNotifications = async () => {
        try {
            const res = await api.getNotifications();
            if (res.success) {
                setNotifications(res.notifications);
                setUnreadCount(res.notifications.filter(n => !n.isRead).length);
            }
        } catch (err) {
            console.error("Failed to fetch notifications:", err);
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleMarkAsRead = async (id) => {
        try {
            await api.markAsRead(id);
            setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) {
            console.error("Failed to mark as read:", err);
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-full hover:bg-blue-600/20 text-gray-300 hover:text-blue-400 transition"
            >
                <FiBell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-[#142E4D] border border-white/10 rounded-xl shadow-lg z-50 overflow-hidden animate-fadeIn">
                    <div className="p-3 border-b border-white/10 flex justify-between items-center bg-[#0E2439]/50">
                        <span className="font-semibold text-gray-200">Notifications</span>
                        <div className="flex gap-2">
                            {unreadCount > 0 && <span className="text-[10px] bg-blue-600 px-1.5 py-0.5 rounded text-white">{unreadCount} New</span>}
                            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-200">
                                <FiX size={18} />
                            </button>
                        </div>
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-gray-400">
                                <p>No new notifications</p>
                            </div>
                        ) : (
                            notifications.map((notification) => (
                                <div
                                    key={notification._id}
                                    className={`p-4 border-b border-white/5 transition-colors ${notification.isRead ? 'bg-transparent' : 'bg-blue-600/10'}`}
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-blue-200">{notification.type}</p>
                                            <p className="text-xs text-gray-300 mt-1">{notification.message}</p>
                                            <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider">
                                                {new Date(notification.createdAt).toLocaleString()}
                                            </p>
                                        </div>
                                        {!notification.isRead && (
                                            <button
                                                onClick={() => handleMarkAsRead(notification._id)}
                                                className="ml-2 p-1 text-gray-400 hover:text-blue-400"
                                                title="Mark as read"
                                            >
                                                <FiCheck size={16} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminNotificationDropdown;
