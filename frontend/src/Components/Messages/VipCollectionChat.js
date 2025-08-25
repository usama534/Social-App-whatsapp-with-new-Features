// import React, { useEffect, useState } from "react";
// import { getVipChat } from "../../API/api.js";
// import "./Messages.css";

// const VipChat = ({ vipId }) => {
//     const [chatData, setChatData] = useState(null);

//     useEffect(() => {
//         const fetchChat = async () => {
//             const data = await getVipChat(vipId);
//             console.log("data", data);
//             setChatData(data);
//         };

//         if (vipId) {
//             fetchChat();
//         }
//     }, [vipId]);

//     return (
//         <div className="vip-chat-wrapper">
//             <div className="vip-chat-header">⭐ VIP Chat Messages ⭐</div>
//             <div className="vip-chat-body">
//                 {chatData?.messages?.length > 0 ? (
//                     chatData.messages.map((msg) => (
//                         <div className="vip-message-bubble" key={msg._id}>
//                             <div className="vip-message-info">
//                                 <span className="vip-sender-name">{msg.senderId.name}</span>
//                                 <span className="vip-message-time">
//                                     {new Date(msg.createdAt).toLocaleString()}
//                                 </span>
//                             </div>
//                             <div className="vip-message-text">{msg.content}</div>

//                             {msg.attachments?.length > 0 && (
//                                 <div className="vip-attachments">
//                                     {msg.attachments.map((file, i) => (
//                                         <a
//                                             key={i}
//                                             href={file}
//                                             className="vip-attachment-link"
//                                             target="_blank"
//                                             rel="noopener noreferrer"
//                                         >
//                                             📎 Attachment {i + 1}
//                                         </a>
//                                     ))}
//                                 </div>
//                             )}
//                         </div>
//                     ))
//                 ) : (
//                     <div className="vip-no-messages">No VIP messages yet.</div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default VipChat;

// code 2

// import React, { useEffect, useState, useRef } from 'react';
// import axios from 'axios';
// import API_URL from '../../Config';
// // import noProfile from '../Images/noProfile.jpeg';
// import { useLocation } from 'react-router-dom';
// import Sidebar from '../Sidebar/Sidebar';

// const VipCollectionChat = () => {
//     const location = useLocation();
//     const { collectionId, personName, personId } = location.state || {};
//     const [messages, setMessages] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [refreshing, setRefreshing] = useState(false);
//     const [groupMessages, setGroupMessages] = useState([]);
//     const messagesEndRef = useRef(null);

//     // Fetch VIP collection messages
//     const fetchVipMessages = async () => {
//         try {
//             const response = await axios.get(
//                 `${API_URL}api/user/getVipChat/${collectionId}`,
//             );
//             return response.data.messages.reverse(); // Reverse to show newest first
//         } catch (error) {
//             console.error('Error fetching VIP messages:', error);
//             return [];
//         }
//     };

//     // Fetch all groups where the VIP member participates
//     const fetchGroupsWithMember = async () => {
//         try {
//             // Get all chats the VIP member is part of
//             const chatsResponse = await axios.get(
//                 `${API_URL}api/chat/getChats_short/${personId}`,
//             );

//             // Filter only group chats
//             const groupChats = chatsResponse.data.filter(chat => chat.isGroup);

//             // Get messages from each group chat
//             const allGroupMessages = [];

//             for (const groupChat of groupChats) {
//                 try {
//                     // Get group details
//                     const groupResponse = await axios.get(
//                         `${API_URL}api/chatgroup/getGroupByChatId/${groupChat._id}`,
//                     );

//                     // Get group chat messages
//                     const chatResponse = await axios.get(
//                         `${API_URL}api/chatgroup/getGroupChat/${groupResponse.data._id}/${personId}`,
//                     );

//                     // Get group members to verify the VIP is still a member
//                     const membersResponse = await axios.get(
//                         `${API_URL}api/chatgroup/getMembers/${groupResponse.data._id}`,
//                     );

//                     // Check if VIP is still in the group
//                     const isStillMember = membersResponse.data.some(
//                         member => member.id === personId,
//                     );

