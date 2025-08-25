import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  FaEdit,
  FaCheckCircle,
  FaTrash,
  FaCalendarAlt,
  FaClock,
  FaPaperclip,
  FaTimes,
  FaPlus,
  FaCheck,
  FaTrashAlt,
  FaExclamationTriangle,
  FaClock as FaSchedule
} from 'react-icons/fa';
import API_URL from '../../Config';
import Sidebar from '../Sidebar/Sidebar';
import { io } from 'socket.io-client';


const PendingConfirmationScreen = () => {
  const navigate = useNavigate();
  const [pendingMessages, setPendingMessages] = useState([]);
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
    const socket = io(API_URL, {
      query: { uid: localStorage.getItem('userId') }
    });

    // Listen for new pending confirmations
    socket.on('updates', () => {
      fetchPendingConfirmationMessages(); // Refresh list
    });

    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    fetchPendingConfirmationMessages();
    fetchChats();
  }, []);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const highlightId = queryParams.get('highlight');

    if (highlightId) {
      // Scroll to and highlight the specific message
      const element = document.getElementById(`message-${highlightId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        element.classList.add('highlighted-message');
        setTimeout(() => {
          element.classList.remove('highlighted-message');
        }, 3000);
      }
    }
  }, []);

  const fetchPendingConfirmationMessages = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}api/chat/getPendingConfirmation/${userId}`);
      console.log('API Response:', response); // Add this line
      console.log('Response Data:', response.data); // And this line
      setPendingMessages(response.data);
    } catch (error) {
      console.error('API Error:', error.response); // Enhanced error logging
      alert('Error: Failed to load pending confirmation messages');
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
      fetchPendingConfirmationMessages();
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
      fetchPendingConfirmationMessages();
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
      fetchPendingConfirmationMessages();
      alert('Success: Message deleted');
    } catch (error) {
      console.error('Failed to delete message:', error);
      alert('Error: Failed to delete message');
    } finally {
      setProcessing(false);
    }
  };

  const openEditModal = (message) => {
    console.log('Edit Pending Message', message);
    setEditingMessage(message);
    setMessageContent(message.message.content || '');
    setExistingAttachments(message.message.attachments || []);
    setSelectedChats(message.chat || []);
    setPushTime(new Date(message.pushTime));
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
    setAttachments([]);
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

  const handleUpdateMessage = async () => {
    if (!messageContent.trim()) {
      alert('Error: Please enter a message.');
      return;
    }

    if (selectedChats.length === 0) {
      alert('Error: Please select at least one chat.');
      return;
    }

    try {
      setProcessing(true);

      const formData = new FormData();

      // Add new files
      attachments.forEach((fileObj) => {
        formData.append('messageAttchments', fileObj.file);
      });

      // Properly format the data
      formData.append('chats', JSON.stringify(selectedChats));
      formData.append('messageContent', messageContent);
      formData.append('pushTime', pushTime.toISOString());
      formData.append('existingAttachments[]', JSON.stringify(existingAttachments));
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

      alert('Success: Message updated successfully!');
      fetchPendingConfirmationMessages();
      closeEditModal();
    } catch (error) {
      console.error('Error updating message:', error);
      alert('Error: Failed to update message.');
    } finally {
      setProcessing(false);
    }
  };

  const handleConfirmAll = async () => {
    if (window.confirm(`Are you sure you want to confirm all ${pendingMessages.length} pending messages for sending?`)) {
      try {
        setProcessing(true);
        const confirmPromises = pendingMessages.map(message =>
          axios.put(`${API_URL}api/chat/confirmScheduledMessage/${message._id}`)
        );
        await Promise.all(confirmPromises);
        fetchPendingConfirmationMessages();
        alert('Success: All messages confirmed for sending');
      } catch (error) {
        console.error('Failed to confirm all messages:', error);
        alert('Error: Failed to confirm some messages');
      } finally {
        setProcessing(false);
      }
    }
  };

  const handleDeleteAll = async () => {
    if (window.confirm(`Are you sure you want to delete all ${pendingMessages.length} pending messages? This action cannot be undone.`)) {
      try {
        setProcessing(true);
        const deletePromises = pendingMessages.map(message =>
          axios.delete(`${API_URL}api/chat/deleteScheduledMessage/${message._id}`)
        );
        await Promise.all(deletePromises);
        fetchPendingConfirmationMessages();
        alert('Success: All messages deleted');
      } catch (error) {
        console.error('Failed to delete all messages:', error);
        alert('Error: Failed to delete some messages');
      } finally {
        setProcessing(false);
      }
    }
  };

  const renderMessage = (item) => {
    const hasAttachments = item.message?.attachments?.length > 0;
    const scheduledTime = moment(item.pushTime).format('MMM D, YYYY h:mm A');
    const isOverdue = moment().isAfter(moment(item.pushTime));

    return (
      <div id={`message-${item._id}`} className={`message-card ${isOverdue ? 'overdue' : ''}`} key={item._id}>
        <div className="message-content">
          {isOverdue && (
            <div className="overdue-indicator">
              <FaExclamationTriangle size={16} color="#FF5722" />
              <span className="overdue-text">Overdue</span>
            </div>
          )}

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

          <p className="status-text pending">
            Status: Pending Confirmation
          </p>
        </div>

        <div className="actions-container">
          <button
            onClick={() => openEditModal(item)}
            disabled={processing}
            className="action-button edit">
            <FaEdit size={20} color="#4CAF50" />
          </button>

          <button
            onClick={() => handleConfirm(item._id)}
            disabled={processing}
            className="action-button confirm">
            <FaCheckCircle size={20} color="#4CAF50" />
          </button>

          <button
            onClick={() => handleDelete(item._id)}
            disabled={processing}
            className="action-button delete">
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
        <p className="loading-text">Loading pending confirmations...</p>
      </div>
    );
  }

  return (
    <div className="pending-confirmation-container">
      <Sidebar />
      {/* Header with bulk actions */}
      {pendingMessages.length > 0 && (
        <div className="header-container">
          <h2 className="header-text">
            {pendingMessages.length} pending confirmation
            {pendingMessages.length > 1 ? 's' : ''}
          </h2>
          <div className="bulk-actions-container">
            <button
              className="bulk-confirm-button"
              onClick={handleConfirmAll}
              disabled={processing}>
              <FaCheck size={18} color="#fff" />
              <span className="bulk-button-text">Confirm All</span>
            </button>
            <button
              className="bulk-delete-button"
              onClick={handleDeleteAll}
              disabled={processing}>
              <FaTrashAlt size={18} color="#fff" />
              <span className="bulk-button-text">Delete All</span>
            </button>
          </div>
        </div>
      )}

      {/* <div className="messages-list">
        {pendingMessages.length > 0 ? (
          pendingMessages.map(item => renderMessage(item))
        : (
          <div className="empty-container">
            <FaSchedule size={64} color="#ccc" />
            <p className="empty-text">No pending confirmations</p>
            <p className="empty-subtext">
              All your scheduled messages are confirmed or there are no
              scheduled messages.
            </p>
          </div>
        )}
      </div> */}
      <div className="messages-list">
        {pendingMessages.length > 0 ? (
          pendingMessages.map(item => (
            <div key={item._id}> {/* Add key here if not in renderMessage */}
              {renderMessage(item)}
            </div>
          ))
        ) : (
          <div className="empty-container">
            <FaSchedule size={64} color="#ccc" />
            <p className="empty-text">No pending confirmations</p>
            <p className="empty-subtext">
              All your scheduled messages are confirmed or there are no
              scheduled messages.
            </p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editModalVisible && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2 className="modal-title">Edit Pending Message</h2>
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
                    className={`chat-item ${selectedChats.includes(item.id) ? 'selected' : ''}`}
                    onClick={() => handleChatSelection(item.id)}>
                    <span className={`chat-name ${selectedChats.includes(item.id) ? 'selected' : ''}`}>
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
                  <FaPaperclip size={20} color="#fff" />
                  <span className="attach-button-text">Attach File</span>
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
                    <FaCalendarAlt size={20} color="#FF9800" />
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
                    <FaClock size={20} color="#FF9800" />
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
                  <div className="button-spinner"></div>
                ) : (
                  'Update Message'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .pending-confirmation-container {
          padding: 20px;
          background-color: #f5f5f5;
          min-height: 100vh;
          margin-left:200px;
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 100vh;
        }

        .spinner {
          border: 4px solid rgba(0, 0, 0, 0.1);
          border-radius: 50%;
          border-top: 4px solid #FF9800;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
        }

        .button-spinner {
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top: 2px solid #fff;
          width: 16px;
          height: 16px;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .loading-text {
          margin-top: 10px;
          font-size: 16px;
          color: #666;
        }

        .header-container {
          background-color: #fff;
          padding: 15px;
          border-bottom: 1px solid #eee;
          margin-bottom: 15px;
        }

        .header-text {
          font-size: 18px;
          font-weight: bold;
          color: #333;
          margin-bottom: 10px;
        }
.highlighted-message {
    animation: highlight 3s ease;
    border-left: 4px solid #FF9800;
}

@keyframes highlight {
    0% { background-color: rgba(255, 152, 0, 0.3); }
    100% { background-color: transparent; }
}
        .bulk-actions-container {
          display: flex;
          gap: 10px;
        }

        .bulk-confirm-button {
          background-color: #4CAF50;
          padding: 10px 20px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex: 1;
          border: none;
          color: white;
          cursor: pointer;
        }

        .bulk-delete-button {
          background-color: #F44336;
          padding: 10px 20px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex: 1;
          border: none;
          color: white;
          cursor: pointer;
        }

        .bulk-button-text {
          margin-left: 5px;
          font-size: 14px;
          font-weight: bold;
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
          border-left: 4px solid #FF9800;
        }

        .message-card.overdue {
          border-left-color: #FF5722;
          background-color: #FFF3E0;
        }

        .overdue-indicator {
          display: flex;
          align-items: center;
          margin-bottom: 8px;
        }

        .overdue-text {
          font-size: 12px;
          color: #FF5722;
          font-weight: bold;
          margin-left: 4px;
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
          font-weight: 500;
        }

        .status-text.pending {
          color: #FF9800;
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
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 40px;
          text-align: center;
        }

        .empty-text {
          font-size: 20px;
          color: #757575;
          margin-top: 20px;
          font-weight: bold;
        }

        .empty-subtext {
          font-size: 16px;
          color: #999;
          margin-top: 10px;
          line-height: 1.5;
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

        .chat-item.selected {
          background-color: #FF9800;
        }

        .chat-name {
          font-size: 16px;
          color: #333;
        }

        .chat-name.selected {
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
          background-color: #FF9800;
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

        .attach-button-text {
          margin-left: 8px;
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
          background-color: #FF9800;
          border-color: #FF9800;
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
          background-color: #FF9800;
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
      `}</style>
    </div>
  );
};

export default PendingConfirmationScreen;