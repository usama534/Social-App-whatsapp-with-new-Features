import axios from "axios";
import API_URL from "../Config";

// 1. Add Post
export const addPost = async (formData) => {
  try {
    const res = await axios.post(`${API_URL}api/posts/addPost`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (error) {
    console.error("Error posting:", error);
    throw error;
  }
};

// 2. Get Posts
export const fetchPosts = async (uid) => {
  try {
    const res = await axios.get(`${API_URL}api/posts/getPosts/${uid}`);
    // console.log("POST: " + JSON.stringify(res.data));
    return res.data;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
};

// 3. Toggle Post Like
// export const togglePostLike = async (piid, uid, state) => {
//   try {
//     const res = await axios.put(`${API_URL}api/posts/togglePostLike/${piid}/${uid}/${state}`);
//     console.log("Like Res : " + res.data);
//     return res.data;
//   } catch (error) {
//     console.error("Error toggling like:", error);
//     throw error;
//   }
// };

export const togglePostLike = async (piid, uid, state) => {
  try {
    const res = await axios.put(`${API_URL}api/posts/togglePostLike/${piid}/${uid}/${state}`);
    console.log("Like Res:", res.data);
    return res.data.currentState;
  } catch (error) {
    console.error("Error toggling like:", error);
    throw error;
  }
};

// 4. Add Comment
export const addComment = async (pid, commentData) => {
  try {
    const res = await axios.post(`${API_URL}api/posts/addComment/${pid}`, commentData);
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.error("Error adding comment:", error);
    console.log("Sending comment:", commentData);
    throw error;
  }

};

// 5. Toggle Commenting
export const toggleCommenting = async (pId) => {
  try {
    const res = await axios.put(`${API_URL}api/posts/toggleCommenting/${pId}`);
    return res.data;
  } catch (error) {
    console.error("Error toggling commenting:", error);
    throw error;
  }
};

// 6. Toggle Comment Interaction
export const toggleCommentInteraction = async (cid, uid, state) => {
  try {
    const res = await axios.put(`${API_URL}api/posts/toggleCommentInteraction/${cid}/${uid}/${state}`);
    return res.data;
  } catch (error) {
    console.error("Error toggling comment interaction:", error);
    throw error;
  }
};

// 7. Get Comments
export const getComments = async (pid, uid) => {
  try {
    const res = await axios.get(`${API_URL}api/posts/getComments/${pid}/${uid}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw error;
  }
};

// 8. Change Visibility
export const changeVisibility = async (pId, vis) => {
  try {
    const res = await axios.put(`${API_URL}api/posts/changeVisbility/${pId}/${vis}`);
    return res.data;
  } catch (error) {
    console.error("Error changing visibility:", error);
    throw error;
  }
};

// 9. Toggle Post Pin
export const togglePostPin = async (pinData) => {
  try {
    const res = await axios.post(`${API_URL}api/posts/togglePostPin`, pinData);
    console.log('Toggle Post Pin' + res.data);
    return res.data;
  } catch (error) {
    console.error("Error toggling pin:", error);
    throw error;
  }
};


// export const deletePost = async (pId) => {
//   try {
//     console.log("Deleting post with ID:", pId); // Debugging line
//     const res = await axios.delete(`${API_URL}api/posts/deletePost/${pId}`);
//     console.log("Post deleted response:", res.data);
//     return res.data;
//   } catch (error) {
//     console.error("Error deleting post:", error);
//     throw error;
//   }
// };

export const deletePost = async (pid, deleteAll = false) => {
  try {
    const response = await axios.delete(`${API_URL}api/posts/deletePost`, {
      data: {
        pid,
        deleteAll
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting post:", error);
    throw error;
  }
};

export const getSocialFeed = async (uid) => {
  try {
    const response = await axios.get(`${API_URL}api/feed/getSocialFeed/${uid}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching social feed:", error);
    return { success: false, message: "Error fetching feed" };
  }
};

export const getGroup = async (gId, rId) => {
  try {
    const response = await axios.get(`${API_URL}/group/getGroup/${gId}/${rId}`);
    return response.data; // groupInfo, isCreator, isAdmin, isMember, posts
  } catch (error) {
    console.error("Error fetching group data:", error);
    return { success: false, message: "Error fetching group" };
  }
};