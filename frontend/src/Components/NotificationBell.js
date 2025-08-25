import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBell } from 'react-icons/fa';
import { io } from 'socket.io-client';
import API_URL from '../Config';
import axios from 'axios';

const NotificationBell = () => {
    const navigate = useNavigate();
    const [pendingCount, setPendingCount] = useState(0);
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    // useEffect(() => {
    //     // Initialize socket connection with authentication
    //     const userId = localStorage.getItem('userId');
    //     if (!userId) {
    //         console.error('No userId found in localStorage');
    //         return;
    //     }

    //     const newSocket = io(API_URL, {
    //         query: { userId },
    //         reconnectionAttempts: 5,
    //         reconnectionDelay: 1000,
    //     });

    //     setSocket(newSocket);

    //     // Connection events
    //     newSocket.on('connect', () => {
    //         console.log('Socket connected');
    //         setIsConnected(true);

    //         // Request initial pending count on connection
    //         newSocket.emit('getPendingCount', { userId });
    //     });

    //     newSocket.on('disconnect', () => {
    //         console.log('Socket disconnected');
    //         setIsConnected(false);
    //     });

    //     newSocket.on('connect_error', (err) => {
    //         console.error('Socket connection error:', err);
    //     });

    //     // Listen for pending confirmation updates
    //     newSocket.on('pendingConfirmations', (count) => {
    //         console.log('Received pending confirmations:', count);
    //         setPendingCount(count); // Replace with new count rather than adding
    //     });

    //     // Initial cleanup
    //     return () => {
    //         newSocket.off('connect');
    //         newSocket.off('disconnect');
    //         newSocket.off('connect_error');
    //         newSocket.off('pendingConfirmations');
    //         newSocket.disconnect();
    //     };
    // }, []);
    // Update the useEffect in NotificationBell
    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (!userId) return;

        const newSocket = io(API_URL, {
            query: { uid: userId }, // Match the backend parameter name
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        // Listen for backend notifications
        newSocket.on('updates', (count) => {
            setPendingCount(prev => prev + count); // Increment count
        });

        // Initial fetch of pending count
        const fetchPendingCount = async () => {
            try {
                const response = await axios.get(
                    `${API_URL}api/chat/getPendingConfirmation/${userId}`
                );
                setPendingCount(response.data.length);
            } catch (error) {
                console.error('Failed to fetch pending count:', error);
            }
        };

        fetchPendingCount();

        return () => {
            newSocket.disconnect();
        };
    }, []);

    const handleBellClick = () => {
        navigate('/PendingConfirmationScreen');
        // Don't reset count here - let the screen fetch actual count
    };

    return (
        <div className="notification-bell-container" onClick={handleBellClick}>
            <FaBell size={24} color={pendingCount > 0 ? '#FF9800' : '#666'} />
            {pendingCount > 0 && (
                <span className="notification-badge">{pendingCount}</span>
            )}
            {!isConnected && (
                <span className="connection-dot"></span>
            )}

            <style jsx>{`
                .notification-bell-container {
                    position: fixed;
                    bottom: 30px;
                    right: 30px;
                    background: white;
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                    cursor: pointer;
                    z-index: 1000;
                }

                .notification-badge {
                    position: absolute;
                    top: -5px;
                    right: -5px;
                    background: #F44336;
                    color: white;
                    border-radius: 50%;
                    width: 20px;
                    height: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 12px;
                    font-weight: bold;
                }

                .connection-dot {
                    position: absolute;
                    bottom: 0;
                    right: 0;
                    width: 10px;
                    height: 10px;
                    background-color: red;
                    border-radius: 50%;
                }
            `}</style>
        </div>
    );
};

export default NotificationBell;