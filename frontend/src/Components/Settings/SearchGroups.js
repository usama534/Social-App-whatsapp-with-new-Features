import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../../Config';
import { FiSearch, FiX, FiChevronRight } from 'react-icons/fi'; // Using react-icons instead of react-native-vector-icons
import Sidebar from "../Sidebar/Sidebar";

const SearchGroups = () => {
    const navigate = useNavigate();
    const [groups, setGroups] = useState([]);
    const [filteredGroups, setFilteredGroups] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const response = await axios.get(`${API_URL}api/postgroup/getAllGroups`);
                setGroups(response.data);
                setFilteredGroups(response.data);
            } catch (error) {
                console.error('Error fetching groups:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchGroups();
    }, []);

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredGroups(groups);
        } else {
            const filtered = groups.filter(group =>
                group.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredGroups(filtered);
        }
    }, [searchQuery, groups]);

    const navigateToGroupDetails = (group) => {
        navigate('/group-detail', {
            state: {
                _id: group._id,
                imgUrl: group.imgUrl,
                name: group.name
            }
        });
    };

    const renderGroupItem = (item) => (
        <div
            key={item._id}
            className="groupItem"
            onClick={() => navigateToGroupDetails(item)}
        >
            <img
                // src={item.imgUrl ? `${IMG_BASE_URL}${item.imgUrl}` : 'https://via.placeholder.com/50'}
                alt={item.name}
                className="groupImage"
            />
            <div className="groupInfo">
                <div className="groupName">{item.name}</div>
                <div className="groupMembers">
                    {item.is_private ? 'Private' : 'Public'}
                </div>
                {item.aboutGroup && (
                    <div className="groupAbout" title={item.aboutGroup}>
                        {item.aboutGroup.length > 50 ? `${item.aboutGroup.substring(0, 50)}...` : item.aboutGroup}
                    </div>
                )}
            </div>
            <FiChevronRight size={24} color="#888" />
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
            <Sidebar />
            <div className="searchContainer">
                <FiSearch size={24} color="#888" className="searchIcon" />
                <input
                    type="text"
                    className="searchInput"
                    placeholder="Search groups..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                />
                {searchQuery !== '' && (
                    <button
                        className="clearButton"
                        onClick={() => setSearchQuery('')}
                    >
                        <FiX size={24} color="#888" />
                    </button>
                )}
            </div>

            <div className="listContainer">
                {filteredGroups.length > 0 ? (
                    filteredGroups.map(renderGroupItem)
                ) : (
                    <div className="emptyContainer">
                        <div className="emptyText">No groups found</div>
                    </div>
                )}
            </div>

            <style jsx>{`
        .container {
          background-color: #f5f5f5;
          min-height: 100vh;
          padding-bottom: 20px;
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
        
        .searchContainer {
          display: flex;
          align-items: center;
          background-color: #fff;
          padding: 10px 15px;
          margin: 10px;
          border-radius: 10px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .searchIcon {
          margin-right: 10px;
        }
        
        .searchInput {
          flex: 1;
          font-size: 16px;
          color: #333;
          border: none;
          outline: none;
          padding: 5px;
        }
        
        .clearButton {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          margin-left: 10px;
        }
        
        .listContainer {
          padding: 0 10px;
        }
        
        .groupItem {
          display: flex;
          align-items: center;
          background-color: #fff;
          padding: 15px;
          margin-bottom: 10px;
          border-radius: 10px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        
        .groupItem:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        
        .groupImage {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          margin-right: 15px;
          object-fit: cover;
        }
        
        .groupInfo {
          flex: 1;
        }
        
        .groupName {
          font-size: 16px;
          font-weight: 600;
          color: #333;
          margin-bottom: 3px;
        }
        
        .groupMembers {
          font-size: 13px;
          color: #666;
          margin-bottom: 5px;
        }
        
        .groupAbout {
          font-size: 14px;
          color: #555;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .emptyContainer {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 50px;
        }
        
        .emptyText {
          font-size: 16px;
          color: #888;
        }
      `}</style>
        </div>
    );
};

export default SearchGroups;