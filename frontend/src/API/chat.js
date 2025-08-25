import axios from "axios";
import { io } from "socket.io-client";
import API_URL from "../Config";
import { fetchAutoReplies } from "./autoreply";

const socket = io(API_URL, { transports: ["websocket"] });

//Fetch all chats for a user
export const fetchChats = async (userId) => {
  if (!userId) {
    console.error("Error: No userId found!");
    return [];
  }
  console.log('User ID: ' + userId);
  try {
    const response = await axios.get(`${API_URL}api/chat/getAllChats/${userId}`);
    console.log('getAllChats : ' + JSON.stringify(response.data));
    return response.data;
  } catch (error) {
    console.error("Error fetching chats:", error);
    return [];
  }
};

// Fetch messages for a specific chat
export const fetchMessages = async (chatId, userId) => {
  try {
    const response = await axios.get(`${API_URL}api/chat/getChat/${chatId}/${userId}/0`);
    console.log("API Response:", response.data.messages);
    var last_msg = response.data.messages.length - 1;
    const senderIds = [];
    console.log(`UserID: `, response.data);
    response.data.messages.forEach((message) => {
      if (message.senderId._id !== userId && !senderIds.includes(message.senderId._id)) {
        // console.log(message.senderId._id);
        senderIds.push(message.senderId._id);
      }
    });
    console.log("Receiver Id: " + senderIds);

    if (senderIds.length > 0) {
      if (response.data.messages[last_msg].senderId._id === userId) {
        console.log("Last Message:", response.data.messages[last_msg].content);
        const autoReplyData = await fetchAutoReplies(senderIds[0], chatId);
        if (autoReplyData && autoReplyData.length > 0) {
          console.log('autoReplyData: ' + JSON.stringify(autoReplyData));
          autoReplyData.forEach(async (reply, index) => {
            // Perform operations on each reply
            if (reply.message === response.data.messages[last_msg].content) {
              console.log(`Message #${index + 1}:`, reply.message);
              console.log(`Reply #${index + 1}:`, reply.reply);
              // const resp = await sendMessage(chatId, senderIds[0], reply.reply);
              // if (resp) {
              //   console.log('auto reply sent...')
              // }
            }
          });
        }
      }
    }
    return response.data;
  } catch (error) {
    console.error(" Error fetching messages:", error.response?.data || error.message);
    return {};
  }
};


export const sendMessage = async (chatId, senderId, content) => {
  if (!chatId || !senderId) {
    console.error(" Error: chatId or senderId missing");
    return null;
  }

  try {
    const response = await axios.post(`${API_URL}api/chat/sendMessage/${chatId}`, {
      senderId,
      content,
    });

    //Emit socket event for real-time update
    socket.emit("sendMessage", {
      chatId,
      messageId: response.data.message_id,
      senderId,
    });

    return response.data;
  } catch (error) {
    console.error("Error sending message:", error);
    return null;
  }
};

//Fetch all users for starting a new chat
export const fetchUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}api/user/getAllUsers`);
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};


export const deleteMessage = async (messageId, chatId) => {
  try {
    console.log("messageid : " + messageId);
    console.log("chatid : " + chatId);
    const res = await axios.delete(`${API_URL}api/chat/deleteMessage/${messageId}/${chatId}`);
    return res.data;
  } catch (err) {
    console.error("Error in deleteMessage:", err);
    throw err;
  }
};
// Initiate chat between two users (sender and receiver)
export const initiateChat = async (senderId, receiverId) => {
  if (!senderId || !receiverId) {
    console.error("Error: Missing senderId or receiverId");
    return null;
  }

  try {
    const response = await axios.post(`${API_URL}api/chat/initiateChat/${senderId}/${receiverId}`);

    if (response.data.message === "success") {
      console.log("Chat initiated successfully:", response.data.id);
      return response.data.id;
    } else {
      console.error("Failed to initiate chat");
      return null;
    }
  } catch (error) {
    console.error("Error initiating chat:", error);
    return null;
  }
};

export const getGroupParticipants = async (gid) => {
  try {
    const response = await axios.get(`${API_URL}/group/getMembers/${gid}`);
    return response.data; // array of participants
  } catch (error) {
    console.error("Error fetching group participants:", error);
    return [];
  }
};