// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useParams, useNavigate } from 'react-router-dom';
// import API_URL from '../../Config';
// import './Settings.css'

// const userId = '6754a9268db89992d5b8221e';

// const CommunityView = () => {
//     const { communityId } = useParams();
//     const navigate = useNavigate();
//     const [community, setCommunity] = useState(null);
//     const [modalType, setModalType] = useState(null);
//     const [postGroups, setPostGroups] = useState([]);
//     const [chatGroups, setChatGroups] = useState([]);
//     const [members, setMembers] = useState([]);
//     const [allGroupsModalVisible, setAllGroupsModalVisible] = useState(false);
//     const [allGroups, setAllGroups] = useState({ chatGroups: [], postGroups: [] });
//     const [loadingAllGroups, setLoadingAllGroups] = useState(false);
//     const [communityGroups, setCommunityGroups] = useState({ chat: [], post: [] });
//     const [addingGroup, setAddingGroup] = useState(false);
//     const [removingGroup, setRemovingGroup] = useState(false);
//     const [announcementGroupInfo, setAnnouncementGroupInfo] = useState(null);
//     const [loadingMembers, setLoadingMembers] = useState(false);
//     const [admins, setAdmins] = useState([]);

//     useEffect(() => {
//         fetchCommunity();
//         fetchCommunityGroups();
//         fetchCommunityMembers();
//         fetchCommunityAdmins();
//     }, [communityId]);

//     const fetchCommunity = async () => {
//         try {
//             const res = await axios.get(
//                 `${API_URL}api/community/getCommunity/${communityId}/${userId}`
//             );
//             setCommunity(res.data);
//             if (res.data.annoucementGroup) {
//                 fetchAnnouncementGroupInfo(res.data.annoucementGroup);
//             }
//         } catch (error) {
//             console.error('Failed to fetch community:', error);
//         }
//     };

//     const fetchAnnouncementGroupInfo = async (chatId) => {
//         try {
//             const response = await axios.get(
//                 `${API_URL}api/chatgroup/getGroupByChatId/${chatId}`
//             );
//             setAnnouncementGroupInfo(response.data);
//         } catch (error) {
//             console.error('Failed to fetch announcement group info:', error);
//         }
//     };

//     const fetchCommunityGroups = async () => {
//         try {
//             const response = await axios.get(
//                 `${API_URL}api/community/getCommunityGroups/${communityId}`
//             );
//             setCommunityGroups({
//                 chat: response.data.chatGroups.map(g => g._id),
//                 post: response.data.postGroups.map(g => g._id),
//             });
//         } catch (error) {
//             console.error('Failed to fetch community groups:', error);
//         }
//     };

//     const fetchCommunityMembers = async () => {
//         setLoadingMembers(true);
//         try {
//             const response = await axios.get(
//                 `${API_URL}api/community/getMembers/${communityId}`
//             );
//             const memberIds = Array.isArray(response.data.members) ? response.data.members : [];

//             const memberDetails = await Promise.all(
//                 memberIds.map(id => {
//                     const memberId = typeof id === 'object' ? id._id || id.id || '' : id;
//                     if (!memberId || typeof memberId !== 'string') {
//                         return { _id: 'invalid', name: 'Unknown User', imgUrl: '' };
//                     }
//                     return axios
//                         .get(`${API_URL}api/user/getUserData/${memberId}`)
//                         .then(res => res.data)
//                         .catch(err => {
//                             console.error(`Failed to fetch user ${memberId}:`, err);
//                             return { _id: memberId, name: 'Unknown User', imgUrl: '' };
//                         });
//                 })
//             );

//             const validMembers = memberDetails.filter(m => m && m._id && m._id !== 'invalid');
//             setMembers(validMembers);
//         } catch (error) {
//             console.error('Failed to fetch community members:', error);
//         } finally {
//             setLoadingMembers(false);
//         }
//     };

//     const fetchCommunityAdmins = async () => {
//         try {
//             const response = await axios.get(
//                 `${API_URL}api/community/getAdmins/${communityId}`
//             );
//             const admins = response.data.admins.map(a => a._id);
//             setAdmins(admins);
//         } catch (error) {
//             console.error('Failed to fetch community admins:', error);
//         }
//     };

//     const fetchGroups = async () => {
//         try {
//             const [postRes, chatRes] = await Promise.all([
//                 axios.get(`${API_URL}api/postgroup/getAllGroups`),
//                 axios.get(`${API_URL}api/chatgroup/getAllGroupChats/${userId}`),
//             ]);

//             const adminPosts = postRes.data
//                 .filter(g => g.admins?.some(a => (typeof a === 'string' ? a : a._id) === userId))
//                 .filter(g => !communityGroups.post.includes(g._id));

//             const adminChats = chatRes.data
//                 .filter(g => g.groupInfo?.isAdmin)
//                 .filter(g => !communityGroups.chat.includes(g.groupInfo._id));

//             setPostGroups(adminPosts);
//             setChatGroups(adminChats);
//             setModalType('addGroups');
//         } catch (err) {
//             console.error(err);
//             alert('Failed to fetch groups.');
//         }
//     };

//     const fetchAllCommunityGroups = async () => {
//         setLoadingAllGroups(true);
//         try {
//             const response = await axios.get(
//                 `${API_URL}api/community/getCommunityGroups/${communityId}`
//             );
//             setAllGroups(response.data);
//             setAllGroupsModalVisible(true);
//         } catch (error) {
//             console.error('Error fetching all groups:', error);
//             alert('Failed to fetch all groups');
//         } finally {
//             setLoadingAllGroups(false);
//         }
//     };

//     const fetchGroupMembers = async (gid, type) => {
//         try {
//             const endpoint = type === 'postgroup'
//                 ? `${API_URL}api/postgroup/getGroupMembers/${gid}`
//                 : `${API_URL}api/chatgroup/getMembers/${gid}`;

//             const response = await axios.get(endpoint);
//             return type === 'postgroup' ? response.data.members : response.data.map(m => m.id);
//         } catch (error) {
//             console.error(`Failed to fetch ${type} members:`, error);
//             return [];
//         }
//     };

//     const joinAnnouncementGroup = async (memberIds) => {
//         if (!community?.annoucementGroup || !announcementGroupInfo) return;

//         try {
//             await Promise.all(
//                 memberIds.map(uid =>
//                     axios.post(
//                         `${API_URL}api/chatgroup/joinGroup/${announcementGroupInfo._id}/${uid}`
//                     )
//                 )
//             );
//         } catch (error) {
//             console.error('Failed to join announcement group:', error);
//         }
//     };

//     const removeFromAnnouncementGroup = async (memberIds) => {
//         if (!community?.annoucementGroup || !announcementGroupInfo) return;

//         try {
//             await Promise.all(
//                 memberIds.map(uid =>
//                     axios.put(
//                         `${API_URL}api/chatgroup/removeMember/${announcementGroupInfo._id}/${uid}`
//                     )
//                 )
//             );
//         } catch (error) {
//             console.error('Failed to remove from announcement group:', error);
//         }
//     };

//     const addMembersToCommunity = async (memberIds) => {
//         try {
//             const existingMembers = members.map(m => m._id);
//             const membersToAdd = memberIds.filter(id => !existingMembers.includes(id));

//             if (membersToAdd.length > 0) {
//                 await Promise.all(
//                     membersToAdd.map(uid =>
//                         axios.post(
//                             `${API_URL}api/community/addMember/${communityId}/${uid}`
//                         )
//                     )
//                 );
//                 await joinAnnouncementGroup(membersToAdd);
//             }
//         } catch (error) {
//             console.error('Failed to add members to community:', error);
//             throw error;
//         }
//     };

//     const handleAddGroup = async (gid, type) => {
//         if (addingGroup) return;
//         setAddingGroup(true);

//         try {
//             await axios.post(`${API_URL}api/community/addGroup/${communityId}`, {
//                 gid,
//                 type,
//             });

