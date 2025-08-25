import axios from "axios";
import API_URL from "../Config";

// ✅ Schedule a new message
export const saveScheduledMessage = async (userId, chatId, messageContent, pushTime, attachments = []) => {
  try {
    const formData = new FormData();
    formData.append("chats", chatId);
    formData.append("messageContent", messageContent);
    formData.append("senderId", userId);
    formData.append("pushTime", pushTime.toISOString());

    // Agar koi attachment bhejna hai toh yeh use karo
    // attachments.forEach((file) => {
    //   formData.append("messageAttchments", file);
    // });

    const response = await axios.post(`${API_URL}api/chat/scheduleMessage`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("❌ Error scheduling message:", error);
    throw error;
  }
};


// ❌ Delete scheduled message by ID
export const deleteScheduledMessage = async (messageId) => {
  try {
    const response = await axios.delete(`${API_URL}api/chat/deleteScheduledMessage/${messageId}`);
    return response.data;
  } catch (error) {
    console.error("❌ Error deleting scheduled message:", error);
    throw error;
  }
};