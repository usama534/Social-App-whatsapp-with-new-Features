// import { useState, useEffect } from "react";
// import { fetchUsers, startNewChat } from "../../API/chat";  // ✅ API functions
// import { useNavigate } from "react-router-dom";
// import "./Messages.css";

// function NewChat() {
//   const [users, setUsers] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const getUsers = async () => {
//       const data = await fetchUsers();  // ✅ Fetch all users
//       setUsers(data);
//     };
//     getUsers();
//   }, []);

//   const handleNewChat = async (receiverId) => {
//     const senderId = localStorage.getItem("userId");
//     const chatId = await startNewChat(senderId, receiverId);
//     if (chatId) {
//       navigate(`/chats?chatId=${chatId}`);  // ✅ Navigate to Chat Page
//     }
//   };

//   return (
//     <div className="new-chat-container">
//       <h2>Select User to Start Chat</h2>
//       <div className="user-list">
//         {users.map((user) => (
//           <div key={user.id} className="user-item" onClick={() => handleNewChat(user.id)}>
//             <div className="avatar">{user.name[0]}</div>
//             <div className="user-info">
//               <div className="user-name">{user.name}</div>
//               <div className="user-email">{user.email}</div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default NewChat;