//                     if (isStillMember && chatResponse.data.chat?.messages) {
//                         // Process messages with sender info
//                         const processedMessages = await Promise.all(
//                             chatResponse.data.chat.messages.map(async msg => {
//                                 // Get full message details
//                                 const messageResponse = await axios.get(
//                                     `${API_URL}api/chat/getMessage/${msg._id}/${personId}`,
//                                 );
//                                 if (messageResponse.data.senderId._id == personId) {
//                                     return {
//                                         ...messageResponse.data,
//                                         isGroupMessage: true,
//                                         groupName: groupResponse.data.name,
//                                         groupImg: groupResponse.data.imgUrl,
//                                     };
//                                 } else {
//                                     return null;
//                                 }
//                             }),
//                         );

//                         // Filter out null values before pushing
//                         allGroupMessages.push(
//                             ...processedMessages.filter(msg => msg !== null),
//                         );
//                     }
//                 } catch (error) {
//                     console.error(`Error processing group ${groupChat._id}:`, error);
//                 }
//             }

//             return allGroupMessages;
//         } catch (error) {
//             console.error('Error fetching group messages:', error);
//             return [];
//         }
//     };

//     const loadMessages = async () => {
//         try {
//             setLoading(true);
//             const [vipMessages, groupMsgs] = await Promise.all([
//                 fetchVipMessages(),
//                 fetchGroupsWithMember(),
//             ]);

//             // Combine and sort all messages by date
//             const allMessages = [...vipMessages, ...groupMsgs].sort(
//                 (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
//             );

//             setMessages(allMessages);
//         } catch (error) {
//             console.error('Error loading messages:', error);
//         } finally {
//             setLoading(false);
//             setRefreshing(false);
//         }
//     };

//     const onRefresh = () => {
//         setRefreshing(true);
//         loadMessages();
//     };

//     useEffect(() => {
//         if (collectionId && personId) {
//             loadMessages();
//         }
//     }, [collectionId, personId]);

//     const renderMessage = (item) => {
//         // Skip rendering if item is null or empty
//         if (!item || Object.keys(item).length === 0) {
//             return null;
//         }

//         return (
//             <div className="message-container" key={`${item._id}_${item.isGroupMessage ? 'group' : 'vip'}`}>
//                 <Sidebar />
//                 {item.isGroupMessage && (
//                     <div className="group-header">
//                         {/* <img
//               src={item.groupImg ? `${IMG_BASE_URL}${item.groupImg}` : noProfile}
//               alt={item.groupName}
//               className="group-avatar"
//             /> */}
//                         <div className="group-name">{item.groupName}</div>
//                     </div>
//                 )}

//                 {item.attachments?.length > 0 && (
//                     <img
//                         // src={`${IMG_BASE_URL}${item.attachments[0]}`}
//                         alt="Message attachment"
//                         className="message-image"
//                     />
//                 )}

//                 {item.content && <div className="message-text">{item.content}</div>}

//                 <div className="message-footer">
//                     {item.senderId?.name && (
//                         <div className="sender-name">{item.senderId.name}</div>
//                     )}
//                     <div className="timestamp">
//                         {new Date(item.createdAt).toLocaleString()}
//                     </div>
//                 </div>
//             </div>
//         );
//     };

//     return (
//         <div className="container">
//             {loading ? (
//                 <div className="loader">Loading...</div>
//             ) : (
//                 <div className="message-list">
//                     <button onClick={onRefresh} disabled={refreshing} className="refresh-button">
//                         {refreshing ? 'Refreshing...' : 'Refresh Messages'}
//                     </button>

//                     {messages.length > 0 ? (
//                         messages.map(item => renderMessage(item))
//                     ) : (
//                         <div className="empty-text">No messages found</div>
//                     )}

//                     <div ref={messagesEndRef} />
//                 </div>
//             )}
//         </div>
//     );
// };

// // CSS styles
// const styles = `
//   .container {
//     background-color: #fff;
//     min-height: 100vh;
//     padding: 20px;
//     margin-left:200px;
//   }

