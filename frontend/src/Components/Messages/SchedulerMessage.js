// import React, { useEffect, useState, useRef } from "react";
// import { saveScheduledMessage, deleteScheduledMessage } from "../../API/scheduler";
// import { getFriends } from "../../API/api";
// import "./Messages.css";

// const dummyGroups = [
//   { id: "g1", name: "FYP Team" },
//   { id: "g2", name: "Friends Group" },
//   { id: "g3", name: "VIP Squad" },
// ];

// function SchedulerMessage({ onClose, userId }) {
//   const [message, setMessage] = useState(""); // Message content
//   const [date, setDate] = useState(""); // Scheduled date
//   const [time, setTime] = useState(""); // Scheduled time
//   const [sendTo, setSendTo] = useState([]); // Array to store selected users
//   const [selectedGroup, setSelectedGroup] = useState([]); // Array to store selected groups
//   const [scheduledMessages, setScheduledMessages] = useState([]); // Scheduled messages
//   const [friends, setFriends] = useState([]); // Friends list
//   const [loading, setLoading] = useState(false); // Loading state for friends fetching
//   const [dropdownOpen, setDropdownOpen] = useState({ users: false, groups: false }); // State to manage dropdown visibility
//   const dropdownRef = useRef(null); // Reference to the dropdown container

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setDropdownOpen({ users: false, groups: false });
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   // Fetch friends list when component mounts
//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         const data = await getFriends(userId);
//         setFriends(data);
//       } catch (error) {
//         console.error("❌ Error fetching friends:", error);
//       }
//       setLoading(false);
//     };
//     fetchData();
//   }, [userId]);

//   // Toggle dropdown visibility
//   const toggleDropdown = (type) => {
//     setDropdownOpen((prevState) => ({
//       ...prevState,
//       [type]: !prevState[type],
//     }));
//   };

//   // Handle changes in the multi-select checkboxes (users)
//   const handleCheckboxChangeUser = (userId) => {
//     setSendTo((prevSelected) => {
//       if (prevSelected.includes(userId)) {
//         return prevSelected.filter((id) => id !== userId); // Remove user from selection
//       } else {
//         return [...prevSelected, userId]; // Add user to selection
//       }
//     });
//   };

//   // Handle changes in the multi-select checkboxes (groups)
//   const handleCheckboxChangeGroup = (groupId) => {
//     setSelectedGroup((prevSelected) => {
//       if (prevSelected.includes(groupId)) {
//         return prevSelected.filter((id) => id !== groupId); // Remove group from selection
//       } else {
//         return [...prevSelected, groupId]; // Add group to selection
//       }
//     });
//   };

//   // Handle scheduling a message
//   const handleAddSchedule = async () => {
//     if (!message.trim() || !date || !time || (sendTo.length === 0 && selectedGroup.length === 0)) return;

//     const dateTime = new Date(`${date}T${time}`);
//     const targetId = sendTo.length > 0 ? sendTo : selectedGroup;
//     const targetType = sendTo.length > 0 ? "user" : "group";

//     try {
//       const response = await saveScheduledMessage(userId, targetId, message, dateTime, targetType);
//       if (response?.id) {
//         const newMsg = {
//           _id: response.id,
//           message,
//           scheduleTime: dateTime,
//           target: targetType === "user" ? sendTo.join(", ") : selectedGroup.join(", "),
//           targetType,
//         };
//         setScheduledMessages((prev) => [...prev, newMsg]);
//         setMessage("");
//         setDate("");
//         setTime("");
//         setSendTo([]);
//         setSelectedGroup([]);
//       }
//     } catch (error) {
//       console.error("❌ Error saving scheduled message:", error);
//       alert("Failed to schedule message, please try again.");
//     }
//   };

//   // Handle deleting a scheduled message
//   const handleDelete = async (id) => {
//     const confirmDelete = window.confirm("Are you sure you want to delete this scheduled message?");
//     if (!confirmDelete) return;

//     try {
//       await deleteScheduledMessage(id);
//       setScheduledMessages((prev) => prev.filter((msg) => msg._id !== id));
//     } catch (error) {
//       console.error("❌ Error deleting scheduled message:", error);
//     }
//   };

