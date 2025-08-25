// frontend/src/API/homepage.js
import axios from "axios";
import API_URL from "../Config";

// Add a Post
export const addPost = async (formData) => {
    try {
        const response = await axios.post(`${API_URL}api/posts/addPost`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (err) {
        if (err.response) {
            // Forward backend error messages
            throw new Error(err.response.data.message || 'Upload failed');
        }
        throw err;
    }
};

// Get Posts for a User
export const fetchPosts = async (uid) => {
    const res = await axios.get(`${API_URL}api/posts/getPosts/${uid}`);
    return res.data;
};

// Toggle Post Like
export const togglePostLike = async (piid, uid, state) => {
    const res = await axios.put(`${API_URL}api/posts/togglePostLike/${piid}/${uid}/${state}`);
    return res.data;
};

// Add Comment
export const addComment = async (pid, author, content) => {
    const res = await axios.post(`${API_URL}api/posts/addComment/${pid}`, {
        author,
        content,
    });
    return res.data;
};

// Toggle Commenting on a Post
export const toggleCommenting = async (pId) => {
    const res = await axios.put(`${API_URL}api/posts/toggleCommenting/${pId}`);
    return res.data;
};

// Toggle Like/Unlike on Comment
export const toggleCommentInteraction = async (cid, uid, state) => {
    const res = await axios.put(`${API_URL}api/posts/toggleCommentInteraction/${cid}/${uid}/${state}`);
    return res.data;
};

// Get Comments for a Post
export const getComments = async (pid, uid) => {
    const res = await axios.get(`${API_URL}api/posts/getComments/${pid}/${uid}`);
    return res.data;
};

// Change Post Visibility
export const changeVisibility = async (pId, vis) => {
    const res = await axios.put(`${API_URL}api/posts/changeVisbility/${pId}/${vis}`);
    return res.data;
};

// frontend/src/API/homepage.js
export const getOfficialPosts = async (uid) => {
    try {
        const res = await axios.get(`${API_URL}api/feed/getOfficialPosts/${uid}`);
        return res.data;

    } catch (err) {
        console.error("Error fetching official posts:", err);
        return [];
    }
};


export const getTeacherPosts = async (uid) => {
    try {
        const res = await axios.get(`${API_URL}api/feed/getTeacherWallPosts/${uid}`);
        return res.data;

    } catch (err) {
        console.error("Error fetching official posts:", err);
        return [];
    }
};