//             const memberIds = await fetchGroupMembers(gid, type);
//             if (memberIds.length > 0) {
//                 await addMembersToCommunity(memberIds);
//             }

//             alert('Group and its members added to community!');
//             fetchCommunity();
//             fetchCommunityGroups();
//             fetchGroups();
//         } catch (err) {
//             console.error(err);
//             alert('Failed to add group.');
//         } finally {
//             setAddingGroup(false);
//         }
//     };

//     const removeMembersFromCommunity = async (memberIds) => {
//         try {
//             const membersToRemove = memberIds.filter(id => !admins.includes(id));
//             if (membersToRemove.length > 0) {
//                 await Promise.all(
//                     membersToRemove.map(uid =>
//                         axios.put(
//                             `${API_URL}api/community/leaveCommunity/${communityId}/${uid}`
//                         )
//                     )
//                 );
//                 await removeFromAnnouncementGroup(membersToRemove);
//             }
//         } catch (error) {
//             console.error('Failed to remove members from community:', error);
//             throw error;
//         }
//     };

//     const handleRemoveGroup = async (groupId, type) => {
//         if (removingGroup) return;
//         setRemovingGroup(true);

//         try {
//             const memberIds = await fetchGroupMembers(groupId, type);
//             if (memberIds.length > 0) {
//                 await removeMembersFromCommunity(memberIds);
//             }

//             await axios.post(`${API_URL}api/community/removeGroup/${communityId}`, {
//                 type,
//                 gid: groupId,
//             });

//             alert('Group removed from community!');
//             fetchCommunity();
//             fetchCommunityGroups();
//         } catch (err) {
//             console.error(err);
//             alert('Failed to remove group.');
//         } finally {
//             setRemovingGroup(false);
//         }
//     };

//     const navigateToChat = (cid, chatName) => {
//         navigate(`/chat/${cid}`, {
//             state: {
//                 participant: 3,
//                 chatName,
//                 isGroup: true,
//             }
//         });
//     };

//     const navigateToGroup = (gid, imgUrl, name) => {
//         navigate(`/group/${gid}`, {
//             state: {
//                 imgUrl,
//                 name,
//             }
//         });
//     };

//     const renderGroup = (item, type) => (
//         <div
//             className="group-card"
//             onClick={() => handleAddGroup(item._id, type)}
//             disabled={addingGroup}
//         >
//             <img
//                 // src={`${IMG_BASE_URL}${item.imgUrl}`}
//                 alt={item.name}
//                 className="group-img"
//             />
//             <div className="group-name">{item.name}</div>
//             <span className="add-icon">+</span>
//             {addingGroup && <div className="loading-indicator"></div>}
//         </div>
//     );

//     const renderChatGroup = (item, type) => {
//         const groupInfo = item.groupInfo || {};
//         return (
//             <div
//                 className="group-card"
//                 onClick={() => handleAddGroup(item.groupInfo._id, type)}
//                 disabled={addingGroup}
//             >
//                 <img
//                     //   src={groupInfo.imgUrl ? `${IMG_BASE_URL}${groupInfo.imgUrl}` : ''}
//                     alt={groupInfo.name || 'Unnamed Group'}
//                     className="group-img"
//                 />
//                 <div className="group-name">{groupInfo.name || 'Unnamed Group'}</div>
//                 <span className="add-icon">+</span>
//                 {addingGroup && <div className="loading-indicator"></div>}
//             </div>
//         );
//     };

//     const renderIncludedGroup = (item) => {
//         const groupType = item.type === 'chat' ? 'chatgroup' : 'postgroup';

//         const handlePress = () => {
//             if (item.type === 'chat') {
//                 const chatId = typeof item.chat === 'string' ? item.chat : item.chat?._id || item._id;
//                 navigateToChat(chatId, item.name);
//             } else {
//                 navigateToGroup(item._id, item.imgUrl || '', item.name || 'Unnamed Group');
//             }
//         };

//         return (
//             <div className="included-group-card" onClick={handlePress}>
//                 <img
//                     //   src={`${IMG_BASE_URL}${item.imgUrl || ''}`}
//                     alt={item.name || 'Unnamed Group'}
//                     className="included-group-img"
//                 />
//                 <div className="included-group-info">
//                     <div className="included-group-name">{item.name || 'Unnamed Group'}</div>
//                     <div className="included-group-type">
//                         {item.type === 'chat' ? 'Chat Group' : 'Post Group'}
//                     </div>
//                 </div>
//                 <button
//                     className="remove-group-button"
//                     onClick={(e) => {
//                         e.stopPropagation();
//                         handleRemoveGroup(item._id, groupType);
//                     }}
//                     disabled={removingGroup}
//                 >
//                     {removingGroup ? '...' : '×'}
//                 </button>
//             </div>
//         );
//     };

//     const renderAllGroupItem = (item, type) => {
//         const handlePress = async () => {
//             if (type === 'chat') {
//                 const res = await axios.get(
//                     `${API_URL}api/chatgroup/getGroupChat/${item._id}/${userId}`
//                 );
//                 navigateToChat(res.data.chat._id, item.name);
//             } else {
//                 navigateToGroup(item._id, item.imgUrl || '', item.name || 'Unnamed Group');
//             }
//         };

//         return (
//             <div
//                 className="all-group-item"
//                 onClick={() => {
//                     setAllGroupsModalVisible(false);
//                     handlePress();
//                 }}
//             >
//                 <img
//                     //   src={`${IMG_BASE_URL}${item.imgUrl}`}
//                     alt={item.name}
//                     className="all-group-image"
//                 />
//                 <div className="all-group-info">
//                     <div className="all-group-name">{item.name}</div>
//                     <div className="all-group-type">
//                         {type === 'chat' ? 'Chat Group' : 'Post Group'}
//                     </div>
//                 </div>
//                 <span className="chevron-right">→</span>
//             </div>
//         );
//     };

//     //   const renderMember = (item) => {
//     //     const isAdmin = admins?.includes(item._id);

//     //     const handleMemberClick = () => {
//     //       if (admins?.includes(userId)) {
//     //         const confirmAction = confirm(
//     //           `Do you want to ${isAdmin ? 'remove from' : 'make'} admin?`
//     //         );
//     //         if (confirmAction) {
//     //           isAdmin ? removeAdmin(item._id) : makeAdmin(item._id);
//     //         }
//     //       }
//     //     };

//     //     return (
//     //       <div className="member-card" onClick={handleMemberClick}>
//     //         <div className="member-info">
//     //           <img
//     //             // src={`${IMG_BASE_URL}${item.imgUrl || ''}`}
//     //             alt={item.name || 'Unknown User'}
//     //             className="member-avatar"
//     //           />
//     //           <div>
//     //             <div className="member-name">{item.name || 'Unknown User'}</div>
//     //             <div className="member-status">
//     //               {isAdmin ? 'Admin' : 'Member'}
//     //             </div>
//     //           </div>
//     //         </div>
//     //         {isAdmin && <span className="star-icon">★</span>}
//     //       </div>
//     //     );
//     //   };

//     const renderMember = (item) => {
//         const isAdmin = admins?.includes(item._id);

//         const handleMemberClick = () => {
//             // Only proceed if user is an admin
//             if (!admins?.includes(userId)) return;

//             // Safely use confirm
//             if (typeof window !== 'undefined') {
//                 const confirmMessage = `Do you want to ${isAdmin ? 'remove from' : 'make'} admin?`;
//                 const confirmAction = window.confirm(confirmMessage);

//                 if (confirmAction) {
//                     isAdmin ? removeAdmin(item._id) : makeAdmin(item._id);
//                 }
//             } else {
//                 // Fallback for environments without window (optional)
//                 console.log("Confirmation not available in this environment");
//                 // Alternatively, you could use state to show a modal confirmation
//             }
//         };

