import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import API_URL from '../../Config';
import { FaUserMinus, FaUsers } from 'react-icons/fa'; // Using react-icons instead of react-native-vector-icons

const GroupMemberRemove = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { groupId } = location.state || {};

    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [removingId, setRemovingId] = useState(null);

    const fetchMembers = async () => {
        try {
            setLoading(true);

            // First get member IDs
            const membersResponse = await axios.get(
                `${API_URL}api/postgroup/getGroupMembers/${groupId}`
            );
            const memberIds = membersResponse.data.members;

            // Then fetch details for each member
            const membersWithDetails = await Promise.all(
                memberIds.map(async memberId => {
                    try {
                        const userResponse = await axios.get(
                            `${API_URL}api/user/getUserData/${memberId}`
                        );
                        return userResponse.data;
                    } catch (error) {
                        console.error(`Error fetching user ${memberId}:`, error);
                        return {
                            _id: memberId,
                            name: 'Unknown User',
                            type: 'Member',
                            imgUrl: null,
                        };
                    }
                })
            );

            setMembers(membersWithDetails);
        } catch (error) {
            console.error('Fetch members error:', error);
            alert('Failed to load group members');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // Handle refresh
    const onRefresh = () => {
        setRefreshing(true);
        fetchMembers();
    };

    // Remove member function
    const removeMember = async userId => {
        if (!window.confirm('Are you sure you want to remove this member?')) {
            return;
        }

        try {
            setRemovingId(userId);
            await axios.post(
                `${API_URL}api/postgroup/removeMember/${groupId}/${userId}`
            );

            // Optimistic UI update
            setMembers(prev => prev.filter(member => member._id !== userId));
            alert('Member removed successfully');
        } catch (error) {
            console.error('Remove error:', error);
            alert('Failed to remove member');
            // Refresh to ensure consistency
            fetchMembers();
        } finally {
            setRemovingId(null);
        }
    };

    useEffect(() => {
        fetchMembers();
    }, [groupId]);

    // Render each member item
    const renderMemberItem = (item) => (
        <div key={item._id} className="memberItem">
            <img
                // src={
                //   item.imgUrl
                //     ? `${IMG_BASE_URL}${item.imgUrl.startsWith('/') ? '' : '/'}${item.imgUrl}`
                //     : `${IMG_BASE_URL}/static/avatars/default_profile.png`
                // }
                alt={item.name}
                className="memberImage"
            />

            <div className="memberInfo">
                <div className="memberName">{item.name}</div>
                <div className="memberType">{item.type}</div>
            </div>

            <button
                className={`removeButton ${removingId === item._id ? 'removeButtonDisabled' : ''}`}
                onClick={() => removeMember(item._id)}
                disabled={removingId === item._id}
            >
                {removingId === item._id ? (
                    <div className="spinner"></div>
                ) : (
                    <FaUserMinus />
                )}
            </button>
        </div>
    );

    if (loading && !refreshing) {
        return (
            <div className="loadingContainer">
                <div className="spinner"></div>
                <div className="loadingText">Loading members...</div>
            </div>
        );
    }

    return (
        <div className="container">
            <h2 className="headerTitle">Group Members ({members.length})</h2>

            <div className="listContainer">
                {members.length > 0 ? (
                    members.map(renderMemberItem)
                ) : (
                    <div className="emptyContainer">
                        <FaUsers size={50} color="#ccc" />
                        <div className="emptyText">No members found</div>
                    </div>
                )}
            </div>

            <style jsx>{`
        .container {
          background-color: #fff;
          padding: 15px;
          min-height: 100vh;
        }
        
        .loadingContainer {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background-color: #fff;
        }
        
        .loadingText {
          margin-top: 10px;
          color: #14AE5C;
          font-size: 16px;
        }
        
        .headerTitle {
          font-size: 22px;
          font-weight: bold;
          color: #333;
          margin-bottom: 20px;
          text-align: center;
        }
        
        .listContainer {
          padding-bottom: 20px;
        }
        
        .memberItem {
          display: flex;
          align-items: center;
          background-color: #f8f8f8;
          border-radius: 10px;
          padding: 15px;
          margin-bottom: 10px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        
        .memberImage {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          margin-right: 15px;
          background-color: #eee;
          object-fit: cover;
        }
        
        .memberInfo {
          flex: 1;
          margin-right: 10px;
          overflow: hidden;
        }
        
        .memberName {
          font-size: 16px;
          font-weight: 500;
          color: #333;
          margin-bottom: 3px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .memberType {
          font-size: 14px;
          color: #666;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .removeButton {
          background-color: #e74c3c;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          border: none;
          color: white;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .removeButton:hover {
          background-color: #c0392b;
        }
        
        .removeButtonDisabled {
          background-color: #f5b7b1;
          cursor: not-allowed;
        }
        
        .emptyContainer {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          margin-top: 100px;
        }
        
        .emptyText {
          text-align: center;
          color: #666;
          margin-top: 15px;
          font-size: 16px;
        }
        
        .spinner {
          border: 3px solid rgba(20, 174, 92, 0.3);
          border-radius: 50%;
          border-top: 3px solid #14AE5C;
          width: 20px;
          height: 20px;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    );
};

export default GroupMemberRemove;