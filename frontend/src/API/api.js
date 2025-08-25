// src/api/api.js
import axios from "axios";
import API_URL from "../Config"; // adjust path if needed

export const getFriends = async (uid) => {
    try {
        const res = await axios.get(`${API_URL}api/user/getFriends/${uid}`);
        return res.data || []; // Since your backend returns just the array
    } catch (error) {
        console.error("Failed to fetch friends:", error);
        return [];
    }
};

export const initiateChat = async (senderId, receiverId) => {
    const res = await axios.post(`${API_URL}api/chat/initiateChat/${senderId}/${receiverId}`);
    return res.data.id;
};

export const getPendingRequests = async (uid) => {
    try {
        const res = await axios.get(`${API_URL}api/user/getPendingRequests/${uid}`);
        return res.data;
    } catch (error) {
        console.error("Error fetching pending requests:", error);
        return [];
    }
};

export const createVipCollection = async (uid, person) => {
    try {
        const res = await axios.post(`${API_URL}api/user/createVipCollection/${uid}`, {
            person,
        });
        return res.data.id;
    } catch (err) {
        console.error("Error creating VIP collection:", err);
        return null;
    }
};

export const getVipCollections = async (uid) => {
    try {
        const res = await axios.get(`${API_URL}api/user/getVipCollections/${uid}`);
        console.log(JSON.stringify(res.data));
        return res.data;
    } catch (err) {
        console.error("Error fetching VIP collections:", err);
        return [];
    }
};


export const getVipChat = async (id) => {
    try {
        const res = await axios.get(`${API_URL}api/user/getVipChat/${id}`);
        return res.data;
    } catch (err) {
        console.error("Error fetching VIP chat:", err);
        return null;
    }
};


export const fetchGroups = async (userId) => {
    try {
        const res = await axios.get(`${API_URL}api/user/getGroups/${userId}`);
        return res.data;
    } catch (error) {
        console.error("Error fetching groups:", error);
        return [];
    }
};

// Add these to your API functions
export const getChats = async (userId) => {
    try {
        const res = await axios.get(`${API_URL}api/chat/user/${userId}`);
        return res.data;
    } catch (error) {
        console.error("Error fetching chats:", error);
        throw error;
    }
};

export const getSingleChat = async (chatId, userId, messageCount = 20) => {
    try {
        const res = await axios.get(
            `${API_URL}api/chat/getChat/${chatId}/${userId}/${messageCount}`
        );
        return res.data;
    } catch (error) {
        console.error("Error fetching chat:", error);
        throw error;
    }
};