//         return (
//             <div className="member-card" onClick={handleMemberClick}>
//                 <div className="member-info">
//                     <img
//                         // src={`${IMG_BASE_URL}${item.imgUrl || ''}`}
//                         alt={item.name || 'Unknown User'}
//                         className="member-avatar"
//                     />
//                     <div>
//                         <div className="member-name">{item.name || 'Unknown User'}</div>
//                         <div className="member-status">
//                             {isAdmin ? 'Admin' : 'Member'}
//                         </div>
//                     </div>
//                 </div>
//                 {isAdmin && <span className="star-icon">★</span>}
//             </div>
//         );
//     };
//     const makeAdmin = async (uid) => {
//         try {
//             await axios.post(`${API_URL}api/community/addAdmins/${communityId}`, {
//                 admins: [uid],
//             });
//             fetchCommunity();
//             fetchCommunityMembers();
//         } catch (err) {
//             alert('Failed to add admin');
//         }
//     };

//     const removeAdmin = async (uid) => {
//         try {
//             await axios.post(
//                 `${API_URL}api/community/removeAdmins/${communityId}`,
//                 { admins: [uid] }
//             );
//             fetchCommunity();
//             fetchCommunityMembers();
//         } catch (err) {
//             alert('Failed to remove admin');
//         }
//     };

//     if (!community) {
//         return (
//             <div className="loading-container">
//                 <div className="loading-text">Loading...</div>
//             </div>
//         );
//     }

//     return (
//         <div className="community-view-container">
//             <div className="header">
//                 <button onClick={() => navigate(-1)} className="back-button">
//                     ←
//                 </button>
//                 <div className="header-title">Community Info</div>
//                 <button onClick={() => setModalType('members')} className="people-button">
//                     👥
//                 </button>
//             </div>

//             <div className="content">
//                 <div className="community-header">
//                     <img
//                         // src={`${IMG_BASE_URL}${community.imgUrl}`}
//                         alt={community.title}
//                         className="community-image"
//                     />
//                     <div className="community-title">{community.title}</div>
//                     <div className="community-subtitle">
//                         {community.memberCount || 0} members
//                     </div>
//                 </div>

//                 {community.lastMessage && (
//                     <div className="announcement-box">
//                         <div className="announcement-header">
//                             <div className="announcement-title">Announcement</div>
//                             <span className="announcement-icon">📢</span>
//                         </div>
//                         <div className="announcement-content">
//                             {community.lastMessage.content}
//                         </div>
//                     </div>
//                 )}

//                 <div className="section">
//                     <div className="section-title">About</div>
//                     <div className="section-content">{community.aboutCommunity}</div>
//                 </div>

//                 <div
//                     className="included-group-card announcement-group"
//                     onClick={() => navigateToChat(community.annoucementGroup, 'Announcement')}
//                 >
//                     <div className="icon-container">
//                         📢
//                     </div>
//                     <div className="included-group-info">
//                         <div className="included-group-name">Announcement</div>
//                         <div className="included-group-type">Announcement group</div>
//                     </div>
//                 </div>

//                 {community.includedGroups?.length > 0 && (
//                     <div className="section">
//                         <div className="section-header">
//                             <div className="section-title">Included Groups</div>
//                             <button
//                                 onClick={fetchAllCommunityGroups}
//                                 disabled={loadingAllGroups}
//                                 className="view-all-button"
//                             >
//                                 {loadingAllGroups ? 'Loading...' : 'View All'}
//                             </button>
//                         </div>
//                         <div className="included-groups-list">
//                             {community.includedGroups.slice(0, 3).map(item => (
//                                 <div key={item._id}>
//                                     {renderIncludedGroup(item)}
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 )}

//                 <div className="actions-container">
//                     <button
//                         className="action-button"
//                         onClick={() => navigate(`/edit-community/${communityId}`)}
//                     >
//                         <span className="action-icon">✏️</span>
//                         <span className="action-text">Edit</span>
//                     </button>

//                     <button
//                         className="action-button"
//                         onClick={fetchGroups}
//                         disabled={addingGroup || removingGroup}
//                     >
//                         <span className="action-icon">👥</span>
//                         <span className="action-text">Add Groups</span>
//                     </button>
//                 </div>
//             </div>

//             {modalType === 'addGroups' && (
//                 <div className="modal">
//                     <div className="modal-header">
//                         <button onClick={() => setModalType(null)} className="modal-back-button">
//                             ←
//                         </button>
//                         <div className="modal-title">Add Groups</div>
//                         <div className="spacer"></div>
//                     </div>

//                     <div className="modal-section-title">Your Post Groups</div>
//                     <div className="group-list horizontal-scroll">
//                         {postGroups.map(item => (
//                             <div key={item._id}>
//                                 {renderGroup(item, 'postgroup')}
//                             </div>
//                         ))}
//                     </div>

//                     <div className="modal-section-title">Your Chat Groups</div>
//                     <div className="group-list horizontal-scroll">
//                         {chatGroups.map(item => (
//                             <div key={item.chat._id}>
//                                 {renderChatGroup(item, 'chatgroup')}
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             )}

//             {modalType === 'members' && (
//                 <div className="modal">
//                     <div className="modal-header">
//                         <button onClick={() => setModalType(null)} className="modal-back-button">
//                             ←
//                         </button>
//                         <div className="modal-title">Community Members</div>
//                         <div className="spacer"></div>
//                     </div>

//                     {loadingMembers ? (
//                         <div className="loading-container">
//                             <div className="spinner"></div>
//                         </div>
//                     ) : (
//                         <div className="member-list">
//                             {members.map(item => (
//                                 <div key={item._id}>
//                                     {renderMember(item)}
//                                 </div>
//                             ))}
//                         </div>
//                     )}
//                 </div>
//             )}

//             {allGroupsModalVisible && (
//                 <div className="modal">
//                     <div className="modal-header">
//                         <button onClick={() => setAllGroupsModalVisible(false)} className="modal-back-button">
//                             ←
//                         </button>
//                         <div className="modal-title">All Community Groups</div>
//                         <div className="spacer"></div>
//                     </div>

//                     {loadingAllGroups ? (
//                         <div className="loading-container">
//                             <div className="spinner"></div>
//                         </div>
//                     ) : (
//                         <div className="modal-content">
//                             <div className="modal-section-title">Chat Groups</div>
//                             <div className="all-groups-list">
//                                 {allGroups.chatGroups.map(item => (
//                                     <div key={item._id}>
//                                         {renderAllGroupItem(item, 'chat')}
//                                     </div>
//                                 ))}
//                             </div>

//                             <div className="modal-section-title">Post Groups</div>
//                             <div className="all-groups-list">
//                                 {allGroups.postGroups.map(item => (
//                                     <div key={item._id}>
//                                         {renderAllGroupItem(item, 'post')}
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>
//                     )}
//                 </div>
//             )}
//         </div>
//     );
// };

// export default CommunityView;

// import React, { useState, useEffect, useCallback } from 'react';
// import axios from 'axios';
// import { useParams, useNavigate } from 'react-router-dom';
// import API_URL from '../../Config';
// import './Settings.css';
// import Sidebar from '../Sidebar/Sidebar';

// const userId = localStorage.getItem('userId');

// const CommunityView = () => {
//     const { communityId } = useParams();
//     console.log("Current Community ID:", communityId);
//     const navigate = useNavigate();
//     const [community, setCommunity] = useState(null);
//     const [modalType, setModalType] = useState(null);
//     const [postGroups, setPostGroups] = useState([]);
//     const [chatGroups, setChatGroups] = useState([]);
//     const [members, setMembers] = useState([]);
//     const [allGroupsModalVisible, setAllGroupsModalVisible] = useState(false);
//     const [allGroups, setAllGroups] = useState({ chatGroups: [], postGroups: [] });
//     const [loadingAllGroups, setLoadingAllGroups] = useState(false);
//     const [communityGroups, setCommunityGroups] = useState({ chat: [], post: [] });
//     const [addingGroup, setAddingGroup] = useState(false);
//     const [removingGroup, setRemovingGroup] = useState(false);
//     const [announcementGroupInfo, setAnnouncementGroupInfo] = useState(null);
//     const [loadingMembers, setLoadingMembers] = useState(false);
//     const [admins, setAdmins] = useState([]);