//   // Disable the "Schedule" button if necessary fields are not filled out
//   const isScheduleDisabled = !message.trim() || !date || !time || (sendTo.length === 0 && selectedGroup.length === 0);

//   return (
//     <div className="auto-reply-container">
//       <div className="auto-reply-header">
//         <h2>Scheduler Message</h2>
//         <button className="close-btn" onClick={onClose}>X</button>
//       </div>

//       <div className="auto-reply-form">
//         <textarea
//           className="inputarea"
//           placeholder="Enter message to schedule..."
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//         />
//         <div style={{ display: "flex", justifyContent: 'space-evenly' }}>
//           {/* Multi-select dropdown with checkboxes for users */}
//           <div className="dropdown-container">
//             <button onClick={() => toggleDropdown("users")}>
//               {sendTo.length > 0
//                 ? `Selected (${sendTo.length} user${sendTo.length > 1 ? "s" : ""})`
//                 : "Select (User)"}
//             </button>

//             {dropdownOpen.users && (
//               <div ref={dropdownRef} className="dropdown-menu">
//                 {friends.map((user) => (
//                   <label key={user._id} className="dropdown-item">
//                     <input
//                       type="checkbox"
//                       style={{ width: '35%' }}
//                       value={user._id}
//                       checked={sendTo.includes(user._id)}
//                       onChange={() => handleCheckboxChangeUser(user._id)}
//                     />
//                     {user.name}
//                   </label>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Multi-select dropdown with checkboxes for groups */}
//           <div className="dropdown-container">
//             <button onClick={() => toggleDropdown("groups")}>
//               {selectedGroup.length > 0
//                 ? `Select Group (${selectedGroup.length} group${selectedGroup.length > 1 ? "s" : ""})`
//                 : "Select Group"}
//             </button>

//             {dropdownOpen.groups && (
//               <div ref={dropdownRef} className="dropdown-menu">
//                 {dummyGroups.map((group) => (
//                   <label key={group.id} className="dropdown-item" style={{ display: "flex" }}>
//                     <input
//                       type="checkbox"
//                       style={{ width: '35%' }}
//                       value={group.id}
//                       checked={selectedGroup.includes(group.id)}
//                       onChange={() => handleCheckboxChangeGroup(group.id)}
//                     />
//                     {group.name}
//                   </label>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//         {/* Date and time selection */}
//         <input
//           type="date"
//           value={date}
//           onChange={(e) => setDate(e.target.value)}
//           min={new Date().toISOString().split("T")[0]} // Disable past dates
//         />
//         <input
//           type="time"
//           value={time}
//           onChange={(e) => setTime(e.target.value)}
//         />

//         {/* Schedule button */}
//         <button onClick={handleAddSchedule} disabled={isScheduleDisabled}>
//           {isScheduleDisabled ? "Fill all fields" : "Schedule"}
//         </button>
//       </div>

//       {/* Display scheduled messages */}
//       <div className="auto-reply-list">
//         <h3>Scheduled Messages</h3>
//         {loading ? (
//           <p>Loading...</p>
//         ) : scheduledMessages.length > 0 ? (
//           scheduledMessages.map((msg) => (
//             <div key={msg._id} className="auto-reply-item">
//               <p>
//                 <strong>{new Date(msg.scheduleTime).toLocaleString()}:</strong> {msg.message}
//                 <br />
//                 <small>To: {msg.targetType === "user" ? `User (${msg.target})` : `Group (${msg.target})`}</small>
//               </p>
//               <button className="delete-btn" onClick={() => handleDelete(msg._id)}>🗑</button>
//             </div>
//           ))
//         ) : (
//           <p>No messages scheduled</p>
//         )}
//       </div>
//     </div>
//   );
// }

// export default SchedulerMessage;

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import API_URL from '../../Config';

// const ScheduleScreen = ({ navigation }) => {
//   const [chats, setChats] = useState([]);
//   const [selectedChats, setSelectedChats] = useState([]);
//   const [messageContent, setMessageContent] = useState('');
//   const [attachments, setAttachments] = useState([]);
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [selectedTime, setSelectedTime] = useState(new Date());
//   const [selectedDocuments, setSelectedDocuments] = useState([]);
//   const [scheduledMessages, setScheduledMessages] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const uid = localStorage.getItem('userId');

