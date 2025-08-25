// import { useEffect, useState } from "react";
// import "./Messages.css";
// import { getVipCollections } from "../../API/api";
// import VipChat from "./VipChat"; // 👈 Import the chat component

// function VIPCollection({ onClose }) {
//     const [vipChats, setVipChats] = useState([]);
//     const [selectedChatId, setSelectedChatId] = useState(null); // 👈 For selected chat

//     const uid = localStorage.getItem("userId");

//     useEffect(() => {
//         const fetchVIPs = async () => {
//             const data = await getVipCollections(uid);
//             setVipChats(data);
//         };

//         if (uid) {
//             fetchVIPs();
//         }
//     }, [uid]);

//     // 👇 Show chat screen if one is selected
//     if (selectedChatId) {
//         return (
//             <div className="vip-collection">
//                 <div className="vip-header">
//                     <button className="back-button" onClick={() => setSelectedChatId(null)}>← Back</button>
//                     <h2>VIP Chat</h2>
//                     <button className="close-button" onClick={onClose}>X</button>
//                 </div>
//                 <VipChat vipId={selectedChatId} />
//             </div>
//         );
//     }

//     // 👇 Show VIP list if no chat is selected
//     return (
//         <div className="vip-collection">
//             <div className="vip-header">
//                 <h2>VIP Collection</h2>
//                 <button className="close-button" onClick={onClose}>X</button>
//             </div>
//             <div className="vip-chats">
//                 {vipChats.map((chat) => (
//                     <div
//                         key={chat._id}
//                         className="vip-chat-item"
//                         onClick={() => setSelectedChatId(chat._id)}
//                     >
//                         <div className="avatar">
//                             <img src={chat.person.imgUrl} alt={chat.person.name} />
//                         </div>
//                         <div className="vip-chat-details">
//                             <div className="vip-chat-name">{chat.person.name}</div>
//                             <div className="vip-chat-message">Click to view chat</div>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// }

// export default VIPCollection;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_URL from '../../Config';
// import noProfile from '../Images/noProfile.jpeg';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaTrash, FaTimes } from 'react-icons/fa';
import IMG_URL from '../../imagurl';

