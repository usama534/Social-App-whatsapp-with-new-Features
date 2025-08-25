// import React, { useState, useEffect, useRef } from "react";
// import { sendMessage, fetchMessages, deleteMessage } from "../../API/chat";
// import { fetchAutoReplies } from "../../API/autoreply";
// import AutoReply from "../Messages/AutoReply";
// // import SchedulerMessage from "../Messages/SchedulerMessage";
// import socket from "../../socket";
// import "./Messages.css";
// import { createVipCollection } from "../../API/api";
// import MessageFilter from "./utils/MessageFilter";

// function ChatArea({ chatUser, chatId }) {
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [showMenu, setShowMenu] = useState(false);
//   const [showAutoReply, setShowAutoReply] = useState(false);
//   const [showProfilePanel, setShowProfilePanel] = useState(false);

//   // const [showScheduler, setShowScheduler] = useState(false);
//   const [, setAutoReplies] = useState([]);
//   // const [currentUserId, setCurrentUserId] = useState("");
//   const [, setOpponentId] = useState("");
//   const [contextMenu, setContextMenu] = useState({
//     visible: false,
//     x: 0,
//     y: 0,
//     messageIndex: null
//   });
//   const contextMenuRef = useRef(null);

//   const currentUserId = localStorage.getItem("userId");
//   useEffect(() => {
//     // setCurrentUserId(currentId);

//     if (chatUser && chatUser._id && chatUser._id !== currentUserId) {
//       setOpponentId(chatUser._id);
//     }
//   }, [chatUser]);

//   useEffect(() => {
//     if (!chatId && !currentUserId) return;

//     const fetchChatData = async () => {
//       try {
//         const messageData = await fetchMessages(chatId, currentUserId);
//         if (Array.isArray(messageData?.messages)) {
//           setMessages(messageData.messages);
//         } else {
//           console.warn("No messages array returned:", messageData);
//           setMessages([]);
//         }


//         const autoReplyData = await fetchAutoReplies(currentUserId, chatId);
//         if (Array.isArray(autoReplyData?.autoReplies)) {
//           setAutoReplies(autoReplyData.autoReplies);
//         } else {
//           setAutoReplies([]);
//         }

//       } catch (error) {
//         console.error(" Error fetching data:", error);
//       }
//     };

//     fetchChatData();
//   }, [chatId, currentUserId]);

//   useEffect(() => {
//     if (!currentUserId || !chatId) return;

//     const handleIncomingMessage = async ({ chatId: incomingChatId }) => {
//       if (incomingChatId !== chatId) return;

//       try {
//         const res = await fetchMessages(chatId, currentUserId);
//         if (res?.messages) {
//           setMessages(res.messages);
//         }
//       } catch (err) {
//         console.error(" Error fetching new message:", err);
//       }
//     };

//     socket.on("message", handleIncomingMessage);

//     return () => {
//       socket.off("message", handleIncomingMessage);
//     };
//   }, [chatId, currentUserId]);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (contextMenuRef.current && !contextMenuRef.current.contains(event.target)) {
//         setContextMenu({ ...contextMenu, visible: false });
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [contextMenu]);

//   const handleAddToVip = async () => {
//     const uid = currentUserId; // Replace with actual logged-in user ID
//     const person = chatUser._id; // Replace with ID of the person to mark as VIP

//     const vipId = await createVipCollection(uid, person);

//     if (vipId) {
//       console.log("VIP Collection Created! ID:", vipId);
//       // Optionally: update local state or UI
//     } else {
//       alert("Failed to add to VIP Collection.");
//     }
//   };

//   const handleSendMessage = async () => {
//     if (!newMessage.trim()) return;

//     if (!currentUserId) {
//       console.error(" User ID not found!");
//       return;
//     }
//     console.log(chatId);
//     try {

//       const response = await sendMessage(chatId, currentUserId, newMessage);
//       if (response) {
//         // setMessages((prevMessages) => [
//         //   ...prevMessages,
//         //   {
//         //     _id: Date.now().toString(),
//         //     senderId: { _id: currentUserId, name: "You" },
//         //     content: newMessage
//         //   },
//         // ]);
//         // setNewMessage("");
//         const res = await fetchMessages(chatId, currentUserId);
//         if (res?.messages) {
//           console.log("Fetched messages:", res.messages);

