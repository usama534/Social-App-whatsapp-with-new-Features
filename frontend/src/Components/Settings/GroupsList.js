// import React, { useEffect, useState } from "react";
// import "./Settings.css";
// import { useNavigate } from "react-router-dom";
// import { ChevronRight, PlusCircle } from "lucide-react";
// import Sidebar from "../Sidebar/Sidebar";

// const GroupsList = () => {
//     const [groups, setGroups] = useState([]);
//     const navigate = useNavigate();

//     useEffect(() => {
//         const dummyGroups = [
//             { id: 1, name: "Programming Club", members: 150 },
//             { id: 2, name: "AI Community", members: 90 },
//             { id: 3, name: "Drama Society", members: 40 },
//             { id: 4, name: "Book Readers", members: 75 },
//             { id: 5, name: "Cricket Lovers", members: 120 },
//         ];
//         setGroups(dummyGroups);
//     }, []);

//     const goToGroupDetails = (groupId) => {
//         navigate(`/settings/groups/${groupId}`);
//     };

//     const handleCreateGroup = () => {
//         navigate("/settings/groups/new"); // 🔗 Navigate to new group creation
//     };

//     return (
//         <div className="groups-list-container">
//             <Sidebar />
//             <div className="groups-list-header">
//                 <h2 className="groups-list-title">All Groups</h2>
//                 <button className="create-group-btn" onClick={handleCreateGroup}>
//                     <PlusCircle size={18} style={{ marginRight: 6 }} />
//                     Create New Group
//                 </button>
//             </div>

//             <div className="groups-grid">
//                 {groups.map((group) => (
//                     <div
//                         key={group.id}
//                         className="group-card group-clickable"
//                         onClick={() => goToGroupDetails(group.id)}
//                     >
//                         <div className="group-card-content">
//                             <div>
//                                 <h3>{group.name}</h3>
//                                 <p>{group.members} members</p>
//                             </div>
//                             <ChevronRight size={20} className="chevron-icon-group" />
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default GroupsList;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_URL from '../../Config';
import Sidebar from "../Sidebar/Sidebar";
import IMG_URL from '../../imagurl';

const USER_ID = localStorage.getItem('userId');

const UserGroups = () => {
    const [groups, setGroups] = useState([]);
    const navigate = useNavigate();

    const fetchGroups = async () => {
        try {
            const res = await axios.get(`${API_URL}api/user/getGroups/${USER_ID}`);
            const cleanData = res.data.filter(item => item !== null);
            setGroups(cleanData);
            console.log(cleanData);
        } catch (err) {
            console.error('Error fetching groups:', err);
        }
    };

    useEffect(() => {
        fetchGroups();
    }, []);

    const styles = {
        container: {
            padding: '10px',
            flex: 1,
            marginLeft: '200px'
        },
        header: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '10px'
        },
        groupCount: {
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#21A558'
        },
        createButton: {
            backgroundColor: '#21A558',
            padding: '6px 12px',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
            marginLeft: '10px'
        },
        createButtonText: {
            color: '#fff',
            fontWeight: 'bold'
        },
        card: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#fff',
            padding: '10px',
            borderRadius: '8px',
            marginBottom: '10px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            cursor: 'pointer'
        },
        avatar: {
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            marginRight: '10px',
            objectFit: 'cover'
        },
        name: {
            fontSize: '16px',
            color: 'black'
        },
        listContainer: {
            paddingBottom: '20px'
        }
    };

    const renderItem = (item) => {
        if (!item || !item._id) return null;

        return (
            <div
                style={styles.card}
                onClick={() => navigate('/group-detail', { state: item })}
            >
                <img
                    src={`${IMG_URL}${item.imgUrl || '/static/avatars/default_group.png'}`}
                    alt={item.name || 'Group'}
                    style={styles.avatar}
                />
                <span style={styles.name}>{item.name || 'Unnamed Group'}</span>
            </div>
        );
    };

    return (
        <div style={styles.container}>
            <Sidebar />
            <div style={styles.header}>
                <span style={styles.groupCount}>{groups.length} Groups</span>
                <div>
                    <button
                        style={styles.createButton}
                        onClick={() => navigate('/search-groups', { state: USER_ID })}
                    >
                        <span style={styles.createButtonText}>Search Groups</span>
                    </button>
                    <button
                        style={styles.createButton}
                        onClick={() => navigate('/create-group', { state: USER_ID })}
                    >
                        <span style={styles.createButtonText}>+ Create Group</span>
                    </button>
                </div>
            </div>
            <div style={styles.listContainer}>
                {groups.map(item => (
                    <React.Fragment key={item?._id}>
                        {renderItem(item)}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default UserGroups;
