import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../../Config';
import { FaArrowLeft, FaCheck, FaTimes, FaUsers } from 'react-icons/fa';
import IMG_URL from '../../imagurl';

const GroupJoinRequests = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { groupId } = location.state || {};

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const fetchPendingRequests = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_URL}api/postgroup/getPendingRequests/${groupId}`
      );
      setRequests(response.data);
    } catch (error) {
      console.error('Error fetching pending requests:', error);
      alert('Failed to fetch pending requests');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveRequest = async (requestId) => {
    try {
      setProcessing(true);
      await axios.post(`${API_URL}api/postgroup/approveRequest/${requestId}`);
      alert('Request approved successfully');
      fetchPendingRequests(); // Refresh the list
    } catch (error) {
      console.error('Error approving request:', error);
      alert('Failed to approve request');
    } finally {
      setProcessing(false);
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      setProcessing(true);
      await axios.post(`${API_URL}api/postgroup/rejectRequest/${requestId}`);
      alert('Request rejected successfully');
      fetchPendingRequests(); // Refresh the list
    } catch (error) {
      console.error('Error rejecting request:', error);
      alert('Failed to reject request');
    } finally {
      setProcessing(false);
    }
  };

  useEffect(() => {
    if (groupId) {
      fetchPendingRequests();
    }
  }, [groupId]);

  const renderRequestItem = (item) => (
    <div key={item._id} className="requestItem">
      <div className="userInfo">
        <img
          src={
            item.user?.imgUrl
              ? `${IMG_URL}${item.user.imgUrl}`
              : 'https://via.placeholder.com/40'
          }
          alt={item.user?.name || 'User'}
          className="userAvatar"
        />
        <div className="userName">{item.user?.name || 'Unknown User'}</div>
      </div>
      <div className="actionsContainer">
        <button
          className={`actionButton approveButton ${processing ? 'disabled' : ''}`}
          onClick={() => handleApproveRequest(item._id)}
          disabled={processing}
        >
          <FaCheck />
        </button>
        <button
          className={`actionButton rejectButton ${processing ? 'disabled' : ''}`}
          onClick={() => handleRejectRequest(item._id)}
          disabled={processing}
        >
          <FaTimes />
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="loadingContainer">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="header">
        <button onClick={() => navigate(-1)} className="backButton">
          <FaArrowLeft />
        </button>
        <h2 className="headerTitle">Pending Join Requests</h2>
        <div style={{ width: 24 }}></div>
      </div>

      {requests.length === 0 ? (
        <div className="emptyContainer">
          <FaUsers size={60} color="#ccc" />
          <div className="emptyText">No pending requests</div>
        </div>
      ) : (
        <div className="listContainer">
          {requests.map(renderRequestItem)}
        </div>
      )}

      <style jsx>{`
        .container {
          background-color: #fff;
          min-height: 100vh;
        }
        
        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 15px;
          border-bottom: 1px solid #eee;
        }
        
        .backButton {
          background: none;
          border: none;
          font-size: 20px;
          cursor: pointer;
          color: #333;
        }
        
        .headerTitle {
          font-size: 18px;
          font-weight: bold;
          color: #333;
          margin: 0;
        }
        
        .loadingContainer {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
        }
        
        .spinner {
          border: 4px solid rgba(20, 174, 92, 0.2);
          border-top: 4px solid #14AE5C;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .listContainer {
          padding: 15px;
        }
        
        .requestItem {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 15px;
          background-color: #f9f9f9;
          border-radius: 10px;
          margin-bottom: 10px;
        }
        
        .userInfo {
          display: flex;
          align-items: center;
          flex: 1;
        }
        
        .userAvatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          margin-right: 10px;
          object-fit: cover;
        }
        
        .userName {
          font-size: 16px;
          color: #333;
        }
        
        .actionsContainer {
          display: flex;
        }
        
        .actionButton {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          border: none;
          cursor: pointer;
          margin-left: 10px;
          transition: opacity 0.2s;
        }
        
        .actionButton:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .approveButton {
          background-color: #14AE5C;
          color: white;
        }
        
        .approveButton:hover:not(:disabled) {
          background-color: #0e8c4a;
        }
        
        .rejectButton {
          background-color: #ff4444;
          color: white;
        }
        
        .rejectButton:hover:not(:disabled) {
          background-color: #cc0000;
        }
        
        .emptyContainer {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 60vh;
        }
        
        .emptyText {
          font-size: 16px;
          color: #666;
          margin-top: 10px;
        }
      `}</style>
    </div>
  );
};

export default GroupJoinRequests;