//   useEffect(() => {
//     const fetchChats = async () => {
//       try {
//         const response = await axios.get(`${API_URL}api/chat/getAllChats/${uid}`);
//         setChats(response.data);
//       } catch (error) {
//         console.error('Error fetching chats:', error);
//       }
//     };
//     fetchChats();
//     fetchScheduledMessages();
//   }, []);

//   const handleChatSelection = (chatId) => {
//     setSelectedChats((prev) =>
//       prev.includes(chatId) ? prev.filter(id => id !== chatId) : [...prev, chatId]
//     );
//   };

//   const fetchScheduledMessages = async () => {
//     setIsLoading(true);
//     try {
//       const response = await axios.get(`${API_URL}api/chat/getScheduledMessages/${uid}`);
//       setScheduledMessages(response.data);
//     } catch (error) {
//       console.error('Error fetching scheduled messages:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };
//   const handleDeleteScheduledMessage = async (messageId) => {
//     if (window.confirm('Are you sure you want to delete this scheduled message?')) {
//       try {
//         await axios.delete(`${API_URL}api/chat/deleteScheduledMessage/${messageId}`);
//         fetchScheduledMessages(); // Refresh the list
//         alert('Scheduled message deleted successfully!');
//       } catch (error) {
//         console.error('Error deleting scheduled message:', error);
//         alert('Failed to delete scheduled message.');
//       }
//     }
//   };

//   const formatDateTimeForDisplay = (dateString) => {
//     const date = new Date(dateString);
//     return `${date.toLocaleDateString()} at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
//   };

//   const handleAttachFile = async (e) => {
//     const files = Array.from(e.target.files);
//     if (files.length > 0) {
//       setAttachments([...attachments, ...files]);
//       setSelectedDocuments([...selectedDocuments, ...files.map(f => f.name)]);
//     }
//   };

//   const handleRemoveDocument = (index) => {
//     setAttachments(prev => prev.filter((_, i) => i !== index));
//     setSelectedDocuments(prev => prev.filter((_, i) => i !== index));
//   };

//   const handleDateChange = (e) => {
//     setSelectedDate(new Date(e.target.value));
//   };

//   const handleTimeChange = (e) => {
//     const [hours, minutes] = e.target.value.split(':').map(Number);
//     const updatedTime = new Date(selectedTime);
//     updatedTime.setHours(hours);
//     updatedTime.setMinutes(minutes);
//     setSelectedTime(updatedTime);
//   };

//   // const handleSubmit = async () => {
//   //   if (!messageContent.trim()) return alert('Please enter a message.');
//   //   if (selectedChats.length === 0) return alert('Select at least one chat.');

//   //   try {
//   //     const formData = new FormData();
//   //     attachments.forEach((file) => {
//   //       formData.append('messageAttchments', file);
//   //     });

//   //     // ✅ Correct way to add chat IDs
//   //     selectedChats.forEach(chatId => {
//   //       console.log("---------------->", chatId)
//   //       formData.append('chat', chatId);
//   //     });

//   //     const pushTime = new Date(
//   //       selectedDate.getFullYear(),
//   //       selectedDate.getMonth(),
//   //       selectedDate.getDate(),
//   //       selectedTime.getHours(),
//   //       selectedTime.getMinutes()
//   //     ).toISOString();

//   //     formData.append('messageContent', messageContent);
//   //     formData.append('senderId', uid);
//   //     formData.append('pushTime', pushTime);

//   //     await axios.post(`${API_URL}api/chat/scheduleMessage`, formData, {
//   //       headers: { 'Content-Type': 'multipart/form-data' }
//   //     });

//   //     alert('Message scheduled successfully!');
//   //     if (navigation?.goBack) navigation.goBack();
//   //   } catch (err) {
//   //     console.error('Error scheduling message:', err);
//   //     alert('Failed to schedule message.');
//   //   }
//   // };
//   // const handleSubmit = async () => {
//   //   if (!messageContent.trim()) {
//   //     alert('Please enter a message.');
//   //     return;
//   //   }

//   //   if (selectedChats.length === 0) {
//   //     alert('Please select at least one chat.');
//   //     return;
//   //   }

//   //   try {
//   //     const formData = new FormData();

//   //     // ✅ Append files (no need for "uri" in web)
//   //     attachments.forEach((file) => {
//   //       formData.append('messageAttchments', file);
//   //     });

