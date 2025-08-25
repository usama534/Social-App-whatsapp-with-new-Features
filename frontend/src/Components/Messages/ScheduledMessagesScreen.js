import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment-timezone';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaEdit, FaPauseCircle, FaCheckCircle, FaTrash, FaCalendarAlt, FaClock, FaPaperclip, FaTimes, FaPlus } from 'react-icons/fa';
import API_URL from '../../Config';


const ViewScheduledMessages = () => {
    const navigate = useNavigate();
    const [scheduledMessages, setScheduledMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editingMessage, setEditingMessage] = useState(null);
    const [chats, setChats] = useState([]);
    const [selectedChats, setSelectedChats] = useState([]);
    const [messageContent, setMessageContent] = useState('');
    const [attachments, setAttachments] = useState([]);
    const [existingAttachments, setExistingAttachments] = useState([]);
    const [pushTime, setPushTime] = useState(new Date());
    const [selectedDocuments, setSelectedDocuments] = useState([]);
    const [confirmed, setConfirmed] = useState(false);

    const userId = localStorage.getItem('userId');

    useEffect(() => {
        fetchScheduledMessages();
        fetchChats();
    }, []);

    const fetchScheduledMessages = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}api/chat/getScheduledMessages/${userId}`);
            setScheduledMessages(response.data);
        } catch (error) {
            console.error('Failed to fetch scheduled messages:', error);
            alert('Error: Failed to load scheduled messages');
        } finally {
            setLoading(false);
        }
    };

    const fetchChats = async () => {
        try {
            const response = await axios.get(`${API_URL}api/chat/getAllChats/${userId}`);
            setChats(response.data);
        } catch (error) {
            console.error('Error fetching chats:', error);
        }
    };

    const handleConfirm = async (messageId) => {
        try {
            setProcessing(true);
            await axios.put(`${API_URL}api/chat/confirmScheduledMessage/${messageId}`);
            fetchScheduledMessages();
            alert('Success: Message confirmed for sending');
        } catch (error) {
            console.error('Failed to confirm message:', error);
            alert('Error: Failed to confirm message');
        } finally {
            setProcessing(false);
        }
    };

    const handleCancel = async (messageId) => {
        try {
            setProcessing(true);
            await axios.put(`${API_URL}api/chat/cancelScheduledMessage/${messageId}`);
            fetchScheduledMessages();
            alert('Success: Message cancelled');
        } catch (error) {
            console.error('Failed to cancel message:', error);
            alert('Error: Failed to cancel message');
        } finally {
            setProcessing(false);
        }
    };

    const handleDelete = async (messageId) => {
        try {
            setProcessing(true);
            await axios.delete(`${API_URL}api/chat/deleteScheduledMessage/${messageId}`);
            fetchScheduledMessages();
            alert('Success: Message deleted');
        } catch (error) {
            console.error('Failed to delete message:', error);
            alert('Error: Failed to delete message');
        } finally {
            setProcessing(false);
        }
    };

    const openEditModal = (message) => {
        const localPushTime = new Date(message.pushTime);
        console.log('Edit Message', message);
        setEditingMessage(message);
        setMessageContent(message.message.content || '');
        setExistingAttachments(message.message.attachments || []);
        setSelectedChats(message.chat || []);
        // setPushTime(new Date(message.pushTime));
        setPushTime(localPushTime);
        setConfirmed(message.confirmed || false);
        setSelectedDocuments(
            message.message.attachments?.map(att => att.split('/').pop()) || []
        );
        setEditModalVisible(true);
    };

    const closeEditModal = () => {
        setEditModalVisible(false);
        setEditingMessage(null);
        setMessageContent('');
        setExistingAttachments([]);
        setSelectedChats([]);
        setPushTime(new Date());
        setConfirmed(false);
        setSelectedDocuments([]);
    };

    const handleChatSelection = (chatId) => {
        if (selectedChats.includes(chatId)) {
            setSelectedChats(selectedChats.filter(id => id !== chatId));
        } else {
            setSelectedChats([...selectedChats, chatId]);
        }
    };

    const handleAttachFile = (e) => {
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

    const handleRemoveDocument = (index, isExisting = false) => {
        if (isExisting) {
            const updatedAttachments = [...existingAttachments];
            updatedAttachments.splice(index, 1);
            setExistingAttachments(updatedAttachments);

            const updatedDocuments = [...selectedDocuments];
            updatedDocuments.splice(index, 1);
            setSelectedDocuments(updatedDocuments);
        } else {
            const updatedAttachments = [...attachments];
            updatedAttachments.splice(index, 1);
            setAttachments(updatedAttachments);

            const updatedDocuments = [...selectedDocuments];
            updatedDocuments.splice(index, 1);
            setSelectedDocuments(updatedDocuments);
        }
    };

    // const handleUpdateMessage = async () => {
    //     try {
    //         setProcessing(true);
    //         const formData = new FormData();

    //         // Add new files
    //         attachments.forEach((fileObj) => {
    //             formData.append('messageAttachments', fileObj.file);
    //         });

    //         // Add chats as individual fields (not JSON string)
    //         selectedChats.forEach(chatId => {
    //             formData.append('chats', chatId);
    //         });

    //         formData.append('messageContent', messageContent);
    //         formData.append('pushTime', pushTime.toISOString());

    //         // Add existing attachments as individual fields
    //         existingAttachments.forEach(attachment => {
    //             formData.append('existingAttachments', attachment);
    //         });

    //         formData.append('confirmed', confirmed.toString());

    //         const response = await axios.post(
    //             `${API_URL}api/chat/updateScheduledMessage/${editingMessage._id}`,
    //             formData,
    //             {
    //                 headers: {
    //                     'Content-Type': 'multipart/form-data',
    //                 },
    //             }
    //         );

    //         alert('Success: Message updated successfully!');
    //         fetchScheduledMessages();
    //         closeEditModal();
    //     } catch (error) {
    //         console.error('Error updating message:', error);
    //         alert('Error: Failed to update message.');
    //     } finally {
    //         setProcessing(false);
    //     }
    // };
    const handleUpdateMessage = async () => {
        try {
            setProcessing(true);
            const formData = new FormData();

            // Add new files
            attachments.forEach((fileObj) => {
                formData.append('messageAttachments', fileObj.file);
            });

            // Add each chat ID as a separate field
            selectedChats.forEach(chatId => {
                formData.append('chats', chatId);
            });

            formData.append('messageContent', messageContent);
            formData.append('pushTime', pushTime.toISOString());

            // Add existing attachments
            existingAttachments.forEach(attachment => {
                formData.append('existingAttachments', attachment);
            });

            formData.append('confirmed', confirmed.toString());

            const response = await axios.post(
                `${API_URL}api/chat/updateScheduledMessage/${editingMessage._id}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            if (response.data.success) {
                alert('Message updated successfully!');
                fetchScheduledMessages();
                closeEditModal();
            } else {
                throw new Error(response.data.error || 'Failed to update message');
            }
        } catch (error) {
            console.error('Error updating message:', error);
            alert(`Error: ${error.message}`);
        } finally {
            setProcessing(false);
        }
    };
    const renderMessage = (item) => {
        const hasAttachments = item.message?.attachments?.length > 0;
        const scheduledTime = moment.utc(item.pushTime).local().format('MMM D, YYYY h:mm A');

        return (
            <div className="message-card" key={item._id}>
                <div className="message-content">
                    <p className="message-text">{item.message?.content || 'No text content'}</p>

                    {hasAttachments && (
                        <div className="attachments-container">
                            <FaPaperclip size={16} color="#666" />
                            <span className="attachment-text">
                                {item.message.attachments.length} attachment(s)
                            </span>
                        </div>
                    )}

                    <p className="time-text">Scheduled for: {scheduledTime}</p>

                    <p className="status-text">
                        Status: {item.confirmed ? 'Confirmed' : 'Pending'}
                    </p>
                </div>

                <div className="actions-container">
                    <button
                        onClick={() => openEditModal(item)}
                        disabled={processing}
                        className="action-button">
                        <FaEdit size={20} color="#4CAF50" />
                    </button>

                    <button
                        onClick={() => item.confirmed ? handleCancel(item._id) : handleConfirm(item._id)}
                        disabled={processing}
                        className="action-button">
                        {item.confirmed ? (
                            <FaPauseCircle size={20} color="#FF9800" />
                        ) : (
                            <FaCheckCircle size={20} color="#4CAF50" />
                        )}
                    </button>

                    <button
                        onClick={() => handleDelete(item._id)}
                        disabled={processing}
                        className="action-button">
                        <FaTrash size={20} color="#F44336" />
                    </button>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="container">

            <div className="messages-list">
                {scheduledMessages.length > 0 ? (
                    scheduledMessages.map(item => renderMessage(item))
                ) : (
                    <div className="empty-container">
                        <p className="empty-text">No scheduled messages</p>
                    </div>
                )}
            </div>

            <button
                className="add-button"
                onClick={() => navigate('/SchedulerMessage')}>
                <FaPlus size={30} color="white" />
            </button>

            {/* Edit Modal */}
            {editModalVisible && (
                <div className="modal-overlay">
                    <div className="modal-container">
                        <div className="modal-header">
                            <h2 className="modal-title">Edit Scheduled Message</h2>
                            <button onClick={closeEditModal} className="close-button">
                                <FaTimes size={24} color="#333" />
                            </button>
                        </div>

                        <div className="modal-content">
                            <label className="label">Select Chats:</label>
                            <div className="chat-list-container">
                                {chats.map(item => (
                                    <div
                                        key={item.id}
                                        className={`chat-item ${selectedChats.includes(item.id) ? 'selected-chat-item' : ''}`}
                                        onClick={() => handleChatSelection(item.id)}>
                                        <span className={`chat-name ${selectedChats.includes(item.id) ? 'selected-chat-name' : ''}`}>
                                            {item.chatInfo.name}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <label className="label">Message:</label>
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
                                    <label className="label">Attachments:</label>
                                    {selectedDocuments.map((item, index) => (
                                        <div key={index} className="document-item">
                                            <span className="document-name">{item}</span>
                                            <button
                                                className="remove-button"
                                                onClick={() => handleRemoveDocument(index, index < existingAttachments.length)}
                                            >
                                                <FaTimes size={20} color="#F44336" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <label className="label">Schedule Time:</label>
                            <div className="datetime-container">
                                <div className="datetime-group">
                                    <label className="datetime-label">
                                        <FaCalendarAlt size={20} color="#075E54" />
                                        Date:
                                    </label>
                                    <DatePicker
                                        selected={pushTime}
                                        onChange={(date) => setPushTime(date)}
                                        dateFormat="MMM d, yyyy"
                                        className="date-picker-input"
                                    />
                                </div>
                                <div className="datetime-group">
                                    <label className="datetime-label">
                                        <FaClock size={20} color="#075E54" />
                                        Time:
                                    </label>
                                    <DatePicker
                                        selected={pushTime}
                                        onChange={(time) => setPushTime(time)}
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
                                <label className="label">Confirm for sending:</label>
                                <button
                                    className={`toggle-button ${confirmed ? 'active' : ''}`}
                                    onClick={() => setConfirmed(!confirmed)}>
                                    {confirmed ? 'Confirmed' : 'Not Confirmed'}
                                </button>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button
                                className="cancel-button"
                                onClick={closeEditModal}
                                disabled={processing}>
                                Cancel
                            </button>
                            <button
                                className="update-button"
                                onClick={handleUpdateMessage}
                                disabled={processing}>
                                {processing ? (
                                    <span className="spinner"></span>
                                ) : (
                                    'Update Message'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// export default ViewScheduledMessages;

// CSS Styles
const styles = `
  .container {
    padding: 20px;
    background-color: #f5f5f5;
    min-height: 100vh;
    position: relative;
  }

  .loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }

  .spinner {
    border: 4px solid rgba(0, 0, 0, 0.1);
    border-radius: 50%;
    border-top: 4px solid #075E54;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .messages-list {
    display: grid;
    gap: 15px;
    padding: 15px;
  }

  .message-card {
    background-color: white;
    border-radius: 10px;
    padding: 15px;
    display: flex;
    justify-content: space-between;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }

  .message-content {
    flex: 1;
    margin-right: 10px;
  }

  .message-text {
    font-size: 16px;
    color: #333;
    margin-bottom: 8px;
  }

  .attachments-container {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
  }

  .attachment-text {
    font-size: 14px;
    color: #666;
    margin-left: 5px;
  }

  .time-text {
    font-size: 14px;
    color: #666;
    margin-bottom: 4px;
  }

  .status-text {
    font-size: 14px;
    color: #2196F3;
    font-weight: 500;
  }

  .actions-container {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .action-button {
    background: none;
    border: none;
    padding: 8px;
    cursor: pointer;
  }

  .empty-container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
  }

  .empty-text {
    font-size: 18px;
    color: #757575;
  }

  .add-button {
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background-color: #075E54;
    display: flex;
    justify-content: center;
    align-items: center;
    border: none;
    cursor: pointer;
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  }

  /* Modal Styles */
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
    background-color: #fff;
    border-radius: 10px;
    width: 90%;
    max-width: 800px;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    border-bottom: 1px solid #eee;
  }

  .modal-title {
    font-size: 20px;
    font-weight: bold;
    color: #333;
    margin: 0;
  }

  .close-button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 5px;
  }

  .modal-content {
    padding: 20px;
    overflow-y: auto;
    flex: 1;
  }

  .modal-footer {
    display: flex;
    justify-content: space-between;
    padding: 15px;
    border-top: 1px solid #eee;
  }

  .label {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 10px;
    color: #333;
    display: block;
  }

  .chat-list-container {
    max-height: 150px;
    overflow-y: auto;
    margin-bottom: 15px;
    border: 1px solid #eee;
    border-radius: 8px;
  }

  .chat-item {
    padding: 12px;
    background-color: #f9f9f9;
    border-radius: 8px;
    margin-bottom: 8px;
    cursor: pointer;
  }

  .selected-chat-item {
    background-color: #075E54;
  }

  .chat-name {
    font-size: 16px;
    color: #333;
  }

  .selected-chat-name {
    color: #fff;
  }

  .message-input {
    width: 100%;
    background-color: #f9f9f9;
    border-radius: 8px;
    padding: 12px;
    margin-bottom: 15px;
    font-size: 16px;
    color: #333;
    min-height: 100px;
    border: 1px solid #ddd;
    resize: vertical;
  }

  .attach-button {
    background-color: #075E54;
    padding: 12px;
    border-radius: 8px;
    color: #fff;
    font-size: 16px;
    font-weight: bold;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border: none;
    margin-bottom: 15px;
  }

  .attach-button svg {
    margin-right: 8px;
  }

  .selected-documents-container {
    margin-bottom: 15px;
  }

  .document-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    background-color: #f9f9f9;
    border-radius: 8px;
    margin-bottom: 8px;
  }

  .document-name {
    font-size: 14px;
    color: #333;
    flex: 1;
    margin-right: 10px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .remove-button {
    background: none;
    border: none;
    padding: 5px;
    cursor: pointer;
  }

  .datetime-container {
    display: flex;
    gap: 15px;
    margin-bottom: 15px;
  }

  .datetime-group {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .datetime-label {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
    font-weight: bold;
  }

  .date-picker-input,
  .time-picker-input {
    width: 100%;
    padding: 12px;
    border-radius: 8px;
    border: 1px solid #ddd;
    background-color: #f9f9f9;
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

  .cancel-button {
    flex: 1;
    background-color: #f9f9f9;
    padding: 15px;
    border-radius: 8px;
    text-align: center;
    margin-right: 10px;
    font-size: 16px;
    font-weight: bold;
    color: #333;
    border: none;
    cursor: pointer;
  }

  .update-button {
    flex: 1;
    background-color: #075E54;
    padding: 15px;
    border-radius: 8px;
    text-align: center;
    font-size: 16px;
    font-weight: bold;
    color: #fff;
    border: none;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .update-button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

// Inject styles
const styleElement = document.createElement('style');
styleElement.textContent = styles;
document.head.appendChild(styleElement);

export default ViewScheduledMessages;