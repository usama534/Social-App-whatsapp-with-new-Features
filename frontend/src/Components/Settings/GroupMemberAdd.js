import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import API_URL from '../../Config';
import IMG_URL from '../../imagurl';

const GroupMemberAdd = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { groupId } = location.state || {};

  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  const searchUsers = async () => {
    if (searchQuery.length < 2) {
      alert('Please enter at least 2 characters to search');
      return;
    }

    setSearchLoading(true);
    try {
      const response = await axios.get(`${API_URL}api/user/getAllUsers`);
      const filteredUsers = response.data.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setUsers(filteredUsers);
    } catch (error) {
      console.error('Search error:', error);
      alert('Failed to search users');
    } finally {
      setSearchLoading(false);
    }
  };

  const addMembersToGroup = async () => {
    if (selectedUsers.length === 0) {
      alert('Please select at least one user');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API_URL}api/postgroup/addMembers/${groupId}`, {
        members: selectedUsers,
      });
      alert('Users added to group successfully');
      navigate(-1); // Go back
    } catch (error) {
      console.error('Add members error:', error);
      alert('Failed to add members to group');
    } finally {
      setLoading(false);
    }
  };

  const toggleUserSelection = userId => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const renderUserItem = (item) => (
    <div
      key={item._id}
      className={`userItem ${selectedUsers.includes(item._id) ? 'selectedUserItem' : ''}`}
      onClick={() => toggleUserSelection(item._id)}
    >
      <div className="userItemContent">
        <img
          src={`${IMG_URL}${item.imgUrl || '/static/avatars/default_group.png'}`}
          alt={item.name}
          className="userProfile"
        />
        <span className="userName">{item.name}</span>
      </div>
      <span className="userType">{item.type}</span>
    </div>
  );

  return (
    <div className="container">
      {/* Search Section */}
      <div className="searchContainer">
        <input
          type="text"
          className="searchInput"
          placeholder="Search users by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && searchUsers()}
        />
        <button
          className="searchButton"
          onClick={searchUsers}
          disabled={searchLoading}
        >
          {searchLoading ? (
            <span className="spinner"></span>
          ) : (
            'Search'
          )}
        </button>
      </div>

      {/* Results Section */}
      {users.length > 0 && (
        <div className="resultsContainer">
          <div className="resultsTitle">Search Results:</div>
          <div className="userList">
            {users.map(user => renderUserItem(user))}
          </div>
        </div>
      )}

      {/* Selected Users Section */}
      {selectedUsers.length > 0 && (
        <div className="selectedContainer">
          <div className="selectedTitle">
            Selected: {selectedUsers.length} user(s)
          </div>
        </div>
      )}

      {/* Add Members Button */}
      <button
        className={`addButton ${selectedUsers.length === 0 ? 'disabledButton' : ''}`}
        onClick={addMembersToGroup}
        disabled={loading || selectedUsers.length === 0}
      >
        {loading ? (
          <span className="spinner"></span>
        ) : (
          'Add Selected Members'
        )}
      </button>

      {/* CSS Styles */}
      <style jsx>{`
        .container {
          padding: 20px;
          background-color: #f5f5f5;
          min-height: 100vh;
        }
        
        .searchContainer {
          display: flex;
          margin-bottom: 20px;
        }
        
        .searchInput {
          flex: 1;
          height: 50px;
          border: 1px solid #ccc;
          border-radius: 8px;
          padding: 0 15px;
          background-color: #fff;
          color: black;
        }
        
        .searchButton {
          margin-left: 10px;
          background-color: green;
          border-radius: 8px;
          padding: 0 15px;
          color: #fff;
          font-weight: bold;
          border: none;
          cursor: pointer;
        }
        
        .resultsContainer {
          margin-bottom: 20px;
        }
        
        .resultsTitle {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 10px;
          color: #555;
        }
        
        .userList {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        
        .userItem {
          padding: 15px;
          border-bottom: 1px solid #eee;
          background-color: #e3f2fd;
          border-radius: 10px;
          cursor: pointer;
        }
        
        .selectedUserItem {
          background-color: lightblue;
        }
        
        .userItemContent {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .userProfile {
          height: 50px;
          width: 50px;
          border-radius: 50%;
        }
        
        .userName {
          font-size: 16px;
          font-weight: 500;
          color: #777;
        }
        
        .userType {
          font-size: 14px;
          color: #777;
          margin-top: 5px;
        }
        
        .selectedContainer {
          margin-bottom: 20px;
        }
        
        .selectedTitle {
          font-size: 16px;
          font-weight: 600;
          color: #2ecc71;
        }
        
        .addButton {
          height: 50px;
          background-color: #2ecc71;
          border-radius: 8px;
          color: #fff;
          font-weight: bold;
          font-size: 16px;
          border: none;
          cursor: pointer;
          width: 100%;
        }
        
        .disabledButton {
          background-color: #95a5a6;
          cursor: not-allowed;
        }
        
        .spinner {
          display: inline-block;
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255,255,255,.3);
          border-radius: 50%;
          border-top-color: #fff;
          animation: spin 1s ease-in-out infinite;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default GroupMemberAdd;