//   .loader {
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     height: 100px;
//     font-size: 18px;
//   }

//   .message-list {
//     padding: 16px;
//   }

//   .refresh-button {
//     margin-bottom: 16px;
//     padding: 8px 16px;
//     background-color: #6200ee;
//     color: white;
//     border: none;
//     border-radius: 4px;
//     cursor: pointer;
//   }

//   .refresh-button:disabled {
//     background-color: #cccccc;
//     cursor: not-allowed;
//   }

//   .message-container {
//     background-color: #f0f0f0;
//     padding: 12px;
//     border-radius: 8px;
//     margin-bottom: 12px;
//   }

//   .group-header {
//     display: flex;
//     align-items: center;
//     margin-bottom: 8px;
//   }

//   .group-avatar {
//     width: 30px;
//     height: 30px;
//     border-radius: 15px;
//     margin-right: 8px;
//     object-fit: cover;
//   }

//   .group-name {
//     font-weight: bold;
//     color: #333;
//   }

//   .message-text {
//     font-size: 16px;
//     color: #333;
//     margin-bottom: 8px;
//   }

//   .message-image {
//     width: 100%;
//     max-width: 500px;
//     height: auto;
//     max-height: 200px;
//     border-radius: 8px;
//     margin-bottom: 8px;
//     object-fit: cover;
//   }

//   .message-footer {
//     display: flex;
//     justify-content: space-between;
//     align-items: center;
//   }

//   .sender-name {
//     font-size: 12px;
//     color: #666;
//     font-style: italic;
//   }

//   .timestamp {
//     font-size: 12px;
//     color: #666;
//   }

//   .empty-text {
//     text-align: center;
//     margin-top: 20px;
//     color: #666;
//   }
// `;

// // Add styles to the head
// const styleElement = document.createElement('style');
// styleElement.innerHTML = styles;
// document.head.appendChild(styleElement);

// export default VipCollectionChat;

// code 3

// import React, { useEffect, useState, useRef } from 'react';
// import {
//     FaComments,
//     FaUserCircle,
//     FaUsers,
//     FaSync
// } from 'react-icons/fa';
// import API_URL from '../../Config';
// import { useParams } from 'react-router-dom';
// import Sidebar from "../Sidebar/Sidebar";
// import "./vipchat.css";

// const VipCollectionChat = ({ route }) => {
//     const { collectionId, personName, personId } = useParams();
//     const [messages, setMessages] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [refreshing, setRefreshing] = useState(false);
//     const messagesEndRef = useRef(null);

//     const [error, setError] = useState(null);

//     const decodedPersonName = decodeURIComponent(personName);

//     // const fetchVipMessages = async () => {
//     //     try {
//     //         if (!collectionId) {
//     //             throw new Error('collectionId is undefined');
//     //         }
//     //         const response = await fetch(`${API_URL}user/getVipChat/${collectionId}`);
//     //         if (!response.ok) throw new Error('Network response was not ok');
//     //         // ... rest of your code
//     //     } catch (error) {
//     //         setError(error.message);
//     //         return [];
//     //     }
//     // };
//     // Temporarily add this to see the actual response
//     const fetchVipMessages = async () => {
//         try {
//             const response = await fetch(`${API_URL}user/getVipChat/${collectionId}`);

//             // First check if response is HTML
//             const contentType = response.headers.get('content-type');
//             if (contentType?.includes('text/html')) {
//                 const text = await response.text();
//                 throw new Error(`Server returned HTML: ${text.substring(0, 50)}...`);
//             }

//             if (!response.ok) {
//                 const error = await response.json().catch(() => ({}));
//                 throw new Error(error.message || 'Request failed');
//             }

//             return await response.json();
//         } catch (error) {
//             console.error('Fetch error:', error);
//             setError(error.message.includes('HTML')
//                 ? 'API endpoint not found'
//                 : error.message);
//             return [];
//         }
//     };

