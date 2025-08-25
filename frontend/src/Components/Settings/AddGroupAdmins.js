import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MdPersonAdd, MdGroup } from 'react-icons/md';
import API_URL from '../../Config';
import IMG_URL from '../../imagurl';

const AddGroupAdmins = ({ groupId, currentAdmins }) => {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [processingId, setProcessingId] = useState(null);

    const styles = {
        container: {
            backgroundColor: '#fff',
            padding: '15px',
            maxWidth: '800px',
            margin: '0 auto',
        },
        loadingContainer: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            backgroundColor: '#fff',
        },
        loadingText: {
            marginTop: '10px',
            color: '#14AE5C',
            fontSize: '16px',
        },
        headerTitle: {
            fontSize: '22px',
            fontWeight: 'bold',
            color: '#333',
            marginBottom: '5px',
            textAlign: 'center',
        },
        subTitle: {
            fontSize: '14px',
            color: '#666',
            marginBottom: '20px',
            textAlign: 'center',
        },
        listContainer: {
            paddingBottom: '20px',
        },
        memberItem: {
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#f8f8f8',
            borderRadius: '10px',
            padding: '15px',
            marginBottom: '10px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        },
        memberImage: {
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            marginRight: '15px',
            backgroundColor: '#eee',
            objectFit: 'cover',
        },
        memberInfo: {
            flex: 1,
            marginRight: '10px',
            overflow: 'hidden',
        },
        memberName: {
            fontSize: '16px',
            fontWeight: '500',
            color: '#333',
            marginBottom: '3px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
        },
        memberType: {
            fontSize: '14px',
            color: '#666',
        },
        addButton: {
            backgroundColor: '#14AE5C',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 0.3s',
        },
        addButtonHover: {
            backgroundColor: '#0e8e4a',
        },
        addButtonDisabled: {
            backgroundColor: '#a0d9b4',
            cursor: 'not-allowed',
        },
        emptyContainer: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '100px',
        },
        emptyText: {
            textAlign: 'center',
            color: '#666',
            marginTop: '15px',
            fontSize: '16px',
        },
        refreshButton: {
            display: 'block',
            margin: '20px auto',
            padding: '10px 20px',
            backgroundColor: '#14AE5C',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
        },
        refreshButtonHover: {
            backgroundColor: '#0e8e4a',
        },
        spinner: {
            border: '2px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '50%',
            borderTop: '2px solid #fff',
            width: '16px',
            height: '16px',
            animation: 'spin 1s linear infinite',
        },
        largeSpinner: {
            width: '40px',
            height: '40px',
            borderWidth: '4px',
        },
    };

    const fetchMembers = async () => {
        try {
            setLoading(true);

            // First get member IDs
            const membersResponse = await axios.get(
                `${API_URL}api/postgroup/getGroupMembers/${groupId}`,
            );
            const memberIds = membersResponse.data.members;

            // Then fetch details for each member
            const membersWithDetails = await Promise.all(
                memberIds.map(async memberId => {
                    try {
                        const userResponse = await axios.get(
                            `${API_URL}api/user/getUserData/${memberId}`,
                        );
                        return {
                            ...userResponse.data,
                            isAdmin: currentAdmins.includes(memberId),
                        };
                    } catch (error) {
                        console.error(`Error fetching user ${memberId}:`, error);
                        return {
                            _id: memberId,
                            name: 'Unknown User',
                            type: 'Member',
                            imgUrl: null,
                            isAdmin: currentAdmins.includes(memberId),
                        };
                    }
                }),
            );

            // Filter out current admins
            setMembers(membersWithDetails.filter(member => !member.isAdmin));
        } catch (error) {
            console.error('Fetch members error:', error);
            alert('Error: Failed to load group members');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchMembers();
    };

    const addAdmin = async userId => {
        if (window.confirm('Are you sure you want to make this member an admin?')) {
            try {
                setProcessingId(userId);
                await axios.post(`${API_URL}api/postgroup/addGroupAdmins/${groupId}`, {
                    admins: [userId],
                });

                // Optimistic UI update - remove from list
                setMembers(prev => prev.filter(member => member._id !== userId));
                alert('Success: Member added as admin successfully');
            } catch (error) {
                console.error('Add admin error:', error);
                alert('Error: Failed to add admin');
                fetchMembers(); // Refresh to ensure consistency
            } finally {
                setProcessingId(null);
            }
        }
    };

    const renderMemberItem = (item) => {
        const buttonStyle = processingId === item._id
            ? { ...styles.addButton, ...styles.addButtonDisabled }
            : styles.addButton;

        return (
            <div style={styles.memberItem} key={item._id}>
                <img
                    src={
                        item.imgUrl
                            ? `${IMG_URL}${item.imgUrl.startsWith('/') ? '' : '/'}${item.imgUrl
                            }`
                            : `${IMG_URL}/static/avatars/default_profile.png`
                    }
                    alt={item.name}
                    style={styles.memberImage}
                />

                <div style={styles.memberInfo}>
                    <div style={styles.memberName}>{item.name}</div>
                    <div style={styles.memberType}>Member</div>
                </div>

                <button
                    style={buttonStyle}
                    onClick={() => addAdmin(item._id)}
                    disabled={processingId === item._id}
                    onMouseEnter={(e) => processingId !== item._id && (e.currentTarget.style.backgroundColor = styles.addButtonHover.backgroundColor)}
                    onMouseLeave={(e) => processingId !== item._id && (e.currentTarget.style.backgroundColor = styles.addButton.backgroundColor)}
                >
                    {processingId === item._id ? (
                        <div style={styles.spinner}></div>
                    ) : (
                        <MdPersonAdd size={20} color="#fff" />
                    )}
                </button>
            </div>
        );
    };

    useEffect(() => {
        fetchMembers();
    }, [groupId]);

    if (loading && !refreshing) {
        return (
            <div style={styles.loadingContainer}>
                <div style={{ ...styles.spinner, ...styles.largeSpinner }}></div>
                <div style={styles.loadingText}>Loading members...</div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <h1 style={styles.headerTitle}>Add New Admins</h1>
            <div style={styles.subTitle}>Select members to make them admins</div>

            <div style={styles.listContainer}>
                {members.length > 0 ? (
                    members.map(item => renderMemberItem(item))
                ) : (
                    <div style={styles.emptyContainer}>
                        <MdGroup size={50} color="#ccc" />
                        <div style={styles.emptyText}>
                            {members.length === 0 && !loading
                                ? 'No regular members available to promote'
                                : 'Loading members...'}
                        </div>
                    </div>
                )}
            </div>

            <button
                style={styles.refreshButton}
                onClick={onRefresh}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = styles.refreshButtonHover.backgroundColor}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = styles.refreshButton.backgroundColor}
            >
                Refresh List
            </button>

            <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    );
};

export default AddGroupAdmins;