//   //     // ✅ Append chat IDs by type
//   //     // selectedChats.forEach(chatId => {

//   //     //   const chat = chats.find(c => c.id === chatId);
//   //     //   if (chat?.isGroup) {
//   //     //     formData.append('groupChats', chatId);
//   //     //   } else {
//   //     //     formData.append('personalChats', chatId);
//   //     //   }
//   //     // });
//   //     selectedChats.forEach(chatId => {
//   //       formData.append('chat', chatId); // ✅ Send as `chat` array entries
//   //     });
//   //     // ✅ Combine date & time
//   //     const pushTime = new Date(
//   //       selectedDate.getFullYear(),
//   //       selectedDate.getMonth(),
//   //       selectedDate.getDate(),
//   //       selectedTime.getHours(),
//   //       selectedTime.getMinutes()
//   //     ).toISOString();

//   //     // ✅ Append other fields
//   //     formData.append('messageContent', messageContent);
//   //     formData.append('senderId', uid);
//   //     formData.append('pushTime', pushTime);

//   //     // Debug log
//   //     console.log('Submitting scheduled message:', {
//   //       chats: selectedChats,
//   //       pushTime,
//   //       messageContent,
//   //       attachments,
//   //     });

//   //     // ✅ Submit to backend
//   //     await axios.post(`${API_URL}api/chat/scheduleMessage`, formData, {
//   //       headers: {
//   //         'Content-Type': 'multipart/form-data',
//   //       },
//   //     });

//   //     alert('Message scheduled successfully!');
//   //     if (typeof navigation?.goBack === 'function') navigation.goBack();
//   //   } catch (error) {
//   //     console.error('Error scheduling message:', error);
//   //     alert('Failed to schedule message.');
//   //   }
//   // };
//   const handleSubmit = async () => {
//     if (!messageContent.trim()) {
//       alert('Please enter a message.');
//       return;
//     }

//     if (selectedChats.length === 0) {
//       alert('Please select at least one chat.');
//       return;
//     }

//     try {
//       const formData = new FormData();

//       // Append files
//       attachments.forEach((file) => {
//         formData.append('messageAttchments', file);
//       });

//       // Append EACH chat ID separately
//       selectedChats.forEach(chatId => {
//         formData.append('chats', chatId); // Send individual chat IDs
//       });

//       // Combine date & time
//       const pushTime = new Date(
//         selectedDate.getFullYear(),
//         selectedDate.getMonth(),
//         selectedDate.getDate(),
//         selectedTime.getHours(),
//         selectedTime.getMinutes()
//       ).toISOString();

//       // Append other fields
//       formData.append('messageContent', messageContent);
//       formData.append('senderId', uid);
//       formData.append('pushTime', pushTime);

//       const response = await axios.post(`${API_URL}api/chat/scheduleMessage`, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       console.log('Scheduled message response:', response.data);
//       alert('Message scheduled successfully!');
//       if (typeof navigation?.goBack === 'function') navigation.goBack();
//     } catch (error) {
//       console.error('Error scheduling message:', error);
//       alert('Failed to schedule message. Please check console for details.');
//     }
//   };

//   const formatDateForInput = (date) =>
//     `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
//   const formatTimeForInput = (date) =>
//     `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;

//   return (
//     <div style={styles.scrollContainer}>
//       <div style={styles.container}>
//         <div style={styles.label}>Select Chats:</div>
//         <div style={styles.chatListContainer}>
//           {chats.map(item => {
//             const isSelected = selectedChats.includes(item.id);
//             const chatItemStyle = isSelected
//               ? { ...styles.chatItem, ...styles.selectedChatItem }
//               : styles.chatItem;
//             const chatNameStyle = isSelected
//               ? { ...styles.chatName, ...styles.SelectedchatName }
//               : styles.chatName;

//             return (
//               <div
//                 key={item.id}
//                 style={chatItemStyle}
//                 onClick={() => handleChatSelection(item.id)}
//               >
//                 <div style={chatNameStyle}>{item.chatInfo.name}</div>
//               </div>
//             );
//           })}
//         </div>

//         <div style={styles.label}>Message:</div>
//         <textarea
//           style={styles.input}
//           placeholder="Type your message..."
//           value={messageContent}
//           onChange={(e) => setMessageContent(e.target.value)}
//         />