//     // Fetch functions wrapped in useCallback with proper dependencies
//     const fetchAnnouncementGroupInfo = useCallback(async (chatId) => {
//         try {
//             const response = await axios.get(
//                 `${API_URL}api/chatgroup/getGroupByChatId/${chatId}`
//             );
//             setAnnouncementGroupInfo(response.data);
//         } catch (error) {
//             console.error('Failed to fetch announcement group info:', error);
//         }
//     }, [API_URL]);

//     const fetchCommunity = useCallback(async () => {
//         try {
//             const res = await axios.get(
//                 `${API_URL}api/community/getCommunity/${communityId}/${userId}`
//             );
//             setCommunity(res.data);
//             if (res.data.annoucementGroup) {
//                 fetchAnnouncementGroupInfo(res.data.annoucementGroup);
//             }
//         } catch (error) {
//             console.error('Failed to fetch community:', error);
//         }
//     }, [API_URL, communityId, fetchAnnouncementGroupInfo]);

//     const fetchCommunityGroups = useCallback(async () => {
//         try {
//             const response = await axios.get(
//                 `${API_URL}api/community/getCommunityGroups/${communityId}`
//             );
//             setCommunityGroups({
//                 chat: response.data.chatGroups.map(g => g._id),
//                 post: response.data.postGroups.map(g => g._id),
//             });
//         } catch (error) {
//             console.error('Failed to fetch community groups:', error);
//         }
//     }, [API_URL, communityId]);

//     const fetchCommunityMembers = useCallback(async () => {
//         setLoadingMembers(true);
//         try {
//             const response = await axios.get(
//                 `${API_URL}api/community/getMembers/${communityId}`
//             );
//             const memberIds = Array.isArray(response.data.members) ? response.data.members : [];

//             const memberDetails = await Promise.all(
//                 memberIds.map(id => {
//                     const memberId = typeof id === 'object' ? id._id || id.id || '' : id;
//                     if (!memberId || typeof memberId !== 'string') {
//                         return { _id: 'invalid', name: 'Unknown User', imgUrl: '' };
//                     }
//                     return axios
//                         .get(`${API_URL}api/user/getUserData/${memberId}`)
//                         .then(res => res.data)
//                         .catch(err => {
//                             console.error(`Failed to fetch user ${memberId}:`, err);
//                             return { _id: memberId, name: 'Unknown User', imgUrl: '' };
//                         });
//                 })
//             );

//             const validMembers = memberDetails.filter(m => m && m._id && m._id !== 'invalid');
//             setMembers(validMembers);
//         } catch (error) {
//             console.error('Failed to fetch community members:', error);
//         } finally {
//             setLoadingMembers(false);
//         }
//     }, [API_URL, communityId]);

//     const fetchCommunityAdmins = useCallback(async () => {
//         try {
//             const response = await axios.get(
//                 `${API_URL}api/community/getAdmins/${communityId}`
//             );
//             const admins = response.data.admins.map(a => a._id);
//             setAdmins(admins);
//         } catch (error) {
//             console.error('Failed to fetch community admins:', error);
//         }
//     }, [API_URL, communityId]);

//     // Main useEffect for initial data loading
//     useEffect(() => {
//         fetchCommunity();
//         fetchCommunityGroups();
//         fetchCommunityMembers();
//         fetchCommunityAdmins();
//     }, [fetchCommunity, fetchCommunityGroups, fetchCommunityMembers, fetchCommunityAdmins]);

//     const fetchGroups = useCallback(async () => {
//         try {
//             const [postRes, chatRes] = await Promise.all([
//                 axios.get(`${API_URL}api/postgroup/getAllGroups`),
//                 axios.get(`${API_URL}api/chatgroup/getAllGroupChats/${userId}`),
//             ]);

//             const adminPosts = postRes.data
//                 .filter(g => g.admins?.some(a => (typeof a === 'string' ? a : a._id) === userId))
//                 .filter(g => !communityGroups.post.includes(g._id));

//             const adminChats = chatRes.data
//                 .filter(g => g.groupInfo?.isAdmin)
//                 .filter(g => !communityGroups.chat.includes(g.groupInfo._id));

//             setPostGroups(adminPosts);
//             setChatGroups(adminChats);
//             setModalType('addGroups');
//         } catch (err) {
//             console.error(err);
//             alert('Failed to fetch groups.');
//         }
//     }, [API_URL, communityGroups, userId]);

//     const fetchAllCommunityGroups = useCallback(async () => {
//         setLoadingAllGroups(true);
//         try {
//             const response = await axios.get(
//                 `${API_URL}api/community/getCommunityGroups/${communityId}`
//             );
//             setAllGroups(response.data);
//             setAllGroupsModalVisible(true);
//         } catch (error) {
//             console.error('Error fetching all groups:', error);
//             alert('Failed to fetch all groups');
//         } finally {
//             setLoadingAllGroups(false);
//         }
//     }, [API_URL, communityId]);

//     const fetchGroupMembers = useCallback(async (gid, type) => {
//         try {
//             const endpoint = type === 'postgroup'
//                 ? `${API_URL}api/postgroup/getGroupMembers/${gid}`
//                 : `${API_URL}api/chatgroup/getMembers/${gid}`;

//             const response = await axios.get(endpoint);
//             return type === 'postgroup' ? response.data.members : response.data.map(m => m.id);
//         } catch (error) {
//             console.error(`Failed to fetch ${type} members:`, error);
//             return [];
//         }
//     }, [API_URL]);

//     const joinAnnouncementGroup = useCallback(async (memberIds) => {
//         if (!community?.annoucementGroup || !announcementGroupInfo) return;

//         try {
//             await Promise.all(
//                 memberIds.map(uid =>
//                     axios.post(
//                         `${API_URL}api/chatgroup/joinGroup/${announcementGroupInfo._id}/${uid}`
//                     )
//                 )
//             );
//         } catch (error) {
//             console.error('Failed to join announcement group:', error);
//         }
//     }, [API_URL, announcementGroupInfo, community]);

//     const removeFromAnnouncementGroup = useCallback(async (memberIds) => {
//         if (!community?.annoucementGroup || !announcementGroupInfo) return;

//         try {
//             await Promise.all(
//                 memberIds.map(uid =>
//                     axios.put(
//                         `${API_URL}api/chatgroup/removeMember/${announcementGroupInfo._id}/${uid}`
//                     )
//                 )
//             );
//         } catch (error) {
//             console.error('Failed to remove from announcement group:', error);
//         }
//     }, [API_URL, announcementGroupInfo, community]);

//     const addMembersToCommunity = useCallback(async (memberIds) => {
//         try {
//             const existingMembers = members.map(m => m._id);
//             const membersToAdd = memberIds.filter(id => !existingMembers.includes(id));

//             if (membersToAdd.length > 0) {
//                 await Promise.all(
//                     membersToAdd.map(uid =>
//                         axios.post(
//                             `${API_URL}api/community/addMember/${communityId}/${uid}`
//                         )
//                     )
//                 );
//                 await joinAnnouncementGroup(membersToAdd);
//             }
//         } catch (error) {
//             console.error('Failed to add members to community:', error);
//             throw error;
//         }
//     }, [API_URL, communityId, joinAnnouncementGroup, members]);

//     const handleAddGroup = useCallback(async (gid, type) => {
//         if (addingGroup) return;
//         setAddingGroup(true);

//         try {
//             await axios.post(`${API_URL}api/community/addGroup/${communityId}`, {
//                 gid,
//                 type,
//             });

//             const memberIds = await fetchGroupMembers(gid, type);
//             if (memberIds.length > 0) {
//                 await addMembersToCommunity(memberIds);
//             }

//             alert('Group and its members added to community!');
//             fetchCommunity();
//             fetchCommunityGroups();
//             fetchGroups();
//         } catch (err) {
//             console.error(err);
//             alert('Failed to add group.');
//         } finally {
//             setAddingGroup(false);
//         }
//     }, [API_URL, addingGroup, communityId, fetchCommunity, fetchCommunityGroups, fetchGroupMembers, addMembersToCommunity, fetchGroups]);

