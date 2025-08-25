// import React, { useEffect, useState, useCallback } from 'react';
// import './Notifications.css';
// import {
//   fetchAllNotifications,
//   markNotificationAsRead,
//   fetchUnreadNotifications,
// } from '../../API/notifications';
// import Sidebar from "../Sidebar/Sidebar";
// import API_URL from '../../Config';

// const getUserIdFromLocalStorage = () => {
//   const userId = localStorage.getItem("userId");
//   console.log("Retrieved USER_ID from localStorage: ", userId);
//   return userId || '';
// };

// const getTimeAgo = (date) => {
//   const now = new Date();
//   const past = new Date(date);
//   const diffInSeconds = Math.floor((now - past) / 1000);

//   const intervals = [
//     { label: 'year', seconds: 31536000 },
//     { label: 'month', seconds: 2592000 },
//     { label: 'week', seconds: 604800 },
//     { label: 'day', seconds: 86400 },
//     { label: 'hour', seconds: 3600 },
//     { label: 'minute', seconds: 60 },
//     { label: 'second', seconds: 1 },
//   ];

//   for (const interval of intervals) {
//     const count = Math.floor(diffInSeconds / interval.seconds);
//     if (count > 0) {
//       return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
//     }
//   }

//   return 'just now';
// };

// const Notifications = () => {
//   const [notifications, setNotifications] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [unreadCount, setUnreadCount] = useState(0);

//   const USER_ID = getUserIdFromLocalStorage();

//   const loadNotifications = useCallback(async () => {
//     setLoading(true);
//     try {
//       if (!USER_ID) {
//         console.error("No USER_ID found in localStorage");
//         setLoading(false);
//         return;
//       }

//       const data = await fetchAllNotifications(USER_ID);
//       console.log("Fetched notifications:", data);
//       setNotifications(data);

//       await Promise.all(data.map(n => markNotificationAsRead(n._id)));

//       const unread = await fetchUnreadNotifications(USER_ID);
//       setUnreadCount(unread.length);
//     } catch (error) {
//       console.error("Error loading notifications:", error);
//     }
//     setLoading(false);
//   }, [USER_ID]);

//   useEffect(() => {
//     loadNotifications();
//   }, [loadNotifications]);

//   const renderNotification = (notification) => {
//     const notificationImage = notification.image1 || notification.image2;
//     const imageUrl = notificationImage ? `${API_URL}${notificationImage}` : '/default-avatar.png';
//     const isUnread = !notification.isRead;

//     return (
//       <div
//         className={`notification-card ${isUnread ? 'new' : 'old'}`}
//         key={notification._id}
//       >
//         <Sidebar />
//         <img
//           src={imageUrl}
//           alt="profile"
//           className="notification-img"
//         />
//         <div className="notification-content">
//           <div className="notification-title">{notification.actor?.name || 'Someone'}</div>
//           <div className="notification-text">{notification.content}</div>
//           <div className="notification-time">{getTimeAgo(notification.createdAt)}</div>
//         </div>
//         {isUnread && <div className="unread-dot" />}
//       </div>
//     );
//   };

//   if (loading) {
//     return <div className="center-text">Loading notifications...</div>;
//   }

//   if (notifications.length === 0) {
//     return <div className="center-text">No notifications yet</div>;
//   }

//   const unread = notifications.filter(n => !n.isRead);
//   const read = notifications.filter(n => n.isRead);

//   return (
//     <div className="notification-container">
//       <div className="noti-header">
//         <h1>Notifications</h1>
//         <input
//           type="text"
//           placeholder="Search here..."
//           className="search-inputnoti"
//           onChange={(e) => {
//             // Optionally, handle search input here
//           }}
//         />
//       </div>

//       <div className="unread-count">Unread Notifications: {unreadCount}</div>

//       {unread.length > 0 && (
//         <>
//           <div className="section-title">New Notifications</div>
//           {unread.map(renderNotification)}
//         </>
//       )}

