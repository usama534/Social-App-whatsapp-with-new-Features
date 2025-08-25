import { useEffect, useState } from "react";
import ChatList from "./ChatList";
import ChatArea from "./ChatArea";
import "./Messages.css";
import Sidebar from "../Sidebar/Sidebar";
import { initiateChat } from "../../API/chat";


function Messages() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [chats] = useState([]); // All chats

  const currentUser = localStorage.getItem("userId");
  useEffect(() => {
    const checkChat = async () => {
      const friend = JSON.parse(localStorage.getItem("selectedFriend"));
      if (friend) {
        const existing = chats.find((chat) => chat.chatInfo._id === friend._id);
        if (existing) {
          setSelectedChat({ id: existing._id, chatInfo: friend });
        } else {
          console.warn(friend._id);

          const chatId = await initiateChat(currentUser, friend._id);
          // setChats((prev) => [...prev, newChat]);
          setSelectedChat({ id: chatId, chatInfo: friend });
        }

        // Optionally clear storage
        localStorage.removeItem("selectedFriend");
      }
    };
    checkChat();
  }, []);

  return (
    <div className="main-container">
      <Sidebar />
      <ChatList onSelectChat={setSelectedChat} />
      {selectedChat && <ChatArea chatId={selectedChat.id} chatUser={selectedChat.chatInfo} />}
    </div>
  );
}

export default Messages;
