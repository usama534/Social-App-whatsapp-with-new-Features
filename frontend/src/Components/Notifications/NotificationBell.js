// Components/Notifications/NotificationBell.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBell, FaTimes } from 'react-icons/fa';
import { useNotifications } from '../../API/NotificationContext';
import API_URL from '../../Config';
import axios from 'axios';
import LoadingSpinner from '../Common/LoadingSpinner';

const NotificationBell = () => {
    const {
        notificationCount,
        setNotificationCount,
        unreadNotifications,
        setUnreadNotifications
    } = useNotifications();
    useEffect(() => {
        // Initial fetch
        fetchNotifications();

        // Set up periodic refresh (every 2 minutes)
        const interval = setInterval(fetchNotifications, 120000);

        return () => clearInterval(interval);
    }, [userId]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');

    const fetchNotifications = async () => {
        if (!userId) return;

        try {
            setLoading(true);
            setError(null);

            const response = await axios.get(
                `${API_URL}api/chat/pendingConfirmations/${userId}`
            );

            setUnreadNotifications(response.data);
            setNotificationCount(response.data.length);

        } catch (err) {
            console.error('Failed to fetch notifications:', err);
            setError('Failed to load notifications');
        } finally {
            setLoading(false);
        }
    };

    const toggleDropdown = () => {
        if (!showDropdown) {
            fetchNotifications();
        }
        setShowDropdown(!showDropdown);
    };

    const handleViewAll = () => {
        navigate('/pending-confirmations');
        setShowDropdown(false);
    };

    const handleNotificationClick = (messageId) => {
        navigate(`/pending-confirmations?highlight=${messageId}`);
        setShowDropdown(false);
        // Mark as read logic could go here
    };

    return (
        <div className="notification-bell-container">
            <div
                className={`bell-icon ${notificationCount > 0 ? 'has-notifications' : ''}`}
                onClick={toggleDropdown}
                aria-label="Notifications"
            >
                <FaBell size={20} />
                {notificationCount > 0 && (
                    <span className="notification-count">
                        {notificationCount > 9 ? '9+' : notificationCount}
                    </span>
                )}
            </div>

            {showDropdown && (
                <div className="notification-dropdown">
                    <div className="dropdown-header">
                        <h3>Pending Confirmations</h3>
                        <button
                            onClick={toggleDropdown}
                            className="close-button"
                            aria-label="Close notifications"
                        >
                            <FaTimes size={16} />
                        </button>
                    </div>

                    {loading ? (
                        <div className="loading-notifications">
                            <LoadingSpinner size={30} />
                        </div>
                    ) : error ? (
                        <div className="error-notifications">
                            {error}
                        </div>
                    ) : unreadNotifications.length > 0 ? (
                        <>
                            <div className="notification-list">
                                {unreadNotifications.slice(0, 5).map((message) => (
                                    <div
                                        key={message._id}
                                        className="notification-item"
                                        onClick={() => handleNotificationClick(message._id)}
                                    >
                                        <p className="notification-text">
                                            {message.message?.content?.substring(0, 50) || 'Pending message'}...
                                        </p>
                                        <small className="notification-time">
                                            Scheduled: {new Date(message.pushTime).toLocaleString()}
                                        </small>
                                    </div>
                                ))}
                            </div>
                            <div className="dropdown-footer">
                                <button
                                    onClick={handleViewAll}
                                    className="view-all-button"
                                >
                                    View All ({notificationCount})
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="no-notifications">
                            No pending confirmations
                        </div>
                    )}
                </div>
            )}

            <style jsx>{`
        .notification-bell-container {
          position: relative;
          margin-left: 1rem;
        }

        .bell-icon {
          position: relative;
          cursor: pointer;
          color: #f5f5f5;
          padding: 0.5rem;
          transition: all 0.2s ease;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .bell-icon:hover {
          background-color: rgba(0, 0, 0, 0.05);
        }

        .bell-icon.has-notifications {
          color: #FF9800;
        }

        .notification-count {
          position: absolute;
          top: -5px;
          right: -5px;
          background-color: #FF5722;
          color: white;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.7rem;
          font-weight: bold;
        }

        .notification-dropdown {
          position: absolute;
          right: 0;
          top: 100%;
          width: 350px;
          max-height: 70vh;
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          z-index: 1000;
          display: flex;
          flex-direction: column;
          margin-top: 0.5rem;
        }

        .dropdown-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          border-bottom: 1px solid #eee;
        }

        .dropdown-header h3 {
          margin: 0;
          font-size: 1rem;
          color: #333;
        }

        .close-button {
          background: none;
          border: none;
          cursor: pointer;
          color: #666;
          padding: 0.25rem;
        }

        .notification-list {
          flex: 1;
          overflow-y: auto;
        }

        .notification-item {
          padding: 0.75rem 1rem;
          border-bottom: 1px solid #f5f5f5;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .notification-item:hover {
          background-color: #f9f9f9;
        }

        .notification-text {
          margin: 0 0 0.25rem 0;
          color: #333;
          font-size: 0.9rem;
          line-height: 1.4;
        }

        .notification-time {
          color: #999;
          font-size: 0.75rem;
        }

        .dropdown-footer {
          padding: 0.75rem;
          border-top: 1px solid #eee;
          text-align: center;
        }

        .view-all-button {
          background: none;
          border: none;
          color: #FF9800;
          font-weight: bold;
          cursor: pointer;
          font-size: 0.9rem;
          padding: 0.5rem 1rem;
        }

        .loading-notifications,
        .error-notifications,
        .no-notifications {
          padding: 2rem;
          text-align: center;
          color: #999;
        }

        .error-notifications {
          color: #F44336;
        }

        @media (max-width: 768px) {
          .notification-dropdown {
            width: 300px;
            right: -50px;
          }
        }
      `}</style>
        </div>
    );
};

export default NotificationBell;