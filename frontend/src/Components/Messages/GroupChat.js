import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft, MoreVertical, Send, Users, Settings,
    UserPlus, UserMinus, Crown, X
} from 'lucide-react';
import axios from 'axios';
import API_URL from '../../Config';

const GroupChat = () => {
    const { groupId } = useParams();
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');

    const [group, setGroup] = useState(null);
    const [messages, setMessages] = useState([]);
    const [members, setMembers] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState({
        group: true,
        messages: true,
        members: true
    });
    const [error, setError] = useState('');
    const [showMembers, setShowMembers] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

    // Fetch all group data
    useEffect(() => {
        const fetchGroupData = async () => {
            try {
                setLoading({ group: true, messages: true, members: true });
                setError('');

                const [groupRes, messagesRes, membersRes, adminsRes] = await Promise.all([
                    axios.get(`${API_URL}api/chatgroup/getGroupByChatId/${groupId}`),
                    axios.get(`${API_URL}api/chatgroup/getGroupChat/${groupId}/${userId}`),
                    axios.get(`${API_URL}api/chatgroup/getMembers/${groupId}`),
                    axios.get(`${API_URL}api/chatgroup/getAdmins/${groupId}`)
                ]);

                if (!groupRes.data) {
                    throw new Error('Group not found');
                }

                setGroup(groupRes.data);
                setMessages(messagesRes.data?.messages || []);
                setMembers(membersRes.data || []);
                setAdmins(adminsRes.data || []);
            } catch (err) {
                console.error('Error fetching group data:', err);
                setError(err.response?.data?.message || err.message || 'Failed to load group chat');
            } finally {
                setLoading({ group: false, messages: false, members: false });
            }
        };

        fetchGroupData();
    }, [groupId, userId]);

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;

        try {
            const response = await axios.post(
                `${API_URL}api/chatgroup/${groupId}/messages`,
                { text: newMessage, sender: userId }
            );

            setMessages(prev => [...prev, response.data]);
            setNewMessage('');
        } catch (err) {
            console.error('Error sending message:', err);
            setError(err.response?.data?.message || 'Failed to send message');
        }
    };

    const handleAddAdmin = async (memberId) => {
        try {
            await axios.post(`${API_URL}api/chatgroup/addGroupAdmins/${groupId}`, {
                admins: [memberId]
            });
            setAdmins(prev => [...prev, memberId]);
        } catch (err) {
            console.error('Error adding admin:', err);
            setError(err.response?.data?.message || 'Failed to add admin');
        }
    };

    const handleRemoveAdmin = async (adminId) => {
        try {
            await axios.post(`${API_URL}api/chatgroup/removeAdmin/${groupId}/${adminId}`);
            setAdmins(prev => prev.filter(id => id !== adminId));
        } catch (err) {
            console.error('Error removing admin:', err);
            setError(err.response?.data?.message || 'Failed to remove admin');
        }
    };

    const handleRemoveMember = async (memberId) => {
        try {
            await axios.put(`${API_URL}api/chatgroup/removeMember/${groupId}/${memberId}`);
            setMembers(prev => prev.filter(m => m._id !== memberId));
            setAdmins(prev => prev.filter(id => id !== memberId));
        } catch (err) {
            console.error('Error removing member:', err);
            setError(err.response?.data?.message || 'Failed to remove member');
        }
    };

    const updateGroupSettings = async (updates) => {
        try {
            await axios.put(`${API_URL}api/chatgroup/updateGroup/${groupId}`, updates);
            setGroup(prev => ({ ...prev, ...updates }));
        } catch (err) {
            console.error('Error updating group:', err);
            setError(err.response?.data?.message || 'Failed to update group');
        }
    };

    if (loading.group) return (
        <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading group...</p>
        </div>
    );

    if (error) return (
        <div className="error-container">
            <p>{error}</p>
            <button onClick={() => navigate(-1)}>Go Back</button>
        </div>
    );

    if (!group) return (
        <div className="not-found-container">
            <p>Group not found</p>
            <button onClick={() => navigate(-1)}>Go Back</button>
        </div>
    );

    const isAdmin = admins.includes(userId);
    const isCurrentUser = (id) => id === userId;

    return (
        <div className="group-chat-container">
            {/* Header */}
            <header className="chat-header">
                <button onClick={() => navigate(-1)} className="back-button">
                    <ArrowLeft size={24} />
                </button>

                <div className="group-info">
                    {group.group_avatar ? (
                        <img
                            src={group.group_avatar}
                            alt={group.name}
                            className="group-avatar"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '';
                                e.target.className = 'avatar-fallback';
                                e.target.textContent = group.name.charAt(0).toUpperCase();
                            }}
                        />
                    ) : (
                        <div className="avatar-fallback">
                            {group.name.charAt(0).toUpperCase()}
                        </div>
                    )}
                    <h2>{group.name}</h2>
                </div>

                <div className="header-actions">
                    <button
                        onClick={() => setShowMembers(!showMembers)}
                        className={`icon-button ${showMembers ? 'active' : ''}`}
                        aria-label="Show members"
                    >
                        <Users size={24} />
                    </button>
                    <button
                        onClick={() => setShowSettings(!showSettings)}
                        className={`icon-button ${showSettings ? 'active' : ''}`}
                        aria-label="Show settings"
                    >
                        <Settings size={24} />
                    </button>
                </div>
            </header>

            {/* Members Panel */}
            {showMembers && (
                <div className="panel members-panel">
                    <div className="panel-header">
                        <h3>Group Members</h3>
                        <button onClick={() => setShowMembers(false)} className="close-panel">
                            <X size={20} />
                        </button>
                    </div>
                    <div className="members-list">
                        {members.length > 0 ? (
                            members.map(member => (
                                <div key={member._id} className="member-item">
                                    <div className="member-avatar">
                                        {member.profilePic ? (
                                            <img
                                                src={member.profilePic}
                                                alt={member.name}
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = '';
                                                    e.target.parentNode.textContent = member.name.charAt(0).toUpperCase();
                                                }}
                                            />
                                        ) : (
                                            member.name.charAt(0).toUpperCase()
                                        )}
                                    </div>
                                    <div className="member-details">
                                        <span className="member-name">{member.name}</span>
                                        {admins.includes(member._id) && (
                                            <span className="admin-badge">
                                                <Crown size={16} /> Admin
                                            </span>
                                        )}
                                    </div>

                                    {isAdmin && !isCurrentUser(member._id) && (
                                        <div className="member-actions">
                                            {admins.includes(member._id) ? (
                                                <button
                                                    onClick={() => handleRemoveAdmin(member._id)}
                                                    className="action-button danger"
                                                >
                                                    <UserMinus size={16} /> Remove Admin
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleAddAdmin(member._id)}
                                                    className="action-button"
                                                >
                                                    <UserPlus size={16} /> Make Admin
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleRemoveMember(member._id)}
                                                className="action-button danger"
                                            >
                                                <UserMinus size={16} /> Remove
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="empty-state">No members found</div>
                        )}
                    </div>
                </div>
            )}

            {/* Settings Panel */}
            {showSettings && (
                <div className="panel settings-panel">
                    <div className="panel-header">
                        <h3>Group Settings</h3>
                        <button onClick={() => setShowSettings(false)} className="close-panel">
                            <X size={20} />
                        </button>
                    </div>
                    <div className="settings-form">
                        <div className="form-group">
                            <label>Group Name</label>
                            <input
                                type="text"
                                value={group.name}
                                onChange={(e) => updateGroupSettings({ name: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Description</label>
                            <textarea
                                value={group.aboutGroup || ''}
                                onChange={(e) => updateGroupSettings({ aboutGroup: e.target.value })}
                                rows="4"
                            />
                        </div>
                        {isAdmin && (
                            <div className="form-group">
                                <label>Group Avatar URL</label>
                                <input
                                    type="text"
                                    value={group.group_avatar || ''}
                                    onChange={(e) => updateGroupSettings({ group_avatar: e.target.value })}
                                    placeholder="Enter image URL"
                                />
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Messages */}
            <div className="messages-container">
                {messages.length > 0 ? (
                    messages.map(message => (
                        <div
                            key={message._id}
                            className={`message ${message.sender === userId ? 'sent' : 'received'}`}
                        >
                            <div className="message-content">
                                {message.text}
                            </div>
                            <div className="message-meta">
                                <span className="message-time">
                                    {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-messages">
                        No messages yet. Start the conversation!
                    </div>
                )}
            </div>

            {/* Message Input */}
            <div className="message-input-container">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="send-button"
                    aria-label="Send message"
                >
                    <Send size={20} />
                </button>
            </div>

            <style jsx>{`
        .group-chat-container {
          display: flex;
          flex-direction: column;
          height: 100vh;
          background-color: #f8f9fa;
          position: relative;
        }
        
        .chat-header {
          display: flex;
          align-items: center;
          padding: 12px 16px;
          background-color: white;
          border-bottom: 1px solid #e9ecef;
          z-index: 10;
        }
        
        .back-button {
          background: none;
          border: none;
          cursor: pointer;
          margin-right: 12px;
          color: #495057;
        }
        
        .group-info {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 0;
        }
        
        .group-avatar, .avatar-fallback {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
          background-color: #14AE5C;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 18px;
          flex-shrink: 0;
        }
        
        .group-info h2 {
          margin: 0;
          font-size: 1.1rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .header-actions {
          display: flex;
          gap: 12px;
          margin-left: 12px;
        }
        
        .icon-button {
          background: none;
          border: none;
          cursor: pointer;
          color: #495057;
          padding: 4px;
          border-radius: 50%;
          transition: background-color 0.2s;
        }
        
        .icon-button:hover {
          background-color: #e9ecef;
        }
        
        .icon-button.active {
          color: #14AE5C;
        }
        
        .panel {
          position: absolute;
          top: 60px;
          right: 0;
          width: 300px;
          height: calc(100% - 60px);
          background-color: white;
          border-left: 1px solid #e9ecef;
          z-index: 20;
          box-shadow: -2px 0 8px rgba(0,0,0,0.1);
          display: flex;
          flex-direction: column;
        }
        
        .panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          border-bottom: 1px solid #e9ecef;
        }
        
        .panel-header h3 {
          margin: 0;
          font-size: 1.1rem;
        }
        
        .close-panel {
          background: none;
          border: none;
          cursor: pointer;
          color: #6c757d;
          padding: 4px;
        }
        
        .members-list, .settings-form {
          flex: 1;
          overflow-y: auto;
          padding: 0 16px;
        }
        
        .member-item {
          display: flex;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid #f1f3f5;
        }
        
        .member-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background-color: #e9ecef;
          color: #495057;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 12px;
          font-weight: bold;
          flex-shrink: 0;
        }
        
        .member-avatar img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
        }
        
        .member-details {
          flex: 1;
          min-width: 0;
        }
        
        .member-name {
          display: block;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-weight: 500;
        }
        
        .admin-badge {
          display: flex;
          align-items: center;
          gap: 4px;
          color: #ff9800;
          font-size: 0.75rem;
          margin-top: 2px;
        }
        
        .member-actions {
          display: flex;
          gap: 8px;
          margin-left: 8px;
        }
        
        .action-button {
          display: flex;
          align-items: center;
          gap: 4px;
          background: none;
          border: 1px solid #e9ecef;
          border-radius: 4px;
          padding: 4px 8px;
          font-size: 0.75rem;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .action-button:hover {
          background-color: #f8f9fa;
        }
        
        .action-button.danger {
          color: #dc3545;
          border-color: #f5c6cb;
        }
        
        .action-button.danger:hover {
          background-color: #f8d7da;
        }
        
        .settings-form {
          padding: 16px;
        }
        
        .form-group {
          margin-bottom: 16px;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 6px;
          font-size: 0.9rem;
          color: #495057;
          font-weight: 500;
        }
        
        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #ced4da;
          border-radius: 4px;
          font-size: 0.9rem;
        }
        
        .form-group textarea {
          resize: vertical;
          min-height: 100px;
        }
        
        .messages-container {
          flex: 1;
          padding: 16px;
          overflow-y: auto;
          background-color: #f1f3f5;
        }
        
        .message {
          max-width: 75%;
          margin-bottom: 12px;
          padding: 8px 12px;
          border-radius: 12px;
          position: relative;
        }
        
        .message.sent {
          background-color: #dcf8c6;
          margin-left: auto;
          border-bottom-right-radius: 4px;
        }
        
        .message.received {
          background-color: white;
          margin-right: auto;
          border-bottom-left-radius: 4px;
        }
        
        .message-content {
          word-wrap: break-word;
        }
        
        .message-meta {
          display: flex;
          justify-content: flex-end;
          margin-top: 4px;
        }
        
        .message-time {
          font-size: 0.7rem;
          color: #6c757d;
        }
        
        .no-messages {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          color: #6c757d;
        }
        
        .message-input-container {
          display: flex;
          padding: 12px 16px;
          background-color: white;
          border-top: 1px solid #e9ecef;
        }
        
        .message-input-container input {
          flex: 1;
          padding: 10px 16px;
          border: 1px solid #ced4da;
          border-radius: 20px;
          outline: none;
          font-size: 0.9rem;
        }
        
        .send-button {
          background: none;
          border: none;
          margin-left: 12px;
          cursor: pointer;
          color: #14AE5C;
          padding: 0 8px;
        }
        
        .send-button:disabled {
          color: #adb5bd;
          cursor: not-allowed;
        }
        
        .loading-container, .error-container, .not-found-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          padding: 20px;
          text-align: center;
        }
        
        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f1f3f5;
          border-top: 4px solid #14AE5C;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 16px;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .error-container p, .not-found-container p {
          color: #dc3545;
          margin-bottom: 16px;
        }
        
        .error-container button, .not-found-container button {
          padding: 8px 16px;
          background-color: #14AE5C;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        
        .empty-state {
          text-align: center;
          padding: 20px;
          color: #6c757d;
        }
      `}</style>
        </div>
    );
};

export default GroupChat;