//     // Fetch all groups where the VIP member participates
//     const fetchGroupsWithMember = async () => {
//         try {
//             const chatsResponse = await fetch(`${API_URL}api/chat/getChats_short/${personId}`);
//             if (!chatsResponse.ok) throw new Error('Failed to fetch chats');

//             const chatsData = await chatsResponse.json();
//             if (!Array.isArray(chatsData)) return [];

//             // Filter only group chats
//             const groupChats = chatsData.filter(chat => chat.isGroup);

//             // Get messages from each group chat
//             const allGroupMessages = [];

//             for (const groupChat of groupChats) {
//                 try {
//                     // Get group details
//                     const groupResponse = await fetch(`${API_URL}api/chatgroup/getGroupByChatId/${groupChat._id}`);
//                     const groupData = await groupResponse.json();

//                     // Get group chat messages
//                     const chatResponse = await fetch(`${API_URL}api/chatgroup/getGroupChat/${groupData._id}/${personId}`);
//                     const chatData = await chatResponse.json();

//                     // Get group members to verify the VIP is still a member
//                     const membersResponse = await fetch(`${API_URL}api/chatgroup/getMembers/${groupData._id}`);
//                     const membersData = await membersResponse.json();

//                     // Check if VIP is still in the group
//                     const isStillMember = membersData.some(member => member.id === personId);

//                     if (isStillMember && chatData.chat?.messages) {
//                         // Process messages with sender info
//                         const processedMessages = await Promise.all(
//                             chatData.chat.messages.map(async msg => {
//                                 // Get full message details
//                                 const messageResponse = await fetch(`${API_URL}api/chat/getMessage/${msg._id}/${personId}`);
//                                 const messageData = await messageResponse.json();

//                                 if (messageData.senderId._id === personId) {
//                                     return {
//                                         ...messageData,
//                                         isGroupMessage: true,
//                                         groupName: groupData.name,
//                                         groupImg: groupData.imgUrl,
//                                     };
//                                 } else {
//                                     return null;
//                                 }
//                             })
//                         );

//                         // Filter out null values before pushing
//                         allGroupMessages.push(...processedMessages.filter(msg => msg !== null));
//                     }
//                 } catch (error) {
//                     console.error(`Error processing group ${groupChat._id}:`, error);
//                 }
//             }

//             return allGroupMessages;
//         } catch (error) {
//             console.error('Error:', error);
//             return [];
//         }
//     };

//     const loadMessages = async () => {
//         if (!collectionId || !personId) {
//             console.error('Missing required parameters');
//             return;
//         }
//         try {
//             setLoading(true);
//             const [vipMessages, groupMsgs] = await Promise.all([
//                 fetchVipMessages(),
//                 fetchGroupsWithMember(),
//             ]);

//             // Combine and sort all messages by date
//             const allMessages = [...vipMessages, ...groupMsgs].sort(
//                 (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
//             );

//             setMessages(allMessages);
//         } catch (error) {
//             console.error('Error loading messages:', error);
//         } finally {
//             setLoading(false);
//             setRefreshing(false);
//         }
//     };

//     const onRefresh = () => {
//         setRefreshing(true);
//         loadMessages();
//     };

//     useEffect(() => {
//         loadMessages();
//     }, [collectionId, personId]); // Add dependencies to prevent stale closures

//     useEffect(() => {
//         // Scroll to bottom when messages update
//         messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//     }, [messages]);


//     const renderMessage = (item) => {
//         if (!item || Object.keys(item).length === 0) {
//             return null;
//         }

//         return (
//             <div className="message-container" key={`${item._id}_${item.isGroupMessage ? 'group' : 'vip'}`}>

//                 {item.isGroupMessage && (
//                     <div className="group-header">
//                         {item.groupImg ? (
//                             <img
//                                 // src={`${IMG_BASE_URL}${item.groupImg}`} 
//                                 alt={item.groupName}
//                                 className="group-avatar"
//                             />
//                         ) : (
//                             <FaUsers className="group-avatar default-avatar" />
//                         )}
//                         <span className="group-name">{item.groupName}</span>
//                     </div>
//                 )}