//     const removeMembersFromCommunity = useCallback(async (memberIds) => {
//         try {
//             const membersToRemove = memberIds.filter(id => !admins.includes(id));
//             if (membersToRemove.length > 0) {
//                 await Promise.all(
//                     membersToRemove.map(uid =>
//                         axios.put(
//                             `${API_URL}api/community/leaveCommunity/${communityId}/${uid}`
//                         )
//                     )
//                 );
//                 await removeFromAnnouncementGroup(membersToRemove);
//             }
//         } catch (error) {
//             console.error('Failed to remove members from community:', error);
//             throw error;
//         }
//     }, [API_URL, admins, communityId, removeFromAnnouncementGroup]);

//     const handleRemoveGroup = useCallback(async (groupId, type) => {
//         if (removingGroup) return;
//         setRemovingGroup(true);

//         try {
//             const memberIds = await fetchGroupMembers(groupId, type);
//             if (memberIds.length > 0) {
//                 await removeMembersFromCommunity(memberIds);
//             }

//             await axios.post(`${API_URL}api/community/removeGroup/${communityId}`, {
//                 type,
//                 gid: groupId,
//             });

//             alert('Group removed from community!');
//             fetchCommunity();
//             fetchCommunityGroups();
//         } catch (err) {
//             console.error(err);
//             alert('Failed to remove group.');
//         } finally {
//             setRemovingGroup(false);
//         }
//     }, [API_URL, communityId, fetchGroupMembers, fetchCommunity, fetchCommunityGroups, removeMembersFromCommunity, removingGroup]);

//     const navigateToChat = useCallback((cid, chatName) => {
//         navigate(`/chat/${cid}`, {
//             state: {
//                 participant: 3,
//                 chatName,
//                 isGroup: true,
//             }
//         });
//     }, [navigate]);

//     const navigateToGroup = useCallback((gid, imgUrl, name) => {
//         navigate(`/group/${gid}`, {
//             state: {
//                 imgUrl,
//                 name,
//             }
//         });
//     }, [navigate]);

//     const makeAdmin = useCallback(async (uid) => {
//         try {
//             await axios.post(`${API_URL}api/community/addAdmins/${communityId}`, {
//                 admins: [uid],
//             });
//             fetchCommunity();
//             fetchCommunityMembers();
//         } catch (err) {
//             alert('Failed to add admin');
//         }
//     }, [API_URL, communityId, fetchCommunity, fetchCommunityMembers]);

//     const removeAdmin = useCallback(async (uid) => {
//         try {
//             await axios.post(
//                 `${API_URL}api/community/removeAdmins/${communityId}`,
//                 { admins: [uid] }
//             );
//             fetchCommunity();
//             fetchCommunityMembers();
//         } catch (err) {
//             alert('Failed to remove admin');
//         }
//     }, [API_URL, communityId, fetchCommunity, fetchCommunityMembers]);

//     // Render functions
//     const renderGroup = useCallback((item, type) => (
//         <div
//             className="group-card"
//             onClick={() => handleAddGroup(item._id, type)}
//             disabled={addingGroup}
//         >
//             <img
//                 // src={`${IMG_BASE_URL}${item.imgUrl}`}
//                 alt={item.name}
//                 className="group-img"
//             />
//             <div className="group-name">{item.name}</div>
//             <span className="add-icon">+</span>
//             {addingGroup && <div className="loading-indicator"></div>}
//         </div>
//     ), [handleAddGroup, addingGroup]);

//     const renderChatGroup = useCallback((item, type) => {
//         const groupInfo = item.groupInfo || {};
//         return (
//             <div
//                 className="group-card"
//                 onClick={() => handleAddGroup(item.groupInfo._id, type)}
//                 disabled={addingGroup}
//             >
//                 <img
//                     // src={groupInfo.imgUrl ? `${IMG_BASE_URL}${groupInfo.imgUrl}` : ''}
//                     alt={groupInfo.name || 'Unnamed Group'}
//                     className="group-img"
//                 />
//                 <div className="group-name">{groupInfo.name || 'Unnamed Group'}</div>
//                 <span className="add-icon">+</span>
//                 {addingGroup && <div className="loading-indicator"></div>}
//             </div>
//         );
//     }, [handleAddGroup, addingGroup]);

//     const renderIncludedGroup = useCallback((item) => {
//         const groupType = item.type === 'chat' ? 'chatgroup' : 'postgroup';

//         const handlePress = () => {
//             if (item.type === 'chat') {
//                 const chatId = typeof item.chat === 'string' ? item.chat : item.chat?._id || item._id;
//                 navigateToChat(chatId, item.name);
//             } else {
//                 navigateToGroup(item._id, item.imgUrl || '', item.name || 'Unnamed Group');
//             }
//         };

//         return (
//             <div className="included-group-card" onClick={handlePress}>
//                 <img
//                     // src={`${IMG_BASE_URL}${item.imgUrl || ''}`}
//                     alt={item.name || 'Unnamed Group'}
//                     className="included-group-img"
//                 />
//                 <div className="included-group-info">
//                     <div className="included-group-name">{item.name || 'Unnamed Group'}</div>
//                     <div className="included-group-type">
//                         {item.type === 'chat' ? 'Chat Group' : 'Post Group'}
//                     </div>
//                 </div>
//                 <button
//                     className="remove-group-button"
//                     onClick={(e) => {
//                         e.stopPropagation();
//                         handleRemoveGroup(item._id, groupType);
//                     }}
//                     disabled={removingGroup}
//                 >
//                     {removingGroup ? '...' : '×'}
//                 </button>
//             </div>
//         );
//     }, [handleRemoveGroup, navigateToChat, navigateToGroup, removingGroup]);

//     const renderAllGroupItem = useCallback((item, type) => {
//         const handlePress = async () => {
//             if (type === 'chat') {
//                 const res = await axios.get(
//                     `${API_URL}api/chatgroup/getGroupChat/${item._id}/${userId}`
//                 );
//                 navigateToChat(res.data.chat._id, item.name);
//             } else {
//                 navigateToGroup(item._id, item.imgUrl || '', item.name || 'Unnamed Group');
//             }
//         };

//         return (
//             <div
//                 className="all-group-item"
//                 onClick={() => {
//                     setAllGroupsModalVisible(false);
//                     handlePress();
//                 }}
//             >
//                 <img
//                     // src={`${IMG_BASE_URL}${item.imgUrl}`}
//                     alt={item.name}
//                     className="all-group-image"
//                 />
//                 <div className="all-group-info">
//                     <div className="all-group-name">{item.name}</div>
//                     <div className="all-group-type">
//                         {type === 'chat' ? 'Chat Group' : 'Post Group'}
//                     </div>
//                 </div>
//                 <span className="chevron-right">→</span>
//             </div>
//         );
//     }, [API_URL, navigateToChat, navigateToGroup, userId]);

//     const renderMember = useCallback((item) => {
//         const isAdmin = admins?.includes(item._id);

//         const handleMemberClick = () => {
//             if (!admins?.includes(userId)) return;

//             if (typeof window !== 'undefined') {
//                 const confirmMessage = `Do you want to ${isAdmin ? 'remove from' : 'make'} admin?`;
//                 const confirmAction = window.confirm(confirmMessage);

//                 if (confirmAction) {
//                     isAdmin ? removeAdmin(item._id) : makeAdmin(item._id);
//                 }
//             } else {
//                 console.log("Confirmation not available in this environment");
//             }
//         };