//         <label style={styles.attachButton}>
//           Attach File
//           <input
//             type="file"
//             style={{ display: 'none' }}
//             onChange={handleAttachFile}
//             multiple
//           />
//         </label>

//         {selectedDocuments.length > 0 && (
//           <div style={styles.selectedDocumentsContainer}>
//             <div style={styles.label}>Selected Documents:</div>
//             <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
//               {selectedDocuments.map((item, index) => (
//                 <div key={index} style={styles.documentItem}>
//                   <div style={styles.documentName}>{item}</div>
//                   <button
//                     style={styles.removeButton}
//                     onClick={() => handleRemoveDocument(index)}
//                   >
//                     ×
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         <div style={styles.label}>Schedule Time:</div>
//         <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
//           <div>
//             <label style={{ display: 'block', marginBottom: '5px' }}>Date</label>
//             <input
//               type="date"
//               value={formatDateForInput(selectedDate)}
//               onChange={handleDateChange}
//               style={styles.datePickerButton}
//             />
//           </div>
//           <div>
//             <label style={{ display: 'block', marginBottom: '5px' }}>Time</label>
//             <input
//               type="time"
//               value={formatTimeForInput(selectedTime)}
//               onChange={handleTimeChange}
//               style={styles.datePickerButton}
//             />
//           </div>
//         </div>

//         <button style={styles.submitButton} onClick={handleSubmit}>
//           Schedule Message
//         </button>
//         <div style={styles.formSection}>
//           <h2 style={{ ...styles.sectionTitle, marginTop: '40px' }}>Scheduled Messages</h2>
//           {isLoading ? (
//             <div style={styles.loading}>Loading scheduled messages...</div>
//           ) : scheduledMessages.length === 0 ? (
//             <p style={styles.noMessages}>No scheduled messages</p>
//           ) : (
//             <div style={styles.scheduledMessagesContainer}>
//               {scheduledMessages.map((message) => (
//                 <div key={message._id} style={styles.scheduledMessageItem}>
//                   <div style={styles.messageContent}>
//                     <strong>Message:</strong> {message.message?.content || 'No content'}
//                   </div>
//                   <div style={styles.messageInfo}>
//                     <span><strong>Scheduled for:</strong> {formatDateTimeForDisplay(message.pushTime)}</span>
//                     <span><strong>To:</strong> {message.chats?.length || 0} chat(s)</span>
//                   </div>
//                   <button
//                     style={styles.deleteButton}
//                     onClick={() => handleDeleteScheduledMessage(message._id)}
//                   >
//                     Delete
//                   </button>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// const styles = {
//   scrollContainer: {
//     padding: '20px',
//     backgroundColor: '#F5F5F5',
//     // minHeight: '100vh',  // Changed to viewport height
//     overflowX: 'hidden',  // Prevent horizontal scroll
//     height: '700px'
//   },
//   container: {
//     width: '90%',        // Changed from fixed 500px to percentage
//     maxWidth: '800px',   // Added maximum width
//     margin: '0 auto',
//     minHeight: '100vh',  // Changed from fixed height
//     paddingBottom: '40px',
//   },
//   label: {
//     fontSize: '16px',
//     fontWeight: 'bold',
//     marginBottom: '10px',
//     color: '#000',
//   },
//   chatListContainer: {
//     maxHeight: '200px',
//     overflowY: 'auto',
//     marginBottom: '20px',
//     border: '1px solid #ddd',
//     borderRadius: '5px',
//     width: '100%',      // Added full width
//   },
//   chatItem: {
//     padding: '15px',
//     backgroundColor: '#fff',
//     borderRadius: '5px',
//     marginBottom: '10px',
//     cursor: 'pointer',
//   },
//   selectedChatItem: {
//     backgroundColor: 'green',
//   },
//   chatName: {
//     fontSize: '16px',
//     color: 'black',
//   },
//   SelectedchatName: {
//     fontSize: '16px',
//     color: 'white',
//   },
//   input: {
//     backgroundColor: '#fff',
//     borderRadius: '5px',
//     padding: '15px',
//     marginBottom: '20px',
//     fontSize: '16px',
//     color: 'black',
//     width: '95%',
//     minHeight: '100px',
//     border: '1px solid #ddd',
//     resize: 'vertical',
//   },
//   attachButton: {
//     backgroundColor: '#0CAF50',
//     padding: '15px',
//     borderRadius: '5px',
//     textAlign: 'center',
//     marginBottom: '20px',
//     color: '#fff',
//     fontSize: '16px',
//     fontWeight: 'bold',
//     cursor: 'pointer',
//     display: 'block',
//   },
//   datePickerButton: {
//     backgroundColor: '#fff',
//     padding: '10px',
//     borderRadius: '5px',
//     border: '1px solid #ddd',
//     width: '100%',
//   },
//   submitButton: {
//     backgroundColor: '#0CAF50',
//     padding: '15px',
//     borderRadius: '5px',
//     textAlign: 'center',
//     color: '#fff',
//     fontSize: '16px',
//     fontWeight: 'bold',
//     cursor: 'pointer',
//     border: 'none',
//     width: '100%',
//   },
//   selectedDocumentsContainer: {
//     marginBottom: '20px',
//   },
//   documentItem: {
//     display: 'flex',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: '10px',
//     backgroundColor: '#fff',
//     borderRadius: '5px',
//     marginBottom: '10px',
//     border: '1px solid #ddd',
//   },
//   documentName: {
//     fontSize: '14px',
//     color: 'black',
//   },
//   removeButton: {
//     padding: '5px',
//     background: 'none',
//     border: 'none',
//     cursor: 'pointer',
//     fontSize: '16px',
//     color: 'red',
//   },
//   sectionTitle: {
//     fontSize: '22px',
//     fontWeight: 'bold',
//     margin: '30px 0 15px 0',
//     color: '#2c3e50',
//     borderBottom: '2px solid #0CAF50',
//     paddingBottom: '8px',
//   },

