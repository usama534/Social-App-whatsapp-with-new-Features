// API/NotificationContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../Config';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notificationCount, setNotificationCount] = useState(0);
    const [unreadNotifications, setUnreadNotifications] = useState([]);
    const userId = localStorage.getItem('userId');

    const fetchNotifications = async () => {
        if (!userId) return;

        try {
            const response = await axios.get(
                `${API_URL}api/chat/pendingConfirmations/${userId}`
            );
            setUnreadNotifications(response.data);
            setNotificationCount(response.data.length);
        } catch (err) {
            console.error('Failed to fetch notifications:', err);
        }
    };

    // Add this to automatically fetch notifications periodically
    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 60000); // Update every minute
        return () => clearInterval(interval);
    }, [userId]);

    return (
        <NotificationContext.Provider value={{
            notificationCount,
            setNotificationCount,
            unreadNotifications,
            setUnreadNotifications,
            fetchNotifications // Expose fetch function
        }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => useContext(NotificationContext);