//         return (
//             <div className="member-card" onClick={handleMemberClick}>
//                 <div className="member-info">
//                     <img
//                         // src={`${IMG_BASE_URL}${item.imgUrl || ''}`}
//                         alt={item.name || 'Unknown User'}
//                         className="member-avatar"
//                     />
//                     <div>
//                         <div className="member-name">{item.name || 'Unknown User'}</div>
//                         <div className="member-status">
//                             {isAdmin ? 'Admin' : 'Member'}
//                         </div>
//                     </div>
//                 </div>
//                 {isAdmin && <span className="star-icon">★</span>}
//             </div>
//         );
//     }, [admins, makeAdmin, removeAdmin, userId]);

//     if (!community) {
//         return (
//             <div className="loading-container">
//                 <div className="loading-text">Loading...</div>
//             </div>
//         );
//     }

//     return (
//         <div className="community-view-container">
//             <Sidebar />
//             {/* Header */}
//             <div className="header">
//                 <button onClick={() => navigate(-1)} className="back-button">
//                     ←
//                 </button>
//                 <div className="header-title">Community Info</div>
//                 <button onClick={() => setModalType('members')} className="people-button">
//                     👥
//                 </button>
//             </div>

//             {/* Main Content */}
//             <div className="content">
//                 <div className="community-header">
//                     <img
//                         // src={`${IMG_BASE_URL}${community.imgUrl}`}
//                         alt={community.title}
//                         className="community-image"
//                     />
//                     <div className="community-title">{community.title}</div>
//                     <div className="community-subtitle">
//                         {community.memberCount || 0} members
//                     </div>
//                 </div>

//                 {community.lastMessage && (
//                     <div className="announcement-box">
//                         <div className="announcement-header">
//                             <div className="announcement-title">Announcement</div>
//                             <span className="announcement-icon">📢</span>
//                         </div>
//                         <div className="announcement-content">
//                             {community.lastMessage.content}
//                         </div>
//                     </div>
//                 )}

//                 <div className="section">
//                     <div className="section-title">About</div>
//                     <div className="section-content">{community.aboutCommunity}</div>
//                 </div>

//                 <div
//                     className="included-group-card announcement-group"
//                     onClick={() => navigateToChat(community.annoucementGroup, 'Announcement')}
//                 >
//                     <div className="icon-container">
//                         📢
//                     </div>
//                     <div className="included-group-info">
//                         <div className="included-group-name">Announcement</div>
//                         <div className="included-group-type">Announcement group</div>
//                     </div>
//                 </div>

//                 {community.includedGroups?.length > 0 && (
//                     <div className="section">
//                         <div className="section-header">
//                             <div className="section-title">Included Groups</div>
//                             <button
//                                 onClick={fetchAllCommunityGroups}
//                                 disabled={loadingAllGroups}
//                                 className="view-all-button"
//                             >
//                                 {loadingAllGroups ? 'Loading...' : 'View All'}
//                             </button>
//                         </div>
//                         <div className="included-groups-list">
//                             {community.includedGroups.slice(0, 3).map(item => (
//                                 <div key={item._id}>
//                                     {renderIncludedGroup(item)}
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 )}

//                 <div className="actions-container">
//                     <button
//                         className="action-button"
//                         onClick={() => navigate(`/edit-community/${communityId}`)}
//                     >
//                         <span className="action-icon">✏️</span>
//                         <span className="action-text">Edit</span>
//                     </button>

//                     <button
//                         className="action-button"
//                         onClick={fetchGroups}
//                         disabled={addingGroup || removingGroup}
//                     >
//                         <span className="action-icon">👥</span>
//                         <span className="action-text">Add Groups</span>
//                     </button>
//                 </div>
//             </div>

//             {/* Modals */}
//             {modalType === 'addGroups' && (
//                 <div className="modal">
//                     <div className="modal-header">
//                         <button onClick={() => setModalType(null)} className="modal-back-button">
//                             ←
//                         </button>
//                         <div className="modal-title">Add Groups</div>
//                         <div className="spacer"></div>
//                     </div>

//                     <div className="modal-section-title">Your Post Groups</div>
//                     <div className="group-list horizontal-scroll">
//                         {postGroups.map(item => (
//                             <div key={item._id}>
//                                 {renderGroup(item, 'postgroup')}
//                             </div>
//                         ))}
//                     </div>

//                     <div className="modal-section-title">Your Chat Groups</div>
//                     <div className="group-list horizontal-scroll">
//                         {chatGroups.map(item => (
//                             <div key={item.chat._id}>
//                                 {renderChatGroup(item, 'chatgroup')}
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             )}

//             {modalType === 'members' && (
//                 <div className="modal">
//                     <div className="modal-header">
//                         <button onClick={() => setModalType(null)} className="modal-back-button">
//                             ←
//                         </button>
//                         <div className="modal-title">Community Members</div>
//                         <div className="spacer"></div>
//                     </div>

//                     {loadingMembers ? (
//                         <div className="loading-container">
//                             <div className="spinner"></div>
//                         </div>
//                     ) : (
//                         <div className="member-list">
//                             {members.map(item => (
//                                 <div key={item._id}>
//                                     {renderMember(item)}
//                                 </div>
//                             ))}
//                         </div>
//                     )}
//                 </div>
//             )}

//             {allGroupsModalVisible && (
//                 <div className="modal">
//                     <div className="modal-header">
//                         <button onClick={() => setAllGroupsModalVisible(false)} className="modal-back-button">
//                             ←
//                         </button>
//                         <div className="modal-title">All Community Groups</div>
//                         <div className="spacer"></div>
//                     </div>

//                     {loadingAllGroups ? (
//                         <div className="loading-container">
//                             <div className="spinner"></div>
//                         </div>
//                     ) : (
//                         <div className="modal-content">
//                             <div className="modal-section-title">Chat Groups</div>
//                             <div className="all-groups-list">
//                                 {allGroups.chatGroups.map(item => (
//                                     <div key={item._id}>
//                                         {renderAllGroupItem(item, 'chat')}
//                                     </div>
//                                 ))}
//                             </div>

//                             <div className="modal-section-title">Post Groups</div>
//                             <div className="all-groups-list">
//                                 {allGroups.postGroups.map(item => (
//                                     <div key={item._id}>
//                                         {renderAllGroupItem(item, 'post')}
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>
//                     )}
//                 </div>
//             )}
//         </div>
//     );
// };

// export default CommunityView;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_URL from '../../Config';
import { useParams, useNavigate } from 'react-router-dom';
import { Modal, Button, List, Avatar, Card, Space, Divider, Spin, message } from 'antd';
import {
    ArrowLeftOutlined,
    TeamOutlined,
    EditOutlined,
    UsergroupAddOutlined,
    PlusOutlined,
    CloseOutlined,
    StarOutlined,
    RightOutlined,
    NotificationOutlined,
    BulbOutlined
} from '@ant-design/icons';
import './Settings.css';
import IMG_URL from '../../imagurl';
import Sidebar from '../Sidebar/Sidebar';

const userId = localStorage.getItem("userId");