//                 {item.attachments?.length > 0 && (
//                     <img
//                         // src={`${IMG_BASE_URL}${item.attachments[0]}`}
//                         className="message-image"
//                         alt="Message attachment"
//                     />
//                 )}

//                 {item.content && <div className="message-text">{item.content}</div>}

//                 <div className="message-footer">
//                     {item.senderId?.name && (
//                         <span className="sender-name">
//                             <FaUserCircle className="sender-icon" /> {item.senderId.name}
//                         </span>
//                     )}
//                     <span className="timestamp">
//                         {new Date(item.createdAt).toLocaleString()}
//                     </span>
//                 </div>
//             </div>
//         );
//     };

//     return (
//         <div className="container">
//             <Sidebar />
//             <div className="chat-header">
//                 <h2>{decodedPersonName}'s Messages</h2>
//             </div>
//             {error ? (
//                 <div className="error-message">
//                     Error loading messages for {decodedPersonName}: {error}
//                     <button onClick={loadMessages}>Retry</button>
//                 </div>
//             ) : loading ? (
//                 <div className="loader">Loading...</div>
//             ) : (
//                 <div className="message-list">
//                     <button className="refresh-button" onClick={onRefresh} disabled={refreshing}>
//                         <FaSync className={refreshing ? 'spinning' : ''} />
//                         {refreshing ? 'Refreshing...' : 'Refresh'}
//                     </button>

//                     {messages.length === 0 ? (
//                         <div className="empty-message">
//                             <FaComments className="empty-icon" />
//                             No messages found with {decodedPersonName}
//                         </div>
//                     ) : (
//                         messages.map(renderMessage)
//                     )}

//                     <div ref={messagesEndRef} />
//                 </div>
//             )}

//         </div>
//     );

// };

// export default VipCollectionChat;


import React, { useEffect, useState, useRef } from 'react';
import API_URL from '../../Config';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './vipchat.css';
import Sidebar from '../Sidebar/Sidebar';
import IMG_URL from '../../imagurl';