//           // setMessages(res.messages);
//           setMessages([...res.messages]);

//           setNewMessage("");
//         }


//         // //  Own auto-reply check
//         // const matchedReply = autoReplies.find(
//         //   (reply) =>
//         //     reply?.trigger?.toLowerCase?.() === newMessage.toLowerCase() &&
//         //     reply?.isEnabled !== false
//         // );
//         // if (matchedReply) {
//         //   setTimeout(() => sendAutoReply(matchedReply.reply), 1000);
//         // }

//         // //  Opponent auto-reply check
//         // if (opponentId) {
//         //   const opponentReplyData = await fetchAutoReplies(opponentId, chatId);
//         //   const matchedOpponentReply = opponentReplyData?.autoReplies?.find(
//         //     (reply) =>
//         //       reply?.trigger?.toLowerCase?.() === newMessage.toLowerCase() &&
//         //       reply?.isEnabled !== false
//         //   );

//         //   if (matchedOpponentReply) {
//         //     setTimeout(() => sendAutoReply(matchedOpponentReply.reply, true), 1500);
//         //   }
//         // }
//       }
//     } catch (error) {
//       console.error("Error sending message:", error);
//     }
//   };

//   // const sendAutoReply = async (replyText, isOpponent = false) => {
//   //   const senderId = isOpponent ? opponentId : "BOT";
//   //   const senderName = isOpponent ? "Opponent" : "AutoBot";

//   //   try {
//   //     const response = await sendMessage(chatId, senderId, replyText);
//   //     if (response) {
//   //       setMessages((prevMessages) => [
//   //         ...prevMessages,
//   //         {
//   //           _id: Date.now().toString(),
//   //           senderId: { _id: senderId, name: senderName },
//   //           content: replyText
//   //         },
//   //       ]);
//   //     }
//   //   } catch (error) {
//   //     console.error(" Error sending auto-reply:", error);
//   //   }
//   // };

//   const handleMessageRightClick = (e, message, index) => {
//     e.preventDefault();
//     const isCurrentUser = message.senderId?._id === currentUserId || message.senderId?.name === "You";

//     if (isCurrentUser) {
//       setContextMenu({
//         visible: true,
//         x: e.clientX,
//         y: e.clientY,
//         messageIndex: index
//       });
//     }
//   };

//   const handleCopyMessage = () => {
//     if (contextMenu.messageIndex !== null) {
//       const message = messages[contextMenu.messageIndex];
//       navigator.clipboard.writeText(message.content);
//       setContextMenu({ ...contextMenu, visible: false });
//     }
//   };

//   const handleDeleteMessage = async () => {
//     if (contextMenu.messageIndex !== null) {
//       const messageToDelete = messages[contextMenu.messageIndex]; // Get message info
//       const newMessages = [...messages];
//       newMessages.splice(contextMenu.messageIndex, 1);
//       setMessages(newMessages);
//       setContextMenu({ ...contextMenu, visible: false });

//       try {
//         console.log('chatid ' + chatId);
//         await deleteMessage(messageToDelete._id, chatId); // Call API
//         console.log("Message deleted from server");
//       } catch (error) {
//         console.error("Failed to delete message from server:", error);
//       }
//     }
//   };

//   return (
//     <div className="chat-container">
//       <div className="chat-header">
//         <span onClick={() => setShowProfilePanel(true)} style={{ cursor: "pointer" }}>
//           {chatUser?.name || chatUser}
//         </span>

//         <div className="three-dots" onClick={() => setShowMenu(!showMenu)}>
//           <span>⋮</span>
//         </div>

//         {showMenu && (
//           <div className="dropdown-menu">
//             <button onClick={() => setShowAutoReply(true)}>Auto Reply</button>
//             <button onClick={handleAddToVip}>DownloadDirectory</button>
//           </div>
//         )}



//       </div>