//       {read.length > 0 && (
//         <>
//           <div className="section-title">Earlier Notifications</div>
//           {read.map(renderNotification)}
//         </>
//       )}
//     </div>
//   );
// };

// export default Notifications;
import React, { useEffect, useState, useCallback } from 'react';
import './Notifications.css';
import Sidebar from "../Sidebar/Sidebar";
import API_URL from '../../Config';

const getUserIdFromLocalStorage = () => {
  const userId = localStorage.getItem("userId");
  return userId || '';
};

const getTimeAgo = (date) => {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now - past) / 1000);

  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
    { label: 'second', seconds: 1 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(diffInSeconds / interval.seconds);
    if (count > 0) {
      return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
    }
  }

  return 'just now';
};

// API call functions
const fetchAllNotifications = async (userId) => {
  const response = await fetch(`${API_URL}api/notifications/getNotifications/${userId}`);
  if (!response.ok) throw new Error('Failed to fetch notifications');
  return await response.json();
};

const fetchUnreadNotifications = async (userId) => {
  const response = await fetch(`${API_URL}api/notifications/getUnreadNotifications/${userId}`);
  if (!response.ok) throw new Error('Failed to fetch unread notifications');
  return await response.json();
};

const markNotificationAsRead = async (notificationId) => {
  const response = await fetch(`${API_URL}api/notifications/markAsRead/${notificationId}`, {
    method: 'PUT'
  });
  if (!response.ok) throw new Error('Failed to mark as read');
  return await response.json();
};

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const USER_ID = getUserIdFromLocalStorage();

  const loadNotifications = useCallback(async () => {
    setLoading(true);
    try {
      if (!USER_ID) {
        console.error("No USER_ID found in localStorage");
        setLoading(false);
        return;
      }

      // Fetch all notifications
      const allNotifications = await fetchAllNotifications(USER_ID);
      setNotifications(allNotifications);

      // Fetch and count unread notifications
      const unreadNotifications = await fetchUnreadNotifications(USER_ID);
      setUnreadCount(unreadNotifications.length);

      // Mark all as read (if you want this behavior)
      await markNotificationAsRead(USER_ID);

    } catch (error) {
      console.error("Error loading notifications:", error);
    } finally {
      setLoading(false);
    }
  }, [USER_ID]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const renderNotification = (notification) => {
    const notificationImage = notification.image1 || notification.image2;
    const imageUrl = notificationImage
      ? `${API_URL}${notificationImage}`
      : '/default-avatar.png';

    return (
      <div
        className={`notification-card ${!notification.isRead ? 'new' : 'old'}`}
        key={notification._id}
      >
        <img
          src={imageUrl}
          alt="profile"
          className="notification-img"
        />
        <div className="notification-content">
          <div className="notification-title">{notification.actor?.name || 'Someone'}</div>
          <div className="notification-text">{notification.content}</div>
          <div className="notification-time">{getTimeAgo(notification.createdAt)}</div>
        </div>
        {!notification.isRead && <div className="unread-dot" />}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="app-container">
        <Sidebar />
        <div className="center-text">Loading notifications...</div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Sidebar />
      <div className="notification-container">
        <div className="noti-header">
          <h1>Notifications</h1>
          <input
            type="text"
            placeholder="Search here..."
            className="search-inputnoti"
          />
        </div>

        <div className="unread-count">Unread Notifications: {unreadCount}</div>

        {notifications.length === 0 ? (
          <div className="center-text">No notifications yet</div>
        ) : (
          <>
            {notifications.filter(n => !n.isRead).length > 0 && (
              <>
                <div className="section-title">New Notifications</div>
                {notifications.filter(n => !n.isRead).map(renderNotification)}
              </>
            )}

            {notifications.filter(n => n.isRead).length > 0 && (
              <>
                <div className="section-title">Earlier Notifications</div>
                {notifications.filter(n => n.isRead).map(renderNotification)}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Notifications;