const VipCollections = () => {
    const navigate = useNavigate();
    const uid = localStorage.getItem('userId');
    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [nonVipPeople, setNonVipPeople] = useState([]);

    const fetchVipCollections = async () => {
        try {
            setLoading(true);
            const res = await axios.get(
                `${API_URL}api/user/getVipCollections/${uid}`,
            );
            setCollections(res.data);
        } catch (err) {
            console.error('Error fetching VIP Collections:', err);
            alert('Failed to load VIP collections');
        } finally {
            setLoading(false);
        }
    };

    const fetchNonVipPeople = async () => {
        try {
            const res = await axios.get(
                `${API_URL}api/user/getPeopleNotInCollection/${uid}`,
            );
            setNonVipPeople(res.data);
        } catch (err) {
            console.error('Error fetching non-VIP people:', err);
        }
    };

    useEffect(() => {
        fetchVipCollections();
    }, []);

    const handleAddToVip = async personId => {
        try {
            const personToAdd = nonVipPeople.find(person => person._id === personId);

            const createRes = await axios.post(
                `${API_URL}api/user/createVipCollection/${uid}`,
                { person: personId },
            );

            const tempCollection = {
                ...createRes.data,
                person: personToAdd || { _id: personId },
            };

            setCollections(prev => [tempCollection, ...prev]);
            setModalVisible(false);
            fetchVipCollections();
        } catch (err) {
            alert('Failed to add to VIP collection');
            console.error('Error adding to VIP:', err);
        }
    };

    const handleDeleteCollection = async collectionId => {
        try {
            if (window.confirm('Are you sure you want to delete this VIP collection?')) {
                await axios.delete(
                    `${API_URL}api/user/deleteVipCollection/${collectionId}`,
                );
                setCollections(prev => prev.filter(c => c._id !== collectionId));
            }
        } catch (err) {
            console.error('Error deleting collection:', err);
            alert('Failed to delete VIP collection');
        }
    };

    const renderVipItem = (item) => (
        <div className="collection-item-container">
            <div
                className="collection-item"
                // onClick={() => navigate('/VipCollectionChat', {
                //     state: {
                //         collectionId: item._id,
                //         personName: item.person?.name || 'VIP Collection',
                //         personId: item.person?._id,
                //     }
                // })}
                onClick={() => navigate(
                    `/VipCollectionChat/${item._id}/${item.person?._id}/${encodeURIComponent(item.person?.name || 'VIP')}`
                )}
            >
                <img
                    src={item.person?.imgUrl ? `${IMG_URL}${item.person.imgUrl}` : '/default-user.png'}
                    alt={item.person?.name || 'VIP'}
                    className="avatar"
                />
                <div className="text-container">
                    <div className="name">{item.person?.name || 'Loading...'}</div>
                    <div className="type">VIP Collection</div>
                </div>
            </div>
            <button
                className="delete-button"
                onClick={() => handleDeleteCollection(item._id)}
            >
                <FaTrash color="#ff4444" />
            </button>
        </div>
    );

    const renderNonVipItem = (item) => (
        <div
            className="collection-item"
            onClick={() => handleAddToVip(item._id)}
        >
            <img
                src={item.imgUrl ? `${IMG_URL}${item.imgUrl}` : '/default-user.png'}
                alt={item.name}
                className="avatar"
            />
            <div className="text-container">
                <div className="name">{item.name}</div>
                <div className="type">Add to VIP</div>
            </div>
        </div>
    );

    return (
        <div className="container">
            {loading ? (
                <div className="loading-spinner">Loading...</div>
            ) : (
                <div className="list-content">
                    {collections.length > 0 ? (
                        collections.map(item => (
                            <React.Fragment key={item._id}>
                                {renderVipItem(item)}
                            </React.Fragment>
                        ))
                    ) : (
                        <div className="empty-text">No VIP collections found</div>
                    )}
                </div>
            )}

            <button
                className="fab"
                onClick={() => {
                    fetchNonVipPeople();
                    setModalVisible(true);
                }}
            >
                <FaPlus color="#fff" />
            </button>

            {modalVisible && (
                <div className="modal-overlay">
                    <div className="modal-container">
                        <div className="modal-header">
                            <div className="modal-title">Create A VIP Collection</div>
                            <button onClick={() => setModalVisible(false)}>
                                <FaTimes color="#000" />
                            </button>
                        </div>
                        <div className="modal-list-content">
                            {nonVipPeople.length > 0 ? (
                                nonVipPeople.map(item => (
                                    <React.Fragment key={item._id}>
                                        {renderNonVipItem(item)}
                                    </React.Fragment>
                                ))
                            ) : (
                                <div className="empty-text">No contacts available</div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// CSS (you can put this in a separate .css file)
const styles = `
  .container {
    flex: 1;
    background-color: #f5f5f5;
    position: relative;
    height: 700px;
    width: 500px
  }

  .list-content {
    padding: 16px;
  }

  .modal-list-content {
    padding: 0 16px;
  }

  .collection-item-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    background-color: #fff;
    border-radius: 8px;
    margin-bottom: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }

  .collection-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 12px;
    flex: 1;
    cursor: pointer;
  }

  .avatar {
    width: 50px;
    height: 50px;
    border-radius: 25px;
    margin-right: 12px;
    object-fit: cover;
  }

  .text-container {
    flex: 1;
  }

  .name {
    font-size: 16px;
    font-weight: bold;
    color: #000;
  }

  .type {
    font-size: 14px;
    color: #666;
    margin-top: 2px;
  }

  .delete-button {
    padding: 16px;
    background: none;
    border: none;
    cursor: pointer;
  }

  .fab {
    position: fixed;
    right: 24px;
    bottom: 24px;
    width: 56px;
    height: 56px;
    border-radius: 28px;
    background-color: #14AE5C;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 3px 5px rgba(0,0,0,0.3);
    border: none;
    cursor: pointer;
    color: white;
  }

  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0,0,0,0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .modal-container {
    background-color: #f5f5f5;
    width: 80%;
    max-width: 600px;
    max-height: 80vh;
    overflow-y: auto;
    border-radius: 8px;
  }

  .modal-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    border-bottom: 1px solid #eee;
  }

  .modal-title {
    font-size: 18px;
    font-weight: bold;
    color: #000;
  }

  .empty-text {
    text-align: center;
    margin-top: 20px;
    color: #666;
  }

  .loading-spinner {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100px;
    color: #6200ee;
  }
`;

// Add styles to the head
const styleElement = document.createElement('style');
styleElement.innerHTML = styles;
document.head.appendChild(styleElement);

export default VipCollections;