//       <div className="chat-box">
//         {messages.length > 0 ? (
//           messages.map((msg, index) => {
//             const isCurrentUser = msg.senderId?._id === currentUserId || msg.senderId?.name === "You";
//             const senderName = isCurrentUser ? "You" : msg.senderId?.name || "Unknown";

//             return (
//               <div
//                 key={msg._id || index}
//                 className={`chat-message-wrapper ${isCurrentUser ? 'right' : 'left'}`}
//                 onContextMenu={(e) => handleMessageRightClick(e, msg, index)}
//               >
//                 {/* Show sender name for all messages except current user's */}
//                 {!isCurrentUser && (
//                   <div className="message-sender-name">
//                     {senderName}
//                   </div>
//                 )}
//                 <div className="chat-message">
//                   <MessageFilter message={msg.content}>
//                     {(filteredContent) => filteredContent}
//                   </MessageFilter>
//                 </div>
//               </div>
//             );
//           })
//         ) : (
//           <p>No messages yet!</p>
//         )}
//       </div>

//       {contextMenu.visible && (
//         <div
//           ref={contextMenuRef}
//           className="message-context-menu"
//           style={{
//             position: 'fixed',
//             left: `${contextMenu.x}px`,
//             top: `${contextMenu.y}px`,
//             zIndex: 1000
//           }}
//         >
//           <button onClick={handleCopyMessage}>Copy</button>
//           <button onClick={handleDeleteMessage}>Delete</button>
//         </div>
//       )}

//       <div className="chat-input">
//         <input
//           type="text"
//           placeholder="Type a message..."
//           value={newMessage}
//           onChange={(e) => setNewMessage(e.target.value)}
//           onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
//         />
//         <button onClick={handleSendMessage}>Send</button>
//       </div>

//       {showAutoReply && (
//         <div className="auto-reply-overlay">
//           <AutoReply
//             userId={currentUserId}
//             chatId={chatId}
//             onClose={() => setShowAutoReply(false)}
//           />
//         </div>
//       )}
//     </div>
//   );
// }
// export default ChatArea;

import React, { useState, useEffect, useRef } from "react";
import { sendMessage, fetchMessages, deleteMessage } from "../../API/chat";
import { fetchAutoReplies } from "../../API/autoreply";
import AutoReply from "../Messages/AutoReply";
import socket from "../../socket";
import "./Messages.css";
import { createVipCollection } from "../../API/api";
import MessageFilter from "./utils/MessageFilter";
import EmojiPicker from 'emoji-picker-react';
import { Smile } from 'lucide-react';

