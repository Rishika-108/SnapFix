import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check, X } from 'lucide-react';
import { NotificationAPI } from '../../api/api';
import { useLocation } from 'react-router-dom';

const NotificationDropdown = () => {
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const dropdownRef = useRef(null);
    const location = useLocation();

    const fetchNotifications = async () => {
        try {
            const res = await NotificationAPI.getNotifications();
            if (res.data.success) {
                setNotifications(res.data.notifications);
                setUnreadCount(res.data.notifications.filter(n => !n.isRead).length);
            }
        } catch (err) {
            console.error("Failed to fetch notifications:", err);
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
        return () => clearInterval(interval);
    }, [location]);

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
            await NotificationAPI.markAsRead(id);
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
                className="relative p-2 text-gray-600 hover:text-indigo-600 transition-colors"
            >
                <Bell size={24} />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="fixed sm:absolute left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-0 mt-2 w-[92vw] sm:w-80 bg-white rounded-lg shadow-xl border border-gray-100 z-[100] overflow-hidden max-sm:top-16 max-sm:max-w-sm">
                    <div className="p-3 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                        <span className="font-semibold text-gray-700">Notifications</span>
                        <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
                            <X size={18} />
                        </button>
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-gray-400">
                                <p>No notifications yet</p>
                            </div>
                        ) : (
                            notifications.map((notification) => (
                                <div
                                    key={notification._id}
                                    className={`p-4 border-b border-gray-50 transition-colors ${notification.isRead ? 'bg-white' : 'bg-blue-50/50'}`}
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-800">{notification.type}</p>
                                            <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                                            <p className="text-[10px] text-gray-400 mt-1">
                                                {new Date(notification.createdAt).toLocaleString()}
                                            </p>
                                        </div>
                                        {!notification.isRead && (
                                            <button
                                                onClick={() => handleMarkAsRead(notification._id)}
                                                className="ml-2 p-1 text-indigo-400 hover:text-indigo-600"
                                                title="Mark as read"
                                            >
                                                <Check size={16} />
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

export default NotificationDropdown;