const CommunityView = () => {
    const { communityId } = useParams();
    const navigate = useNavigate();
    const [community, setCommunity] = useState(null);
    const [modalType, setModalType] = useState(null);
    const [postGroups, setPostGroups] = useState([]);
    const [chatGroups, setChatGroups] = useState([]);
    const [members, setMembers] = useState([]);
    const [allGroupsModalVisible, setAllGroupsModalVisible] = useState(false);
    const [allGroups, setAllGroups] = useState({ chatGroups: [], postGroups: [] });
    const [loadingAllGroups, setLoadingAllGroups] = useState(false);
    const [communityGroups, setCommunityGroups] = useState({ chat: [], post: [] });
    const [addingGroup, setAddingGroup] = useState(false);
    const [removingGroup, setRemovingGroup] = useState(false);
    const [announcementGroupInfo, setAnnouncementGroupInfo] = useState(null);
    const [loadingMembers, setLoadingMembers] = useState(false);
    const [admins, setAdmins] = useState([]);

    useEffect(() => {
        fetchCommunity();
        fetchCommunityGroups();
        fetchCommunityMembers();
        fetchCommunityAdmins();
    }, [communityId]);

    const fetchCommunity = async () => {
        try {
            const res = await axios.get(
                `${API_URL}api/community/getCommunity/${communityId}/${userId}`,
            );
            setCommunity(res.data);
            if (res.data.annoucementGroup) {
                fetchAnnouncementGroupInfo(res.data.annoucementGroup);
            }
        } catch (error) {
            console.error('Failed to fetch community:', error);
        }
    };

    const fetchAnnouncementGroupInfo = async chatId => {
        try {
            const response = await axios.get(
                `${API_URL}api/chatgroup/getGroupByChatId/${chatId}`,
            );
            setAnnouncementGroupInfo(response.data);
        } catch (error) {
            console.error('Failed to fetch announcement group info:', error);
        }
    };

    const fetchCommunityGroups = async () => {
        try {
            const response = await axios.get(
                `${API_URL}api/community/getCommunityGroups/${communityId}`,
            );
            setCommunityGroups({
                chat: response.data.chatGroups.map(g => g._id),
                post: response.data.postGroups.map(g => g._id),
            });
        } catch (error) {
            console.error('Failed to fetch community groups:', error);
        }
    };

    const fetchCommunityMembers = async () => {
        setLoadingMembers(true);
        try {
            const response = await axios.get(
                `${API_URL}api/community/getMembers/${communityId}`,
            );

            const memberIds = Array.isArray(response.data.members)
                ? response.data.members
                : [];

            const memberDetails = await Promise.all(
                memberIds.map(id => {
                    const memberId = typeof id === 'object' ? id._id || id.id || '' : id;
                    if (!memberId || typeof memberId !== 'string') {
                        return { _id: 'invalid', name: 'Unknown User', imgUrl: '' };
                    }

                    return axios
                        .get(`${API_URL}api/user/getUserData/${memberId}`)
                        .then(res => res.data)
                        .catch(err => {
                            console.error(`Failed to fetch user ${memberId}:`, err);
                            return { _id: memberId, name: 'Unknown User', imgUrl: '' };
                        });
                }),
            );

            const validMembers = memberDetails.filter(
                m => m && m._id && m._id !== 'invalid',
            );
            setMembers(validMembers);
            return validMembers.map(m => m._id);
        } catch (error) {
            console.error('Failed to fetch community members:', error);
            return [];
        } finally {
            setLoadingMembers(false);
        }
    };

    const fetchCommunityAdmins = async () => {
        try {
            const response = await axios.get(
                `${API_URL}api/community/getAdmins/${communityId}`,
            );
            const admins = response.data.admins.map(a => a._id);
            setAdmins(admins);
            return response.data.admins.map(a => a._id);
        } catch (error) {
            console.error('Failed to fetch community admins:', error);
            return [];
        }
    };

    const fetchGroups = async () => {
        try {
            const [postRes, chatRes] = await Promise.all([
                axios.get(`${API_URL}api/postgroup/getAllGroups`),
                axios.get(`${API_URL}api/chatgroup/getAllGroupChats/${userId}`),
            ]);

            const adminPosts = postRes.data
                .filter(g =>
                    g.admins?.some(a => (typeof a === 'string' ? a : a._id) === userId),
                )
                .filter(g => !communityGroups.post.includes(g._id));

            const adminChats = chatRes.data
                .filter(g => g.groupInfo?.isAdmin)
                .filter(g => !communityGroups.chat.includes(g.groupInfo._id));

            setPostGroups(adminPosts);
            setChatGroups(adminChats);
            setModalType('addGroups');
        } catch (err) {
            console.error(err);
            message.error('Failed to fetch groups.');
        }
    };

    const fetchAllCommunityGroups = async () => {
        setLoadingAllGroups(true);
        try {
            const response = await axios.get(
                `${API_URL}api/community/getCommunityGroups/${communityId}`,
            );
            setAllGroups(response.data);
            setAllGroupsModalVisible(true);
        } catch (error) {
            console.error('Error fetching all groups:', error);
            message.error('Failed to fetch all groups');
        } finally {
            setLoadingAllGroups(false);
        }
    };

    const fetchGroupMembers = async (gid, type) => {
        try {
            const endpoint =
                type === 'postgroup'
                    ? `${API_URL}api/postgroup/getGroupMembers/${gid}`
                    : `${API_URL}api/chatgroup/getMembers/${gid}`;

            const response = await axios.get(endpoint);
            return type === 'postgroup'
                ? response.data.members
                : response.data.map(m => m.id);
        } catch (error) {
            console.error(`Failed to fetch ${type} members:`, error);
            return [];
        }
    };

    const joinAnnouncementGroup = async memberIds => {
        if (!community?.annoucementGroup || !announcementGroupInfo) return;

        try {
            await Promise.all(
                memberIds.map(uid =>
                    axios.post(
                        `${API_URL}api/chatgroup/joinGroup/${announcementGroupInfo._id}/${uid}`,
                    ),
                ),
            );
        } catch (error) {
            console.error('Failed to join announcement group:', error);
        }
    };

    const removeFromAnnouncementGroup = async memberIds => {
        if (!community?.annoucementGroup || !announcementGroupInfo) return;

        try {
            await Promise.all(
                memberIds.map(uid =>
                    axios.put(
                        `${API_URL}api/chatgroup/removeMember/${announcementGroupInfo._id}/${uid}`,
                    ),
                ),
            );
        } catch (error) {
            console.error('Failed to remove from announcement group:', error);
        }
    };

    const addMembersToCommunity = async memberIds => {
        try {
            const existingMembers = await fetchCommunityMembers();
            const membersToAdd = memberIds.filter(
                id => !existingMembers.includes(id),
            );

            if (membersToAdd.length > 0) {
                await Promise.all(
                    membersToAdd.map(uid =>
                        axios.post(
                            `${API_URL}api/community/addMember/${communityId}/${uid}`,
                        ),
                    ),
                );

                await joinAnnouncementGroup(membersToAdd);
            }
        } catch (error) {
            console.error('Failed to add members to community:', error);
            throw error;
        }
    };

    const handleAddGroup = async (gid, type) => {
        if (addingGroup) return;
        setAddingGroup(true);

        try {
            await axios.post(`${API_URL}api/community/addGroup/${communityId}`, {
                gid,
                type,
            });

            const memberIds = await fetchGroupMembers(gid, type);

            if (memberIds.length > 0) {
                await addMembersToCommunity(memberIds);
            }

            message.success('Group and its members added to community!');
            fetchCommunity();
            fetchCommunityGroups();
            fetchGroups();
        } catch (err) {
            console.error(err);
            message.error('Failed to add group.');
        } finally {
            setAddingGroup(false);
        }
    };

    const removeMembersFromCommunity = async memberIds => {
        try {
            const adminIds = await fetchCommunityAdmins();
            const membersToRemove = memberIds.filter(id => !adminIds.includes(id));

            if (membersToRemove.length > 0) {
                await Promise.all(
                    membersToRemove.map(uid =>
                        axios.put(
                            `${API_URL}api/community/leaveCommunity/${communityId}/${uid}`,
                        ),
                    ),
                );

                await removeFromAnnouncementGroup(membersToRemove);
            }
        } catch (error) {
            console.error('Failed to remove members from community:', error);
            throw error;
        }
    };

    const handleRemoveGroup = async (groupId, type) => {
        if (removingGroup) return;
        setRemovingGroup(true);

        try {
            const memberIds = await fetchGroupMembers(groupId, type);

            if (memberIds.length > 0) {
                await removeMembersFromCommunity(memberIds);
            }

            await axios.post(`${API_URL}api/community/removeGroup/${communityId}`, {
                type,
                gid: groupId,
            });

            message.success('Group removed from community!');
            fetchCommunity();
            fetchCommunityGroups();
        } catch (err) {
            console.error(err);
            message.error('Failed to remove group.');
        } finally {
            setRemovingGroup(false);
        }
    };

    const navigateToChat = (cid, uid) => {
        navigate(`/chat/${cid}`, { state: { uid } });
    };

    const renderGroup = (item, type) => (
        <Card
            hoverable
            className="group-card"
            onClick={() => handleAddGroup(item._id, type)}
            actions={[
                <PlusOutlined key="add" style={{ color: '#25D366' }} />,
            ]}
            cover={
                <img
                    alt={item.name}
                    src={IMG_URL + item.imgUrl}
                    className="group-img"
                />
            }
        >
            <Card.Meta title={item.name} />
            {addingGroup && <Spin size="small" style={{ position: 'absolute', top: 5, right: 5 }} />}
        </Card>
    );

    const renderChatGroup = (item, type) => {
        const groupInfo = item.groupInfo || {};
        return (
            <Card
                hoverable
                className="group-card"
                onClick={() => handleAddGroup(item.groupInfo._id, type)}
                actions={[
                    <PlusOutlined key="add" style={{ color: '#25D366' }} />,
                ]}
                cover={
                    <img
                        alt={groupInfo.name || 'Unnamed Group'}
                        src={groupInfo.imgUrl ? IMG_URL + groupInfo.imgUrl : ''}
                        className="group-img"
                    />
                }
            >
                <Card.Meta
                    title={groupInfo.name || 'Unnamed Group'}
                    description={groupInfo.description || ''}
                />
                {addingGroup && <Spin size="small" style={{ position: 'absolute', top: 5, right: 5 }} />}
            </Card>
        );
    };

    const renderIncludedGroup = (item) => {
        const groupType = item.type === 'chat' ? 'chatgroup' : 'postgroup';
        return (
            <List.Item
                className="included-group-card"
                actions={[
                    <Button
                        type="text"
                        icon={<CloseOutlined />}
                        danger
                        onClick={() => handleRemoveGroup(item._id, groupType)}
                        loading={removingGroup}
                    />
                ]}
            >
                <List.Item.Meta
                    avatar={<Avatar src={IMG_URL + item.imgUrl} />}
                    title={item.name}
                    description={`${item.type} group`}
                />
            </List.Item>
        );
    };

    const renderAllGroupItem = (item, type) => {
        return (
            <List.Item
                className="all-group-item"
                onClick={() => {
                    setAllGroupsModalVisible(false);
                    if (type === 'chat') {
                        navigate(`/ChatArea/${item._id}`, { state: { uid: userId } });
                    } else {
                        navigate(`/post-group/${item._id}`, { state: { rId: userId } });
                    }
                }}
            >
                <List.Item.Meta
                    avatar={<Avatar src={IMG_URL + item.imgUrl} />}
                    title={item.name}
                    description={type === 'chat' ? 'Chat Group' : 'Post Group'}
                />
                <RightOutlined />
            </List.Item>
        );
    };

    const renderMember = (item) => {
        const isAdmin = admins?.includes(item._id);
        return (
            <List.Item
                className="member-card"
                onClick={() => {
                    if (admins?.includes(userId)) {
                        Modal.confirm({
                            title: 'Manage Member',
                            content: `Do you want to ${isAdmin ? 'remove from' : 'make'} admin?`,
                            onOk: () => isAdmin ? removeAdmin(item._id) : makeAdmin(item._id),
                        });
                    }
                }}
            >
                <List.Item.Meta
                    avatar={<Avatar src={IMG_URL + (item.imgUrl || '')} />}
                    title={item.name || 'Unknown User'}
                    description={isAdmin ? 'Admin' : 'Member'}
                />
                {isAdmin && <StarOutlined style={{ color: '#FFD700' }} />}
            </List.Item>
        );
    };

    const makeAdmin = async uid => {
        try {
            await axios.post(`${API_URL}api/community/addAdmins/${communityId}`, {
                admins: [uid],
            });
            fetchCommunity();
            fetchCommunityMembers();
        } catch (err) {
            message.error('Failed to add admin');
        }
    };

    const removeAdmin = async uid => {
        try {
            await axios.post(
                `${API_URL}api/community/removeAdmins/${communityId}`,
                { admins: [uid] },
            );
            fetchCommunity();
            fetchCommunityMembers();
        } catch (err) {
            message.error('Failed to remove admin');
        }
    };

    if (!community) {
        return (
            <div className="loading-container">
                <Spin size="large" />
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className="community-container">
            <Sidebar />
            <div className="community-header">
                <Button
                    type="text"
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate(-1)}
                />
                <h2>Community Info</h2>
                <Button
                    type="text"
                    icon={<TeamOutlined />}
                    onClick={() => setModalType('members')}
                />
            </div>

            <div className="community-content">
                <div className="community-profile">
                    <Avatar
                        src={`${IMG_URL}${community.imgUrl}`}
                        size={120}
                        className="community-avatar"
                    />
                    <h1>{community.title}</h1>
                    <p>{community.memberCount || 0} members</p>
                </div>

                {community.lastMessage && (
                    <Card className="announcement-box">
                        <div className="announcement-header">
                            <h3>Announcement</h3>
                            <NotificationOutlined />
                        </div>
                        <p>{community.lastMessage.content}</p>
                    </Card>
                )}

                <Card className="section">
                    <h3>About</h3>
                    <p>{community.aboutCommunity}</p>
                </Card>

                <Card
                    hoverable
                    className="included-group-card"
                    onClick={() => navigateToChat(community.annoucementGroup, userId)}
                >
                    <div className="icon-container">
                        <BulbOutlined />
                    </div>
                    <div className="included-group-info">
                        <h4>Announcement</h4>
                        <p>Announcement group</p>
                    </div>
                </Card>

                {community.includedGroups?.length > 0 && (
                    <Card className="section">
                        <div className="section-header">
                            <h3>Included Groups</h3>
                            <Button
                                type="link"
                                onClick={fetchAllCommunityGroups}
                                loading={loadingAllGroups}
                            >
                                {loadingAllGroups ? 'Loading...' : 'View All'}
                            </Button>
                        </div>
                        <List
                            dataSource={community.includedGroups.slice(0, 3)}
                            renderItem={renderIncludedGroup}
                        />
                    </Card>
                )}

                <div className="actions-container">
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => navigate(`/edit-community/${communityId}`, { state: { userId } })}
                    >
                        Edit
                    </Button>
                    <Button
                        icon={<UsergroupAddOutlined />}
                        onClick={fetchGroups}
                        loading={addingGroup || removingGroup}
                    >
                        Add Groups
                    </Button>
                </div>
            </div>

            <Modal
                title="Add Groups"
                visible={modalType === 'addGroups'}
                onCancel={() => setModalType(null)}
                footer={null}
            >
                <h4>Your Post Groups</h4>
                <div className="group-list">
                    {postGroups.map(item => renderGroup(item, 'postgroup'))}
                </div>

                <Divider />

                <h4>Your Chat Groups</h4>
                <div className="group-list">
                    {chatGroups.map(item => renderChatGroup(item, 'chatgroup'))}
                </div>
            </Modal>

            <Modal
                title="Community Members"
                visible={modalType === 'members'}
                onCancel={() => setModalType(null)}
                footer={null}
            >
                {loadingMembers ? (
                    <div className="loading-container">
                        <Spin size="large" />
                    </div>
                ) : (
                    <List
                        dataSource={members}
                        renderItem={renderMember}
                    />
                )}
            </Modal>

            <Modal
                title="All Community Groups"
                visible={allGroupsModalVisible}
                onCancel={() => setAllGroupsModalVisible(false)}
                footer={null}
                width={800}
            >
                {loadingAllGroups ? (
                    <div className="loading-container">
                        <Spin size="large" />
                    </div>
                ) : (
                    <>
                        <h3>Chat Groups</h3>
                        <List
                            dataSource={allGroups.chatGroups}
                            renderItem={item => renderAllGroupItem(item, 'chat')}
                        />

                        <Divider />

                        <h3>Post Groups</h3>
                        <List
                            dataSource={allGroups.postGroups}
                            renderItem={item => renderAllGroupItem(item, 'post')}
                        />
                    </>
                )}
            </Modal>
        </div>
    );
};

export default CommunityView;