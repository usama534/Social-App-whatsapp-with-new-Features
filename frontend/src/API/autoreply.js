import axios from "axios";
import API_URL from "../Config";

// ✅ Fetch Auto Replies + toggle state
export const fetchAutoReplies = async (userId, chatId) => {
  try {
    const url = `${API_URL}api/chat/getAutoReplies/${userId}/${chatId}`;
    console.log("✅ Constructed URL:", url);

    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching auto-replies:", error);
  }
};

// ✅ Save New Auto Reply
export const saveAutoReply = async (userId, chatId, message, reply) => {
  try {
    const url = `${API_URL}api/chat/addAutoReply/${userId}/${chatId}`;
    console.log("✅ Constructed URL:", url);

    const response = await axios.post(url, [{ message, reply }]);
    return response.data;
  } catch (error) {
    console.error("❌ Error saving auto-reply:", error);
  }
};

// ✅ Delete Auto Reply
export const deleteAutoReply = async (autoReplyId) => {
  try {
    const url = `${API_URL}api/chat/removeAutoReply/${autoReplyId}`;
    console.log("✅ Constructed URL:", url);

    // Change axios.delete to axios.put
    const response = await axios.put(url);
    return response.data;
  } catch (error) {
    console.error("❌ Error deleting auto-reply:", error);
  }
};

// ✅ NEW: Update Auto Reply Toggle
export const updateAutoReplyToggle = async (userId, chatId, isEnabled) => {
  try {
    const url = `${API_URL}api/user/toggleAutoReply/${userId}/${chatId}`;
    console.log("✅ Constructed Toggle URL:", url);

    const response = await axios.post(url, { isEnabled });
    return response.data;
  } catch (error) {
    console.error("❌ Error updating auto-reply toggle:", error);
  }
};

// API/autoreply.js

export const editAutoReply = async (userId, chatId, id, trigger, reply) => {
  try {
    const response = await fetch(`/editAutoReply/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: trigger, reply: reply }), // Send updated message and reply
    });

    if (response.ok) {
      const data = await response.json();
      return data.autoReply; // Return the updated auto-reply object
    }
    throw new Error("Failed to edit auto-reply");
  } catch (error) {
    console.error("❌ Error editing auto-reply:", error);
    throw error;
  }
};