//   scheduledMessagesContainer: {
//     marginTop: '30px',
//     borderTop: '2px solid #eee',
//     paddingTop: '20px',
//     maxHeight: 'calc(100vh - 600px)', // Dynamic height based on viewport
//     minHeight: '200px', // Minimum height
//     overflowY: 'auto',
//     backgroundColor: '#fff',
//     borderRadius: '8px',
//     boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
//     padding: '15px',
//     width: '100%',     // Added full width
//   },

//   scheduledMessageItem: {
//     backgroundColor: '#f9f9f9',
//     borderRadius: '8px',
//     padding: '20px',
//     marginBottom: '15px',
//     border: '1px solid #e0e0e0',
//     position: 'relative',
//     transition: 'all 0.3s ease',
//     ':hover': {
//       boxShadow: '0 3px 8px rgba(0,0,0,0.1)',
//       transform: 'translateY(-2px)',
//     },
//   },

//   messageContent: {
//     marginBottom: '12px',
//     wordBreak: 'break-word',
//     fontSize: '15px',
//     lineHeight: '1.5',
//     paddingRight: '60px', // Space for delete button
//   },

//   messageInfo: {
//     display: 'flex',
//     justifyContent: 'space-between',
//     color: '#555',
//     fontSize: '13px',
//     flexWrap: 'wrap',
//     gap: '10px',
//   },

//   deleteButton: {
//     position: 'absolute',
//     top: '15px',
//     right: '15px',
//     backgroundColor: '#ff4444',
//     color: 'white',
//     border: 'none',
//     borderRadius: '4px',
//     padding: '6px 12px',
//     cursor: 'pointer',
//     fontSize: '13px',
//     fontWeight: 'bold',
//     transition: 'all 0.2s ease',
//     ':hover': {
//       backgroundColor: '#cc0000',
//     },
//   },

//   noMessages: {
//     textAlign: 'center',
//     color: '#777',
//     margin: '30px 0',
//     fontSize: '16px',
//     padding: '20px',
//     backgroundColor: '#f5f5f5',
//     borderRadius: '8px',
//   },

//   formSection: {
//     backgroundColor: '#fff',
//     padding: '20px',
//     borderRadius: '8px',
//     boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
//     marginBottom: '20px',
//   },
//   loading: {
//     textAlign: 'center',
//     padding: '20px',
//     color: '#555',
//     fontSize: '16px',
//     backgroundColor: '#f5f5f5',
//     borderRadius: '8px',
//     margin: '20px 0'
//   }
// };

