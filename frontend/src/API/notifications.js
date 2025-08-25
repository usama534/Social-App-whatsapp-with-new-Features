import axios from 'axios';
import API_URL from '../Config';
import { data } from 'react-router-dom';

export const fetchUnreadNotifications = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}api/notifications/getUnreadNotifications/${userId}`);
        console.log("response data ", response.data);
        return response.data;  // Return the data
    } catch (error) {
        console.error("Error fetching unread notifications", error);
        throw error;
    }
};

export const fetchAllNotifications = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}api/notifications/getNotifications/${userId}`);
        console.log("Notification Data:", JSON.stringify(data, null, 2));
        console.log("response data ", JSON.stringify(response.data));
        return response.data;
    } catch (error) {
        console.error("Error fetching all notifications", error);
        throw error;
    }
};
export const pushNotification = async (user, actor, content, image1, image2) => {
    try {
        const response = await axios.post(`${API_URL}api/notifications/pushNotification`, {
            user,
            actor,
            content,
            image1,
            image2,
        });
        return response.data;
    } catch (error) {
        console.error("Error sending notification", error);
        throw error;
    }
};
export const markNotificationAsRead = async (notificationId) => {
    try {
        const response = await axios.put(`${API_URL}api/notifications/markAsRead/${notificationId}`);
        return response.data;  // Return the updated notification data
    } catch (error) {
        console.error("Error marking notification as read", error);
        throw error;
    }
};
