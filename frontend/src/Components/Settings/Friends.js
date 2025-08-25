// import React, { useEffect, useState } from "react";
// import "./Settings.css";
// import { MessageCircle } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import Sidebar from "../Sidebar/Sidebar";
// import { getFriends } from "../../API/api";

// const Friends = () => {
//   const navigate = useNavigate();
//   const [friends, setFriends] = useState([]);

//   const handleChat = (friend) => {
//     // Store selected friend in localStorage or pass via navigate state
//     localStorage.setItem("selectedFriend", JSON.stringify(friend));
//     navigate("/chats");
//   };


//   const userId = localStorage.getItem("userId");

//   useEffect(() => {
//     const fetchData = async () => {
//       const data = await getFriends(userId);
//       console.log(data);
//       setFriends(data);
//     };
//     fetchData();
//   }, [userId]);


//   return (
//     <div className="friends-container">
//       <Sidebar />
//       <h2>My Friends</h2>
//       {friends.map((friend) => (
//         <div key={friend._id} className="friend-card">
//           <img src={friend.profilePic} alt={friend.name} className="friend-avatar" />
//           <div className="friend-details">
//             <h4>{friend.name}</h4>
//           </div>
//           <button className="chat-button" onClick={() => handleChat(friend)}>
//             <MessageCircle size={20} />
//           </button>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default Friends;
import React, { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getFriends, initiateChat } from "../../API/api";
import { fetchChats } from "../../API/chat";
import Sidebar from "../Sidebar/Sidebar";


const Friends = () => {
  const navigate = useNavigate();
  const [friends, setFriends] = useState([]);
  const [existingChats, setExistingChats] = useState([]); // State to store existing chats
  const userId = localStorage.getItem("userId");

  // Fetch both friends and existing chats when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [friendsData, chatsData] = await Promise.all([
          getFriends(userId),
          fetchChats(userId) // Assuming you have this function from ChatList
        ]);
        setFriends(friendsData);
        setExistingChats(chatsData || []);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };
    fetchData();
  }, [userId]);

  const handleChat = async (friend) => {
    try {
      // First check if chat already exists in local state
      const existingChat = findExistingChat(userId, friend._id, existingChats);

      if (existingChat) {
        console.log("Using existing chat:", existingChat.id);
        navigate(`/chats/${existingChat.id}`);
        return;
      }

      // If no existing chat, create new one
      console.log("Creating new chat...");
      const chatId = await initiateChat(userId, friend._id);
      if (chatId) {
        navigate(`/chats/${chatId}`);
      }
    } catch (error) {
      console.error("Chat error:", error);
      // Show error to user
    }
  };

  // Helper function to find existing chat
  const findExistingChat = (userId, friendId, chats) => {
    return chats.find(chat => {
      if (chat.isGroup) return false; // Skip group chats

      // Check if both users are participants
      return chat.participants?.includes(userId) &&
        chat.participants?.includes(friendId);
    });
  };

  return (
    <div className="friends-container">
      <Sidebar />
      <h2>My Friends</h2>
      <input
        type="text"
        placeholder="Search here..."
        className="search-inputsetting"
        onFocus={() => navigate('/SearchUsersScreen')} // Navigate to search screen when clicked
        readOnly // Makes the input non-editable here
      />
      {friends.map((friend) => (
        <div key={friend._id} className="friend-card">
          <img src={friend.profilePic} alt={friend.name} className="friend-avatar" />
          <div className="friend-details">
            <h4>{friend.name}</h4>
          </div>
          <button className="chat-button" onClick={() => handleChat(friend)}>
            <MessageCircle size={20} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default Friends;