function ChatArea({ chatUser, chatId }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [showAutoReply, setShowAutoReply] = useState(false);
  const [showProfilePanel, setShowProfilePanel] = useState(false);
  const [, setAutoReplies] = useState([]);
  const [, setOpponentId] = useState("");
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    messageIndex: null
  });
  const [emojiPicker, setEmojiPicker] = useState({
    visible: false,
    messageId: null,
    position: { x: 0, y: 0 }
  });
  const contextMenuRef = useRef(null);
  const emojiPickerRef = useRef(null);

  const currentUserId = localStorage.getItem("userId");

  useEffect(() => {
    if (chatUser && chatUser._id && chatUser._id !== currentUserId) {
      setOpponentId(chatUser._id);
    }
  }, [chatUser, currentUserId]);

  useEffect(() => {
    if (!chatId && !currentUserId) return;

    const fetchChatData = async () => {
      try {
        const messageData = await fetchMessages(chatId, currentUserId);
        if (Array.isArray(messageData?.messages)) {
          // Initialize reactions array for each message if not present
          const messagesWithReactions = messageData.messages.map(msg => ({
            ...msg,
            reactions: msg.reactions || []
          }));
          setMessages(messagesWithReactions);
        } else {
          console.warn("No messages array returned:", messageData);
          setMessages([]);
        }

        const autoReplyData = await fetchAutoReplies(currentUserId, chatId);
        if (Array.isArray(autoReplyData?.autoReplies)) {
          setAutoReplies(autoReplyData.autoReplies);
        } else {
          setAutoReplies([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchChatData();
  }, [chatId, currentUserId]);

  useEffect(() => {
    if (!currentUserId || !chatId) return;

    const handleIncomingMessage = async ({ chatId: incomingChatId }) => {
      if (incomingChatId !== chatId) return;

      try {
        const res = await fetchMessages(chatId, currentUserId);
        if (res?.messages) {
          // Initialize reactions for new messages
          const messagesWithReactions = res.messages.map(msg => ({
            ...msg,
            reactions: msg.reactions || []
          }));
          setMessages(messagesWithReactions);
        }
      } catch (err) {
        console.error("Error fetching new message:", err);
      }
    };

    socket.on("message", handleIncomingMessage);

    return () => {
      socket.off("message", handleIncomingMessage);
    };
  }, [chatId, currentUserId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target)) {
        setContextMenu({ ...contextMenu, visible: false });
      }
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setEmojiPicker({ ...emojiPicker, visible: false });
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [contextMenu, emojiPicker]);

  const handleAddToVip = async () => {
    const uid = currentUserId;
    const person = chatUser._id;

    const vipId = await createVipCollection(uid, person);

    if (vipId) {
      console.log("VIP Collection Created! ID:", vipId);
    } else {
      alert("Failed to add to VIP Collection.");
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    if (!currentUserId) {
      console.error("User ID not found!");
      return;
    }

    try {
      const response = await sendMessage(chatId, currentUserId, newMessage);
      if (response) {
        const res = await fetchMessages(chatId, currentUserId);
        if (res?.messages) {
          const messagesWithReactions = res.messages.map(msg => ({
            ...msg,
            reactions: msg.reactions || []
          }));
          setMessages(messagesWithReactions);
          setNewMessage("");
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleMessageRightClick = (e, message, index) => {
    e.preventDefault();
    const isCurrentUser = message.senderId?._id === currentUserId || message.senderId?.name === "You";

    if (isCurrentUser) {
      setContextMenu({
        visible: true,
        x: e.clientX,
        y: e.clientY,
        messageIndex: index
      });
    }
  };

  const handleMessageClick = (e, message) => {
    if (e.button !== 0) return; // Only handle left click

    setEmojiPicker({
      visible: true,
      messageId: message._id,
      position: { x: e.clientX, y: e.clientY }
    });
  };

  const handleAddReaction = (emojiData, messageId) => {
    setMessages(prevMessages =>
      prevMessages.map(msg => {
        if (msg._id === messageId) {
          const existingReactionIndex = msg.reactions?.findIndex(
            r => r.userId === currentUserId
          ) ?? -1;

          const newReaction = {
            emoji: emojiData.emoji,
            userId: currentUserId,
            _id: `react-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
          };

          let updatedReactions = [...(msg.reactions || [])];

          if (existingReactionIndex >= 0) {
            if (updatedReactions[existingReactionIndex].emoji === emojiData.emoji) {
              updatedReactions.splice(existingReactionIndex, 1);
            } else {
              updatedReactions[existingReactionIndex] = newReaction;
            }
          } else {
            updatedReactions.push(newReaction);
          }

          return {
            ...msg,
            reactions: updatedReactions
          };
        }
        return msg;
      })
    );

    setEmojiPicker({ ...emojiPicker, visible: false });
  };

  const handleCopyMessage = () => {
    if (contextMenu.messageIndex !== null) {
      const message = messages[contextMenu.messageIndex];
      navigator.clipboard.writeText(message.content);
      setContextMenu({ ...contextMenu, visible: false });
    }
  };

  const handleDeleteMessage = async () => {
    if (contextMenu.messageIndex !== null) {
      const messageToDelete = messages[contextMenu.messageIndex];
      const newMessages = [...messages];
      newMessages.splice(contextMenu.messageIndex, 1);
      setMessages(newMessages);
      setContextMenu({ ...contextMenu, visible: false });

      try {
        await deleteMessage(messageToDelete._id, chatId);
        console.log("Message deleted from server");
      } catch (error) {
        console.error("Failed to delete message from server:", error);
      }
    }
  };

  const renderReactions = (reactions, messageId) => {
    if (!reactions || reactions.length === 0) return null;

    const reactionData = reactions.reduce((acc, reaction) => {
      if (!acc[reaction.emoji]) {
        acc[reaction.emoji] = {
          count: 0,
          userReacted: false
        };
      }
      acc[reaction.emoji].count++;
      if (reaction.userId === currentUserId) {
        acc[reaction.emoji].userReacted = true;
      }
      return acc;
    }, {});

    return (
      <div className="message-reactions">
        {Object.entries(reactionData).map(([emoji, data]) => (
          <span
            key={emoji}
            className={`reaction-bubble ${data.userReacted ? 'user-reacted' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              handleAddReaction({ emoji }, messageId);
            }}
          >
            {emoji} {data.count > 1 ? data.count : ''}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <span onClick={() => setShowProfilePanel(true)} style={{ cursor: "pointer" }}>
          {chatUser?.name || chatUser}
        </span>

        <div className="three-dots" onClick={() => setShowMenu(!showMenu)}>
          <span>⋮</span>
        </div>

        {showMenu && (
          <div className="dropdown-menu">
            <button onClick={() => setShowAutoReply(true)}>Auto Reply</button>
            <button onClick={handleAddToVip}>DownloadDirectory</button>
          </div>
        )}
      </div>

      <div className="chat-box">
        {messages.length > 0 ? (
          messages.map((msg, index) => {
            const isCurrentUser = msg.senderId?._id === currentUserId || msg.senderId?.name === "You";
            const senderName = isCurrentUser ? "You" : msg.senderId?.name || "Unknown";

            return (
              <div
                key={msg._id || index}
                className={`chat-message-wrapper ${isCurrentUser ? 'right' : 'left'}`}
                onContextMenu={(e) => handleMessageRightClick(e, msg, index)}
                onClick={(e) => handleMessageClick(e, msg)}
              >
                {!isCurrentUser && (
                  <div className="message-sender-name">
                    {senderName}
                  </div>
                )}
                <div className="chat-message">
                  <MessageFilter message={msg.content}>
                    {(filteredContent) => filteredContent}
                  </MessageFilter>
                  {renderReactions(msg.reactions, msg._id)}
                </div>
              </div>
            );
          })
        ) : (
          <p>No messages yet!</p>
        )}
      </div>

      {contextMenu.visible && (
        <div
          ref={contextMenuRef}
          className="message-context-menu"
          style={{
            position: 'fixed',
            left: `${contextMenu.x}px`,
            top: `${contextMenu.y}px`,
            zIndex: 1000
          }}
        >
          <button onClick={handleCopyMessage}>Copy</button>
          <button onClick={handleDeleteMessage}>Delete</button>
          <button onClick={() => {
            setContextMenu({ ...contextMenu, visible: false });
            setEmojiPicker({
              visible: true,
              messageId: messages[contextMenu.messageIndex]._id,
              position: { x: contextMenu.x, y: contextMenu.y }
            });
          }}>
            <Smile size={16} /> Add Reaction
          </button>
        </div>
      )}

      {emojiPicker.visible && (
        <div
          ref={emojiPickerRef}
          className="emoji-picker-container"
          style={{
            position: 'fixed',
            left: `${emojiPicker.position.x}px`,
            top: `${emojiPicker.position.y}px`,
            zIndex: 1001
          }}
        >
          <EmojiPicker
            onEmojiClick={(emojiData) => handleAddReaction(emojiData, emojiPicker.messageId)}
            width={300}
            height={350}
          />
        </div>
      )}

      <div className="chat-input">
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>

      {showAutoReply && (
        <div className="auto-reply-overlay">
          <AutoReply
            userId={currentUserId}
            chatId={chatId}
            onClose={() => setShowAutoReply(false)}
          />
        </div>
      )}

      <style jsx>{`
        // .chat-container {
        //   display: flex;
        //   flex-direction: column;
        //   height: 100%;
        //   background-color: #f0f2f5;
        // }
        
        // .chat-header {
        //   display: flex;
        //   justify-content: space-between;
        //   align-items: center;
        //   padding: 10px 16px;
        //   background-color: #00a884;
        //   color: white;
        //   position: relative;
        // }
        
        // .three-dots {
        //   cursor: pointer;
        //   padding: 8px;
        //   border-radius: 50%;
        // }
        
        // .three-dots:hover {
        //   background-color: rgba(255, 255, 255, 0.1);
        // }
        
        // .dropdown-menu {
        //   position: absolute;
        //   right: 10px;
        //   top: 50px;
        //   background-color: white;
        //   border-radius: 8px;
        //   box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        //   z-index: 100;
        //   display: flex;
        //   flex-direction: column;
        //   padding: 8px 0;
        // }
        
        // .dropdown-menu button {
        //   padding: 8px 16px;
        //   border: none;
        //   background: none;
        //   text-align: left;
        //   cursor: pointer;
        // }
        
        // .dropdown-menu button:hover {
        //   background-color: #f5f5f5;
        // }
        
        // .chat-box {
        //   flex: 1;
        //   overflow-y: auto;
        //   padding: 16px;
        //   display: flex;
        //   flex-direction: column;
        //   gap: 8px;
        // }
        
        // .chat-message-wrapper {
        //   display: flex;
        //   flex-direction: column;
        //   max-width: 80%;
        // }
        
        // .chat-message-wrapper.right {
        //   align-self: flex-end;
        //   align-items: flex-end;
        // }
        
        // .chat-message-wrapper.left {
        //   align-self: flex-start;
        //   align-items: flex-start;
        // }
        
        // .message-sender-name {
        //   font-size: 12px;
        //   color: #666;
        //   margin-bottom: 4px;
        // }
        
        // .chat-message {
        //   padding: 8px 12px;
        //   border-radius: 8px;
        //   background-color: white;
        //   box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
        //   position: relative;
        // }
        
        // .chat-message-wrapper.right .chat-message {
        //   background-color: #d9fdd3;
        // }
        
        .message-reactions {
          display: flex;
          gap: 4px;
          margin-top: 4px;
          flex-wrap: wrap;
        }
        
        .reaction-bubble {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 12px;
          padding: 2px 6px;
          font-size: 12px;
          display: inline-flex;
          align-items: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .reaction-bubble.user-reacted {
          background: rgba(0, 120, 215, 0.2);
          border: 1px solid rgba(0, 120, 215, 0.4);
        }
        
        .reaction-bubble:hover {
          background: rgba(0, 0, 0, 0.15);
          transform: scale(1.1);
        }
        
        // .message-context-menu {
        //   background-color: white;
        //   border-radius: 8px;
        //   box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        //   display: flex;
        //   flex-direction: column;
        //   padding: 8px 0;
        // }
        
        // .message-context-menu button {
        //   padding: 8px 16px;
        //   border: none;
        //   background: none;
        //   text-align: left;
        //   cursor: pointer;
        //   display: flex;
        //   align-items: center;
        //   gap: 8px;
        // }
        
        // .message-context-menu button:hover {
        //   background-color: #f5f5f5;
        // }
        
        .emoji-picker-container {
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
          border-radius: 8px;
          overflow: hidden;
        }
        
        // .chat-input {
        //   display: flex;
        //   padding: 8px 16px;
        //   background-color: white;
        //   border-top: 1px solid #e9edef;
        // }
        
        // .chat-input input {
        //   flex: 1;
        //   padding: 10px 12px;
        //   border: none;
        //   border-radius: 8px;
        //   background-color: #f0f2f5;
        //   outline: none;
        // }
        
        // .chat-input button {
        //   margin-left: 8px;
        //   padding: 10px 16px;
        //   background-color: #00a884;
        //   color: white;
        //   border: none;
        //   border-radius: 8px;
        //   cursor: pointer;
        // }
        
        // .chat-input button:hover {
        //   background-color: #008069;
        // }
        
        // .auto-reply-overlay {
        //   position: fixed;
        //   top: 0;
        //   left: 0;
        //   right: 0;
        //   bottom: 0;
        //   background-color: rgba(0, 0, 0, 0.5);
        //   display: flex;
        //   justify-content: center;
        //   align-items: center;
        //   z-index: 1000;
        // }
      `}</style>
    </div>
  );
}

export default ChatArea;