const VipCollectionChat = () => {
    const { collectionId, personId, personName } = useParams();

    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const messagesEndRef = useRef(null);
    console.log("VIP Chat Params:", { collectionId, personId, personName });
    // Fetch VIP collection messages
    const fetchVipMessages = async () => {
        try {
            const response = await axios.get(
                `${API_URL}api/user/getVipChat/${collectionId}`
            );

            console.log("VIP Chat Document:", {
                exists: !!response.data,
                hasMessages: response.data?.messages?.length > 0,
                creator: response.data?.creator,
                person: response.data?.person
            });

            // Return empty array if no messages (but log details)
            if (!response.data?.messages || response.data.messages.length === 0) {
                console.warn(`VIP chat ${collectionId} exists but has no messages`, {
                    document: response.data
                });
                return [];
            }

            return response.data.messages.reverse();
        } catch (error) {
            console.error('Error:', {
                message: error.message,
                url: error.config?.url,
                status: error.response?.status
            });
            return [];
        }
    };

    // Fetch all groups where the VIP member participates
    const fetchGroupsWithMember = async () => {
        try {
            // Get all chats the VIP member is part of
            const chatsResponse = await axios.get(
                `${API_URL}api/chat/getChats_short/${personId}`
            );

            // Filter only group chats
            const groupChats = chatsResponse.data.filter(chat => chat.isGroup);

            // Get messages from each group chat
            const allGroupMessages = [];

            for (const groupChat of groupChats) {
                try {
                    // Get group details
                    const groupResponse = await axios.get(
                        `${API_URL}api/chatgroup/getGroupByChatId/${groupChat._id}`
                    );

                    // Get group chat messages
                    console.log("Making group chat call with:", {
                        groupId: groupResponse.data._id,
                        personId,
                    });

                    const chatResponse = await axios.get(

                        `${API_URL}api/chatgroup/getGroupChat/${groupResponse.data._id}/${personId}`
                    );

                    // Get group members to verify the VIP is still a member
                    const membersResponse = await axios.get(
                        `${API_URL}api/chatgroup/getMembers/${groupResponse.data._id}`
                    );

                    // Check if VIP is still in the group
                    const isStillMember = membersResponse.data.some(
                        member => member.id === personId
                    );

                    if (isStillMember && chatResponse.data.chat?.messages) {
                        // Process messages with sender info
                        const processedMessages = await Promise.all(
                            chatResponse.data.chat.messages.map(async msg => {
                                // Get full message details
                                const messageResponse = await axios.get(
                                    `${API_URL}api/chat/getMessage/${msg._id}/${personId}`
                                );

                                if (messageResponse.data.senderId._id === personId) {
                                    return {
                                        ...messageResponse.data,
                                        isGroupMessage: true,
                                        groupName: groupResponse.data.name,
                                        groupImg: groupResponse.data.imgUrl,
                                    };
                                } else {
                                    return null;
                                }
                            })
                        );

                        // Filter out null values before pushing
                        allGroupMessages.push(...processedMessages.filter(msg => msg !== null));
                    }
                } catch (error) {
                    console.error(`Error processing group ${groupChat._id}:`, error);
                }
            }

            return allGroupMessages;
        } catch (error) {
            console.error('Error fetching group messages:', error);
            return [];
        }
    };


    const loadMessages = async () => {
        try {
            setLoading(true);
            const [vipMessages, groupMsgs] = await Promise.all([

                fetchVipMessages(),
                fetchGroupsWithMember(),
            ]);

            // Combine and sort all messages by date
            const allMessages = [...vipMessages, ...groupMsgs].sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );

            setMessages(allMessages);
        } catch (error) {
            console.error('Error loading messages:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        loadMessages();
    };

    useEffect(() => {
        loadMessages();
    }, []);

    useEffect(() => {
        // Scroll to bottom when messages update
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const renderMessage = (item) => {
        if (!item || Object.keys(item).length === 0) {
            return null;
        }

        return (
            <div className="message-container" key={`${item._id}_${item.isGroupMessage ? 'group' : 'vip'}`}>
                {item.isGroupMessage && (
                    <div className="group-header">
                        {item.groupImg ? (
                            <img
                                src={`${IMG_URL}${item.groupImg}`}
                                alt={item.groupName}
                                className="group-avatar"
                            />
                        ) : (
                            <div className="group-avatar default-avatar">
                                <i className="fas fa-users"></i>
                            </div>
                        )}
                        <span className="group-name">{item.groupName}</span>
                    </div>
                )}

                {item.attachments?.length > 0 && (
                    <img
                        src={`${IMG_URL}${item.attachments[0]}`}
                        className="message-image"
                        alt="Message attachment"
                    />
                )}

                {item.content && <div className="message-text">{item.content}</div>}

                <div className="message-footer">
                    {item.senderId?.name && (
                        <span className="sender-name">
                            <i className="fas fa-user-circle sender-icon"></i> {item.senderId.name}
                        </span>
                    )}
                    <span className="timestamp">
                        {new Date(item.createdAt).toLocaleString()}
                    </span>
                </div>
            </div>
        );
    };

    return (
        <div className="container">
            <Sidebar />
            <div className="chat-header">
                <h2>{decodeURIComponent(personName)}'s Messages</h2>
            </div>

            {loading ? (
                <div className="loader">
                    <div className="spinner"></div>
                </div>
            ) : (
                <div className="message-list">
                    <button className="refresh-button" onClick={onRefresh} disabled={refreshing}>
                        <i className={`fas fa-sync ${refreshing ? 'spinning' : ''}`}></i>
                        {refreshing ? 'Refreshing...' : 'Refresh'}
                    </button>

                    {messages.length === 0 ? (
                        <div className="empty-message">
                            <i className="fas fa-comments empty-icon"></i>
                            No messages found with {decodeURIComponent(personName)}
                        </div>
                    ) : (
                        messages.map(renderMessage)
                    )}

                    <div ref={messagesEndRef} />
                </div>
            )}
        </div>
    );
};

export default VipCollectionChat;