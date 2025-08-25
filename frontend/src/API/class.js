import axios from "axios";
import API_URL from "../Config"; // Adjust path if your Config file is located differently

// 1. Get Class Walls Data by Type and User ID
export const getClassWallsData = async (type, uid) => {
    try {
        const res = await axios.get(`${API_URL}api/feed/getClassWallsData/${type}/${uid}`);
        return res.data;
    } catch (err) {
        console.error("Error fetching class walls data:", err);
        return [];
    }
};

// 2. Get Class Posts by Group ID and User ID
export const getClassPosts = async (gid, uid) => {
    try {
        const res = await axios.get(`${API_URL}api/feed/getClassPosts/${gid}/${uid}`);
        return res.data;
    } catch (err) {
        console.error("Error fetching class posts:", err);
        return [];
    }
};

// 3. Get Class Wall Posts by Group ID and User ID
export const getClassWallPosts = async (gid, uid) => {
    try {
        const res = await axios.get(`${API_URL}api/feed/getClassWallPosts/${gid}/${uid}`);
        return res.data;
    } catch (err) {
        console.error("Error fetching class wall posts:", err);
        return [];
    }
};