// export default ScheduleScreen;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../../Config';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';
import Sidebar from '../Sidebar/Sidebar';

const ScheduleScreen = () => {
  const [chats, setChats] = useState([]);
  const [selectedChats, setSelectedChats] = useState([]);
  const [messageContent, setMessageContent] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [confirmed, setConfirmed] = useState(false);
  const uid = localStorage.getItem('userId');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axios.get(`${API_URL}api/chat/getAllChats/${uid}`);
        console.log('++++++++++++++++++++>>', response.data);
        setChats(response.data);
      } catch (error) {
        console.error('Error fetching chats:', error);
      }
    };

    fetchChats();
  }, []);

  const handleChatSelection = chatId => {
    if (selectedChats.includes(chatId)) {
      setSelectedChats(selectedChats.filter(id => id !== chatId));
    } else {
      setSelectedChats([...selectedChats, chatId]);
    }
  };

  const handleAttachFile = async (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      const newAttachments = Array.from(files).map(file => ({
        file,
        name: file.name,
        type: file.type
      }));

      setAttachments([...attachments, ...newAttachments]);
      setSelectedDocuments([...selectedDocuments, ...Array.from(files).map(f => f.name)]);
    }
  };

  const handleRemoveDocument = index => {
    const updatedAttachments = attachments.filter((_, i) => i !== index);
    const updatedDocuments = selectedDocuments.filter((_, i) => i !== index);

    setAttachments(updatedAttachments);
    setSelectedDocuments(updatedDocuments);
  };

  const handleSubmit = async () => {
    if (!messageContent.trim()) {
      alert('Error: Please enter a message.');
      return;
    }

    if (selectedChats.length === 0) {
      alert('Error: Please select at least one chat.');
      return;
    }

    try {
      const formData = new FormData();

      const pushTime = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
        selectedTime.getHours(),
        selectedTime.getMinutes()
      );
      const isoString = pushTime.toISOString();
      // Append files
      attachments.forEach((fileObj) => {
        // formData.append('messageAttchments', fileObj.file);
        formData.append('messageAttachments', fileObj.file, fileObj.name);
      });

      // formData.append('chats', JSON.stringify(selectedChats));
      selectedChats.forEach(chatId => {
        formData.append('chats', chatId); // No JSON.stringify
      });
      // Combine date and time
      // const pushTime = new Date(
      //   selectedDate.getFullYear(),
      //   selectedDate.getMonth(),
      //   selectedDate.getDate(),
      //   selectedTime.getHours(),
      //   selectedTime.getMinutes(),
      // ).toISOString();

      // Append other fields
      formData.append('messageContent', messageContent);
      formData.append('senderId', uid);
      formData.append('pushTime', isoString);
      formData.append('confirmed', confirmed.toString());

      console.log('FormData being sent:', formData);

      const response = await axios.post(
        `${API_URL}api/chat/scheduleMessage`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      alert('Success: Message scheduled successfully!');
      navigate(-1);
    } catch (error) {
      console.error('Error scheduling message:', error);
      alert('Error: Failed to schedule message.');
    }
  };

  return (
    <div className="schedule-screen">
      <Sidebar />
      <div className="container">
        <h2 className="label">Select Chats:</h2>
        <div className="chat-list-container">
          {chats.map(item => (
            <div
              key={item.id}
              className={`chat-item ${selectedChats.includes(item.id) ? 'selected-chat-item' : ''}`}
              onClick={() => handleChatSelection(item.id)}
            >
              <span className={`chat-name ${selectedChats.includes(item.id) ? 'selected-chat-name' : ''}`}>
                {item.chatInfo.name}
              </span>
              <div>
                <Icon
                  icon={item.isGroup ? "mdi:account-group" : "mdi:account"}
                  width={20}
                  color="grey"
                  style={{ marginRight: '8px' }}
                />
              </div>
            </div>
          ))}
        </div>

        <h2 className="label">Message:</h2>
        <textarea
          className="message-input"
          placeholder="Type your message..."
          value={messageContent}
          onChange={(e) => setMessageContent(e.target.value)}
        />

        <div className="file-upload-container">
          <label className="attach-button">
            Attach File
            <input
              type="file"
              style={{ display: 'none' }}
              onChange={handleAttachFile}
              multiple
            />
          </label>
        </div>

        {selectedDocuments.length > 0 && (
          <div className="selected-documents-container">
            <h2 className="label">Selected Documents:</h2>
            <div className="documents-list">
              {selectedDocuments.map((item, index) => (
                <div key={index} className="document-item">
                  <span className="document-name">{item}</span>
                  <button
                    className="remove-button"
                    onClick={() => handleRemoveDocument(index)}
                  >
                    <Icon icon="mdi:close" width={20} color="red" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <h2 className="label">Schedule Time:</h2>
        <div className="date-time-pickers">
          <div className="date-picker-container">
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              dateFormat="MMMM d, yyyy"
              className="date-picker-input"
            />
          </div>
          <div className="time-picker-container">
            <DatePicker
              selected={selectedTime}
              onChange={(time) => setSelectedTime(time)}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={15}
              timeCaption="Time"
              dateFormat="h:mm aa"
              className="time-picker-input"
            />
          </div>
        </div>

        <div className="confirm-toggle-container">
          <h2 className="label">Confirm for sending:</h2>
          <button
            className={`toggle-button ${confirmed ? 'active' : ''}`}
            onClick={() => setConfirmed(!confirmed)}
          >
            {confirmed ? 'Confirmed' : 'Not Confirmed'}
          </button>
        </div>

        <button className="submit-button" onClick={handleSubmit}>
          Schedule Message
        </button>
      </div>

      <style jsx>{`
        .schedule-screen {
          padding: 20px;
          background-color: #F5F5F5;
          min-height: 100vh;
        }
        
        .container {
          max-width: 800px;
          margin: 0 auto;
        }
        
        .label {
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 10px;
          color: #000;
        }
        
        .chat-list-container {
          max-height: 200px;
          overflow-y: auto;
          margin-bottom: 20px;
        }
        
        .chat-item {
          padding: 15px;
          background-color: #fff;
          border-radius: 10px;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
        }
        
        .selected-chat-item {
          background-color: green;
        }
        
        .chat-name {
          font-size: 16px;
          color: black;
        }
        
        .selected-chat-name {
          color: white;
        }
        
        .message-input {
          width: 100%;
          background-color: #fff;
          border-radius: 10px;
          padding: 15px;
          margin-bottom: 20px;
          font-size: 16px;
          color: black;
          border: 1px solid #ddd;
          min-height: 100px;
          resize: vertical;
        }
        
        .attach-button {
          background-color: #0CAF50;
          padding: 15px;
          border-radius: 10px;
          text-align: center;
          margin-bottom: 20px;
          color: #fff;
          font-size: 16px;
          font-weight: bold;
          display: inline-block;
          cursor: pointer;
        }
        
        .date-time-pickers {
          display: flex;
          gap: 15px;
          margin-bottom: 20px;
        }
        
        .date-picker-input,
        .time-picker-input {
          width: 100%;
          padding: 15px;
          border-radius: 10px;
          border: 1px solid #ddd;
          background-color: #fff;
        }
        
        .submit-button {
          width: 100%;
          background-color: #0CAF50;
          padding: 15px;
          border-radius: 10px;
          text-align: center;
          color: #fff;
          font-size: 16px;
          font-weight: bold;
          border: none;
          cursor: pointer;
        }
        
        .selected-documents-container {
          margin-bottom: 20px;
        }
        
        .documents-list {
          max-height: 150px;
          overflow-y: auto;
        }
        
        .document-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px;
          background-color: #fff;
          border-radius: 10px;
          margin-bottom: 10px;
        }
        
        .document-name {
          font-size: 14px;
          color: black;
        }
        
        .remove-button {
          padding: 5px;
          background: none;
          border: none;
          cursor: pointer;
        }
        
        .confirm-toggle-container {
          margin-bottom: 15px;
        }
        
        .toggle-button {
          width: 100%;
          background-color: #f9f9f9;
          padding: 12px;
          border-radius: 8px;
          text-align: center;
          border: 1px solid #ddd;
          font-size: 16px;
          color: #333;
          font-weight: bold;
          cursor: pointer;
        }
        
        .toggle-button.active {
          background-color: #075E54;
          border-color: #075E54;
          color: #fff;
        }
      `}</style>
    </div>
  );
};

export default ScheduleScreen;