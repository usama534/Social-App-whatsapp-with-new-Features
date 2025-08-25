// import React, { useState, useRef, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { Plus, X, Users, UserPlus, Check, Search } from 'lucide-react';
// import API_URL from '../../Config';

// const CreateGroupChat = ({ onClose, onCreateSuccess }) => {
//     const navigate = useNavigate();
//     const userId = localStorage.getItem('userId');
//     const fileInputRef = useRef(null);

//     const [formData, setFormData] = useState({
//         name: '',
//         aboutGroup: '',
//         allowChatting: true
//     });
//     const [avatar, setAvatar] = useState(null);
//     const [avatarPreview, setAvatarPreview] = useState(null);
//     const [selectedMembers, setSelectedMembers] = useState([]);
//     const [showAddMembers, setShowAddMembers] = useState(false);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState('');

//     // For member search functionality
//     const [searchQuery, setSearchQuery] = useState('');
//     const [availableMembers, setAvailableMembers] = useState([]);
//     const [searchLoading, setSearchLoading] = useState(false);

//     const handleInputChange = (e) => {
//         const { name, value, type, checked } = e.target;
//         setFormData(prev => ({
//             ...prev,
//             [name]: type === 'checkbox' ? checked : value
//         }));
//     };

//     const handleAvatarChange = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             setAvatar(file);
//             setAvatarPreview(URL.createObjectURL(file));
//         }
//     };

//     const triggerFileInput = () => {
//         fileInputRef.current.click();
//     };

//     // Fetch available members to add
//     const searchMembers = async () => {
//         if (searchQuery.length < 2) return;

//         setSearchLoading(true);
//         try {
//             const response = await axios.get(`${API_URL}api/user/searchUsers`, {
//                 params: { query: searchQuery }
//             });
//             setAvailableMembers(response.data);
//         } catch (err) {
//             console.error('Error searching members:', err);
//             setError('Failed to search members');
//         } finally {
//             setSearchLoading(false);
//         }
//     };

//     const toggleMemberSelection = (member) => {
//         setSelectedMembers(prev =>
//             prev.some(m => m._id === member._id)
//                 ? prev.filter(m => m._id !== member._id)
//                 : [...prev, member]
//         );
//     };

//     const createGroup = async () => {
//         if (!formData.name.trim()) {
//             setError('Group name is required');
//             return;
//         }

//         setLoading(true);
//         setError('');

//         try {
//             const formDataToSend = new FormData();
//             formDataToSend.append('name', formData.name);
//             formDataToSend.append('aboutGroup', formData.aboutGroup);
//             formDataToSend.append('allowChatting', formData.allowChatting);
//             if (avatar) {
//                 formDataToSend.append('group_avatar', avatar);
//             }

//             // Create the group
//             const response = await axios.post(
//                 `${API_URL}api/chatgroup/newGroupChat/${userId}`,
//                 formDataToSend,
//                 { headers: { 'Content-Type': 'multipart/form-data' } }
//             );

//             if (response.data.id) {
//                 const groupId = response.data.id;

//                 // Add members if any were selected
//                 if (selectedMembers.length > 0) {
//                     await axios.post(`${API_URL}api/chatgroup/addGroupAdmins/${groupId}`, {
//                         admins: selectedMembers.map(m => m._id)
//                     });
//                 }

//                 if (onCreateSuccess) {
//                     onCreateSuccess();
//                 } else {
//                     navigate(`/group/${groupId}`);
//                 }
//             }
//         } catch (err) {
//             console.error('Error creating group:', err);
//             setError(err.response?.data?.message || 'Failed to create group');
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="create-group-container">
//             {showAddMembers ? (
//                 <div className="add-members-modal">
//                     <div className="modal-header">
//                         <h3>Add Members</h3>
//                         <button className="close-btn" onClick={() => setShowAddMembers(false)}>
//                             <X size={20} />
//                         </button>
//                     </div>

//                     <div className="search-container">
//                         <div className="search-input-wrapper">
//                             <Search size={18} className="search-icon" />
//                             <input
//                                 type="text"
//                                 placeholder="Search members..."
//                                 value={searchQuery}
//                                 onChange={(e) => setSearchQuery(e.target.value)}
//                                 onKeyPress={(e) => e.key === 'Enter' && searchMembers()}
//                             />
//                             <button
//                                 className="search-btn"
//                                 onClick={searchMembers}
//                                 disabled={searchLoading || searchQuery.length < 2}
//                             >
//                                 {searchLoading ? 'Searching...' : 'Search'}
//                             </button>
//                         </div>
//                     </div>

//                     <div className="members-list">
//                         {availableMembers.length > 0 ? (
//                             availableMembers.map(member => (
//                                 <div
//                                     key={member._id}
//                                     className={`member-item ${selectedMembers.some(m => m._id === member._id) ? 'selected' : ''}`}
//                                     onClick={() => toggleMemberSelection(member)}
//                                 >
//                                     <div className="member-avatar">
//                                         {member.name.charAt(0).toUpperCase()}
//                                     </div>
//                                     <div className="member-info">
//                                         <div className="member-name">{member.name}</div>
//                                         <div className="member-email">{member.email}</div>
//                                     </div>
//                                     {selectedMembers.some(m => m._id === member._id) && (
//                                         <Check size={20} className="check-icon" />
//                                     )}
//                                 </div>
//                             ))
//                         ) : (
//                             <div className="empty-state">
//                                 {searchQuery ? 'No members found' : 'Search for members to add'}
//                             </div>
//                         )}
//                     </div>

//                     <div className="selected-count">
//                         {selectedMembers.length} member(s) selected
//                     </div>

//                     <div className="modal-actions">
//                         <button
//                             className="cancel-btn"
//                             onClick={() => setShowAddMembers(false)}
//                         >
//                             Cancel
//                         </button>
//                         <button
//                             className="confirm-btn"
//                             onClick={() => setShowAddMembers(false)}
//                         >
//                             Done
//                         </button>
//                     </div>
//                 </div>
//             ) : (
//                 <>
//                     <div className="create-group-header">
//                         <h2>Create New Group</h2>
//                         <button className="close-btn" onClick={onClose}>
//                             <X size={24} />
//                         </button>
//                     </div>

//                     <div className="avatar-section">
//                         <div className="avatar-upload" onClick={triggerFileInput}>
//                             {avatarPreview ? (
//                                 <img src={avatarPreview} alt="Group avatar" className="avatar-preview" />
//                             ) : (
//                                 <div className="avatar-placeholder">
//                                     <Plus size={32} />
//                                 </div>
//                             )}
//                         </div>
//                         <input
//                             type="file"
//                             ref={fileInputRef}
//                             onChange={handleAvatarChange}
//                             accept="image/*"
//                             style={{ display: 'none' }}
//                         />
//                         <p className="avatar-hint">Click to add group photo</p>
//                     </div>

//                     <div className="form-group">
//                         <label htmlFor="name">Group Name *</label>
//                         <input
//                             type="text"
//                             id="name"
//                             name="name"
//                             value={formData.name}
//                             onChange={handleInputChange}
//                             placeholder="Enter group name"
//                             required
//                         />
//                     </div>

//                     <div className="form-group">
//                         <label htmlFor="aboutGroup">Description (Optional)</label>
//                         <textarea
//                             id="aboutGroup"
//                             name="aboutGroup"
//                             value={formData.aboutGroup}
//                             onChange={handleInputChange}
//                             placeholder="What's this group about?"
//                             rows="3"
//                         />
//                     </div>

//                     <div className="form-group checkbox-group">
//                         <input
//                             type="checkbox"
//                             id="allowChatting"
//                             name="allowChatting"
//                             checked={formData.allowChatting}
//                             onChange={handleInputChange}
//                         />
//                         <label htmlFor="allowChatting">Allow members to chat</label>
//                     </div>

//                     <div className="members-section">
//                         <div className="section-header">
//                             <h3>Add Members</h3>
//                             <button
//                                 className="add-members-btn"
//                                 onClick={() => setShowAddMembers(true)}
//                             >
//                                 <UserPlus size={18} />
//                                 <span>Add</span>
//                             </button>
//                         </div>

//                         {selectedMembers.length > 0 ? (
//                             <div className="selected-members">
//                                 {selectedMembers.map(member => (
//                                     <div key={member._id} className="member-tag">
//                                         <span>{member.name}</span>
//                                     </div>
//                                 ))}
//                             </div>
//                         ) : (
//                             <div className="empty-members">
//                                 <Users size={32} />
//                                 <p>No members added yet</p>
//                             </div>
//                         )}
//                     </div>

//                     {error && <div className="error-message">{error}</div>}

//                     <div className="action-buttons">
//                         <button
//                             className="cancel-btn"
//                             onClick={onClose}
//                             disabled={loading}
//                         >
//                             Cancel
//                         </button>
//                         <button
//                             className="create-btn"
//                             onClick={createGroup}
//                             disabled={loading || !formData.name.trim()}
//                         >
//                             {loading ? 'Creating...' : 'Create Group'}
//                         </button>
//                     </div>
//                 </>
//             )}

//             <style jsx>{`
//         .create-group-container {
//           background: white;
//           border-radius: 12px;
//           padding: 24px;
//           max-width: 500px;
//           margin: 0 auto;
//           box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
//           position: relative;
//         }

//         /* Header styles */
//         .create-group-header {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           margin-bottom: 24px;
//         }

//         .create-group-header h2 {
//           font-size: 1.5rem;
//           font-weight: 600;
//           margin: 0;
//         }

//         .close-btn {
//           background: none;
//           border: none;
//           cursor: pointer;
//           color: #666;
//           padding: 4px;
//         }

//         /* Avatar section */
//         .avatar-section {
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           margin-bottom: 24px;
//         }

//         .avatar-upload {
//           width: 120px;
//           height: 120px;
//           border-radius: 50%;
//           background-color: #f5f5f5;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           cursor: pointer;
//           overflow: hidden;
//           margin-bottom: 8px;
//         }

//         .avatar-preview {
//           width: 100%;
//           height: 100%;
//           object-fit: cover;
//         }

//         .avatar-placeholder {
//           color: #999;
//         }

//         .avatar-hint {
//           color: #666;
//           font-size: 0.9rem;
//           margin: 0;
//         }

//         /* Form styles */
//         .form-group {
//           margin-bottom: 20px;
//         }

//         .form-group label {
//           display: block;
//           margin-bottom: 8px;
//           font-weight: 500;
//           color: #333;
//         }

//         .form-group input[type="text"],
//         .form-group textarea {
//           width: 100%;
//           padding: 10px 12px;
//           border: 1px solid #ddd;
//           border-radius: 6px;
//           font-size: 1rem;
//         }

//         .form-group textarea {
//           resize: vertical;
//           min-height: 80px;
//         }

//         .checkbox-group {
//           display: flex;
//           align-items: center;
//         }

//         .checkbox-group input {
//           margin-right: 8px;
//         }

//         /* Members section */
//         .members-section {
//           margin: 24px 0;
//         }

//         .section-header {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           margin-bottom: 12px;
//         }

//         .section-header h3 {
//           margin: 0;
//           font-size: 1.1rem;
//         }

//         .add-members-btn {
//           display: flex;
//           align-items: center;
//           gap: 6px;
//           background: none;
//           border: 1px solid #14AE5C;
//           color: #14AE5C;
//           padding: 6px 12px;
//           border-radius: 20px;
//           cursor: pointer;
//           font-size: 0.9rem;
//         }

//         .selected-members {
//           display: flex;
//           flex-wrap: wrap;
//           gap: 8px;
//           margin-top: 12px;
//         }

//         .member-tag {
//           background: #f0f4ff;
//           padding: 6px 12px;
//           border-radius: 16px;
//           font-size: 0.9rem;
//         }

//         .empty-members {
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           justify-content: center;
//           padding: 20px;
//           background: #f9f9f9;
//           border-radius: 8px;
//           margin-top: 12px;
//           color: #666;
//         }

//         .empty-members p {
//           margin-top: 8px;
//           margin-bottom: 0;
//         }

//         /* Error message */
//         .error-message {
//           color: #e74c3c;
//           background: #fdecea;
//           padding: 12px;
//           border-radius: 6px;
//           margin: 16px 0;
//           font-size: 0.9rem;
//         }

//         /* Action buttons */
//         .action-buttons {
//           display: flex;
//           justify-content: flex-end;
//           gap: 12px;
//           margin-top: 24px;
//         }

//         .cancel-btn {
//           background: #f0f0f0;
//           color: #333;
//           border: none;
//           padding: 10px 20px;
//           border-radius: 6px;
//           cursor: pointer;
//         }

//         .create-btn {
//           background: #14AE5C;
//           color: white;
//           border: none;
//           padding: 10px 20px;
//           border-radius: 6px;
//           cursor: pointer;
//         }

//         .create-btn:disabled {
//           background: #ccc;
//           cursor: not-allowed;
//         }

//         /* Add members modal styles */
//         .add-members-modal {
//           position: absolute;
//           top: 0;
//           left: 0;
//           right: 0;
//           bottom: 0;
//           background: white;
//           padding: 24px;
//           border-radius: 12px;
//           z-index: 10;
//         }

//         .modal-header {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           margin-bottom: 20px;
//         }

//         .modal-header h3 {
//           margin: 0;
//           font-size: 1.3rem;
//         }

//         .search-container {
//           margin-bottom: 20px;
//         }

//         .search-input-wrapper {
//           display: flex;
//           align-items: center;
//           border: 1px solid #ddd;
//           border-radius: 20px;
//           padding: 8px 12px;
//         }

//         .search-icon {
//           color: #999;
//           margin-right: 8px;
//         }

//         .search-input-wrapper input {
//           flex: 1;
//           border: none;
//           outline: none;
//           font-size: 0.95rem;
//         }

//         .search-btn {
//           background: none;
//           border: none;
//           color: #14AE5C;
//           font-weight: 500;
//           cursor: pointer;
//           padding: 4px 8px;
//         }

//         .search-btn:disabled {
//           color: #ccc;
//           cursor: not-allowed;
//         }

//         .members-list {
//           max-height: 300px;
//           overflow-y: auto;
//           margin-bottom: 16px;
//         }

//         .member-item {
//           display: flex;
//           align-items: center;
//           padding: 12px;
//           border-bottom: 1px solid #f0f0f0;
//           cursor: pointer;
//         }

//         .member-item:hover {
//           background: #f9f9f9;
//         }

//         .member-item.selected {
//           background: #f0f8ff;
//         }

//         .member-avatar {
//           width: 40px;
//           height: 40px;
//           border-radius: 50%;
//           background: #14AE5C;
//           color: white;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           margin-right: 12px;
//           font-weight: 500;
//         }

//         .member-info {
//           flex: 1;
//         }

//         .member-name {
//           font-weight: 500;
//           margin-bottom: 2px;
//         }

//         .member-email {
//           font-size: 0.8rem;
//           color: #666;
//         }

//         .check-icon {
//           color: #14AE5C;
//           margin-left: 12px;
//         }

//         .empty-state {
//           text-align: center;
//           padding: 40px 0;
//           color: #666;
//         }

//         .selected-count {
//           text-align: center;
//           font-size: 0.9rem;
//           color: #666;
//           margin-bottom: 16px;
//         }

//         .modal-actions {
//           display: flex;
//           justify-content: flex-end;
//           gap: 12px;
//         }

//         .confirm-btn {
//           background: #14AE5C;
//           color: white;
//           border: none;
//           padding: 10px 20px;
//           border-radius: 6px;
//           cursor: pointer;
//         }
//       `}</style>
//         </div>
//     );
// };

// export default CreateGroupChat;

// import React, { useState, useRef, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { Plus, X, Users, UserPlus, Check } from 'lucide-react';
// import API_URL from '../../Config';
// import { getFriends } from "../../API/api";

// const CreateGroupChat = ({ onClose, onCreateSuccess }) => {
//     const navigate = useNavigate();
//     const userId = localStorage.getItem('userId');
//     const fileInputRef = useRef(null);

//     const [formData, setFormData] = useState({
//         name: '',
//         aboutGroup: '',
//         allowChatting: true
//     });
//     const [avatar, setAvatar] = useState(null);
//     const [avatarPreview, setAvatarPreview] = useState(null);
//     const [selectedMembers, setSelectedMembers] = useState([]);
//     const [showAddMembers, setShowAddMembers] = useState(false);
//     const [loading, setLoading] = useState(false);
//     const [friendsLoading, setFriendsLoading] = useState(true);
//     const [error, setError] = useState('');
//     const [friends, setFriends] = useState([]);

//     useEffect(() => {
//         const fetchFriends = async () => {
//             try {
//                 setFriendsLoading(true);
//                 const friendsData = await getFriends(userId);
//                 console.log("Fetched friends:", friendsData);
//                 setFriends(friendsData || []);
//             } catch (err) {
//                 console.error('Error fetching friends:', err);
//                 setError('Failed to load friends');
//             } finally {
//                 setFriendsLoading(false);
//             }
//         };

//         if (userId) {
//             fetchFriends();
//         }
//     }, [userId]);

//     const handleInputChange = (e) => {
//         const { name, value, type, checked } = e.target;
//         setFormData(prev => ({
//             ...prev,
//             [name]: type === 'checkbox' ? checked : value
//         }));
//     };

//     const handleAvatarChange = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             setAvatar(file);
//             setAvatarPreview(URL.createObjectURL(file));
//         }
//     };

//     const triggerFileInput = () => {
//         fileInputRef.current.click();
//     };

//     const toggleMemberSelection = (friend) => {
//         setSelectedMembers(prev =>
//             prev.some(m => m._id === friend._id)
//                 ? prev.filter(m => m._id !== friend._id)
//                 : [...prev, friend]
//         );
//     };

//     const createGroup = async () => {
//         if (!formData.name.trim()) {
//             setError('Group name is required');
//             return;
//         }

//         setLoading(true);
//         setError('');

//         try {
//             const formDataToSend = new FormData();
//             formDataToSend.append('name', formData.name);
//             formDataToSend.append('aboutGroup', formData.aboutGroup);
//             formDataToSend.append('allowChatting', formData.allowChatting);

//             // Include selected members as participants
//             selectedMembers.forEach(member => {
//                 formDataToSend.append('participants', member._id);
//             });

//             if (avatar) {
//                 formDataToSend.append('group_avatar', avatar);
//             }

//             const response = await axios.post(
//                 `${API_URL}api/chatgroup/newGroupChat/${userId}`,
//                 formDataToSend,
//                 { headers: { 'Content-Type': 'multipart/form-data' } }
//             );

//             if (response.data.id) {
//                 const groupId = response.data.id;

//                 if (onCreateSuccess) {
//                     onCreateSuccess();
//                 } else {
//                     navigate(`/group/${groupId}`);
//                 }
//             }
//         } catch (err) {
//             console.error('Error creating group:', err);
//             setError(err.response?.data?.message || 'Failed to create group');
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="create-group-container">
//             {/* Overlay when modal is open */}
//             {showAddMembers && (
//                 <div className="modal-overlay" onClick={() => setShowAddMembers(false)} />
//             )}

//             {/* Add Members Modal */}
//             {showAddMembers && (
//                 <div className="add-members-modal">
//                     <div className="modal-header">
//                         <h3>Add Friends to Group</h3>
//                         <button className="close-btn" onClick={() => setShowAddMembers(false)}>
//                             <X size={20} />
//                         </button>
//                     </div>

//                     {friendsLoading ? (
//                         <div className="loading-state">
//                             <p>Loading friends...</p>
//                         </div>
//                     ) : friends.length > 0 ? (
//                         <>
//                             <div className="members-list">
//                                 {friends.map(friend => (
//                                     <div
//                                         key={friend._id || friend.id}
//                                         className={`member-item ${selectedMembers.some(m => m._id === friend._id) ? 'selected' : ''}`}
//                                         onClick={() => toggleMemberSelection(friend)}
//                                     >
//                                         <div className="member-avatar">
//                                             {friend.profilePic ? (
//                                                 <img
//                                                     src={friend.profilePic}
//                                                     alt={friend.name}
//                                                     className="avatar-image"
//                                                     onError={(e) => {
//                                                         e.target.onerror = null;
//                                                         e.target.src = '';
//                                                         e.target.parentNode.textContent = friend.name?.charAt(0).toUpperCase() || '?';
//                                                     }}
//                                                 />
//                                             ) : (
//                                                 friend.name?.charAt(0).toUpperCase() || '?'
//                                             )}
//                                         </div>
//                                         <div className="member-info">
//                                             <div className="member-name">{friend.name || 'Unknown User'}</div>
//                                             {friend.lastMessage && (
//                                                 <div className="member-last-message">{friend.lastMessage}</div>
//                                             )}
//                                         </div>
//                                         {selectedMembers.some(m => m._id === friend._id) && (
//                                             <Check size={20} className="check-icon" />
//                                         )}
//                                     </div>
//                                 ))}
//                             </div>
//                             <div className="selected-count">
//                                 {selectedMembers.length} friend(s) selected
//                             </div>
//                         </>
//                     ) : (
//                         <div className="empty-state">
//                             You have no friends to add
//                         </div>
//                     )}

//                     <div className="modal-actions">
//                         <button
//                             className="cancel-btn"
//                             onClick={() => setShowAddMembers(false)}
//                         >
//                             Cancel
//                         </button>
//                         <button
//                             className="confirm-btn"
//                             onClick={() => setShowAddMembers(false)}
//                         >
//                             Done
//                         </button>
//                     </div>
//                 </div>
//             )}

//             {/* Main Group Creation Form */}
//             <div className="create-group-header">
//                 <h2>Create New Group</h2>
//                 <button className="close-btn" onClick={onClose}>
//                     <X size={24} />
//                 </button>
//             </div>

//             <div className="avatar-section">
//                 <div className="avatar-upload" onClick={triggerFileInput}>
//                     {avatarPreview ? (
//                         <img src={avatarPreview} alt="Group avatar" className="avatar-preview" />
//                     ) : (
//                         <div className="avatar-placeholder">
//                             <Plus size={32} />
//                         </div>
//                     )}
//                 </div>
//                 <input
//                     type="file"
//                     ref={fileInputRef}
//                     onChange={handleAvatarChange}
//                     accept="image/*"
//                     style={{ display: 'none' }}
//                 />
//                 <p className="avatar-hint">Click to add group photo</p>
//             </div>

//             <div className="form-group">
//                 <label htmlFor="name">Group Name *</label>
//                 <input
//                     type="text"
//                     id="name"
//                     name="name"
//                     value={formData.name}
//                     onChange={handleInputChange}
//                     placeholder="Enter group name"
//                     required
//                 />
//             </div>

//             <div className="form-group">
//                 <label htmlFor="aboutGroup">Description (Optional)</label>
//                 <textarea
//                     id="aboutGroup"
//                     name="aboutGroup"
//                     value={formData.aboutGroup}
//                     onChange={handleInputChange}
//                     placeholder="What's this group about?"
//                     rows="3"
//                 />
//             </div>

//             <div className="form-group checkbox-group">
//                 <input
//                     type="checkbox"
//                     id="allowChatting"
//                     name="allowChatting"
//                     checked={formData.allowChatting}
//                     onChange={handleInputChange}
//                 />
//                 <label htmlFor="allowChatting">Allow members to chat</label>
//             </div>

//             <div className="members-section">
//                 <div className="section-header">
//                     <h3>Add Friends</h3>
//                     <button
//                         className="add-members-btn"
//                         onClick={() => setShowAddMembers(true)}
//                     >
//                         <UserPlus size={18} />
//                         <span>Add</span>
//                     </button>
//                 </div>

//                 {selectedMembers.length > 0 ? (
//                     <div className="selected-members">
//                         {selectedMembers.map(member => (
//                             <div key={member._id} className="member-tag">
//                                 <span>{member.name}</span>
//                             </div>
//                         ))}
//                     </div>
//                 ) : (
//                     <div className="empty-members">
//                         <Users size={32} />
//                         <p>No friends added yet</p>
//                     </div>
//                 )}
//             </div>

//             {error && <div className="error-message">{error}</div>}

//             <div className="action-buttons">
//                 <button
//                     className="cancel-btn"
//                     onClick={onClose}
//                     disabled={loading}
//                 >
//                     Cancel
//                 </button>
//                 <button
//                     className="create-btn"
//                     onClick={createGroup}
//                     disabled={loading || !formData.name.trim()}
//                 >
//                     {loading ? 'Creating...' : 'Create Group'}
//                 </button>
//             </div>

//             <style jsx>{`
//                 .create-group-container {
//                     background: white;
//                     border-radius: 12px;
//                     padding: 24px;
//                     max-width: 500px;
//                     margin: 0 auto;
//                     box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
//                     position: relative;
//                     z-index: 1;
//                 }

//                 .modal-overlay {
//                     position: fixed;
//                     top: 0;
//                     left: 0;
//                     right: 0;
//                     bottom: 0;
//                     background: rgba(0, 0, 0, 0.5);
//                     z-index: 10;
//                 }

//                 .add-members-modal {
//                     position: fixed;
//                     top: 50%;
//                     left: 50%;
//                     transform: translate(-50%, -50%);
//                     width: 90%;
//                     max-width: 450px;
//                     background: white;
//                     border-radius: 12px;
//                     padding: 20px;
//                     z-index: 11;
//                     box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
//                     max-height: 80vh;
//                     display: flex;
//                     flex-direction: column;
//                 }

//                 .members-list {
//                     flex: 1;
//                     overflow-y: auto;
//                     margin: 15px 0;
//                     border: 1px solid #eee;
//                     border-radius: 8px;
//                     padding: 5px;
//                 }

//                 .member-item {
//                     display: flex;
//                     align-items: center;
//                     padding: 10px;
//                     margin: 5px 0;
//                     border-radius: 5px;
//                     cursor: pointer;
//                     transition: background-color 0.2s;
//                 }

//                 .member-item:hover {
//                     background-color: #f5f5f5;
//                 }

//                 .member-item.selected {
//                     background-color: #e1f5fe;
//                 }

//                 .member-avatar {
//                     width: 40px;
//                     height: 40px;
//                     border-radius: 50%;
//                     background-color: #14AE5C;
//                     color: white;
//                     display: flex;
//                     align-items: center;
//                     justify-content: center;
//                     margin-right: 12px;
//                     font-weight: bold;
//                     overflow: hidden;
//                 }

//                 .member-info {
//                     flex: 1;
//                 }

//                 .member-name {
//                     font-weight: 500;
//                     margin-bottom: 2px;
//                 }

//                 .member-last-message {
//                     font-size: 0.8rem;
//                     color: #666;
//                 }

//                 /* Rest of your existing styles remain the same */
//                 .create-group-header {
//                     display: flex;
//                     justify-content: space-between;
//                     align-items: center;
//                     margin-bottom: 24px;
//                 }

//                 .create-group-header h2 {
//                     font-size: 1.5rem;
//                     font-weight: 600;
//                     margin: 0;
//                 }

//                 .close-btn {
//                     background: none;
//                     border: none;
//                     cursor: pointer;
//                     color: #666;
//                     padding: 4px;
//                 }

//                 .avatar-section {
//                     display: flex;
//                     flex-direction: column;
//                     align-items: center;
//                     margin-bottom: 24px;
//                 }

//                 .avatar-upload {
//                     width: 120px;
//                     height: 120px;
//                     border-radius: 50%;
//                     background-color: #f5f5f5;
//                     display: flex;
//                     align-items: center;
//                     justify-content: center;
//                     cursor: pointer;
//                     overflow: hidden;
//                     margin-bottom: 8px;
//                 }

//                 .avatar-preview, .avatar-image {
//                     width: 100%;
//                     height: 100%;
//                     object-fit: cover;
//                 }

//                 .avatar-placeholder {
//                     color: #999;
//                 }

//                 .avatar-hint {
//                     color: #666;
//                     font-size: 0.9rem;
//                     margin: 0;
//                 }

//                 .form-group {
//                     margin-bottom: 20px;
//                 }

//                 .form-group label {
//                     display: block;
//                     margin-bottom: 8px;
//                     font-weight: 500;
//                     color: #333;
//                 }

//                 .form-group input[type="text"],
//                 .form-group textarea {
//                     width: 100%;
//                     padding: 10px 12px;
//                     border: 1px solid #ddd;
//                     border-radius: 6px;
//                     font-size: 1rem;
//                 }

//                 .form-group textarea {
//                     resize: vertical;
//                     min-height: 80px;
//                 }

//                 .checkbox-group {
//                     display: flex;
//                     align-items: center;
//                 }

//                 .checkbox-group input {
//                     margin-right: 8px;
//                 }

//                 .members-section {
//                     margin: 24px 0;
//                 }

//                 .section-header {
//                     display: flex;
//                     justify-content: space-between;
//                     align-items: center;
//                     margin-bottom: 12px;
//                 }

//                 .section-header h3 {
//                     margin: 0;
//                     font-size: 1.1rem;
//                 }

//                 .add-members-btn {
//                     display: flex;
//                     align-items: center;
//                     gap: 6px;
//                     background: none;
//                     border: 1px solid #14AE5C;
//                     color: #14AE5C;
//                     padding: 6px 12px;
//                     border-radius: 20px;
//                     cursor: pointer;
//                     font-size: 0.9rem;
//                 }

//                 .selected-members {
//                     display: flex;
//                     flex-wrap: wrap;
//                     gap: 8px;
//                     margin-top: 12px;
//                 }

//                 .member-tag {
//                     background: #f0f4ff;
//                     padding: 6px 12px;
//                     border-radius: 16px;
//                     font-size: 0.9rem;
//                 }

//                 .empty-members {
//                     display: flex;
//                     flex-direction: column;
//                     align-items: center;
//                     justify-content: center;
//                     padding: 20px;
//                     background: #f9f9f9;
//                     border-radius: 8px;
//                     margin-top: 12px;
//                     color: #666;
//                 }

//                 .empty-members p {
//                     margin-top: 8px;
//                     margin-bottom: 0;
//                 }

//                 .error-message {
//                     color: #e74c3c;
//                     background: #fdecea;
//                     padding: 12px;
//                     border-radius: 6px;
//                     margin: 16px 0;
//                     font-size: 0.9rem;
//                 }

//                 .action-buttons {
//                     display: flex;
//                     justify-content: flex-end;
//                     gap: 12px;
//                     margin-top: 24px;
//                 }

//                 .cancel-btn {
//                     background: #f0f0f0;
//                     color: #333;
//                     border: none;
//                     padding: 10px 20px;
//                     border-radius: 6px;
//                     cursor: pointer;
//                 }

//                 .create-btn {
//                     background: #14AE5C;
//                     color: white;
//                     border: none;
//                     padding: 10px 20px;
//                     border-radius: 6px;
//                     cursor: pointer;
//                 }

//                 .create-btn:disabled {
//                     background: #ccc;
//                     cursor: not-allowed;
//                 }

//                 .modal-header {
//                     display: flex;
//                     justify-content: space-between;
//                     align-items: center;
//                     margin-bottom: 20px;
//                 }

//                 .modal-header h3 {
//                     margin: 0;
//                     font-size: 1.3rem;
//                 }

//                 .check-icon {
//                     color: #14AE5C;
//                     margin-left: 12px;
//                 }

//                 .empty-state, .loading-state {
//                     text-align: center;
//                     padding: 40px 0;
//                     color: #666;
//                 }

//                 .selected-count {
//                     text-align: center;
//                     font-size: 0.9rem;
//                     color: #666;
//                     margin-bottom: 16px;
//                 }

//                 .modal-actions {
//                     display: flex;
//                     justify-content: flex-end;
//                     gap: 12px;
//                 }

//                 .confirm-btn {
//                     background: #14AE5C;
//                     color: white;
//                     border: none;
//                     padding: 10px 20px;
//                     border-radius: 6px;
//                     cursor: pointer;
//                 }
//             `}</style>
//         </div>
//     );
// };

// export default CreateGroupChat;
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Plus, X, Users, UserPlus, Check, Smile } from 'lucide-react';
import API_URL from '../../Config';
import { getFriends } from "../../API/api";
import EmojiPicker from 'emoji-picker-react';

const CreateGroupChat = ({ onClose, onCreateSuccess }) => {
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        name: '',
        aboutGroup: '',
        allowChatting: true,
        is_private: false,
        allowedReactions: ['👍', '❤️', '😂', '😮', '😢', '🙏'] // Default reactions
    });
    const [avatar, setAvatar] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [showAddMembers, setShowAddMembers] = useState(false);
    const [loading, setLoading] = useState(false);
    const [friendsLoading, setFriendsLoading] = useState(true);
    const [error, setError] = useState('');
    const [friends, setFriends] = useState([]);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [customReaction, setCustomReaction] = useState('');

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                setFriendsLoading(true);
                const friendsData = await getFriends(userId);
                console.log("Fetched friends:", friendsData);
                setFriends(friendsData || []);
            } catch (err) {
                console.error('Error fetching friends:', err);
                setError('Failed to load friends');
            } finally {
                setFriendsLoading(false);
            }
        };

        if (userId) {
            fetchFriends();
        }
    }, [userId]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatar(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    const toggleMemberSelection = (friend) => {
        setSelectedMembers(prev =>
            prev.some(m => m._id === friend._id)
                ? prev.filter(m => m._id !== friend._id)
                : [...prev, friend]
        );
    };

    const toggleReaction = (reaction) => {
        setFormData(prev => {
            const newReactions = prev.allowedReactions.includes(reaction)
                ? prev.allowedReactions.filter(r => r !== reaction)
                : [...prev.allowedReactions, reaction];

            return {
                ...prev,
                allowedReactions: newReactions
            };
        });
    };

    const addCustomReaction = () => {
        if (customReaction && !formData.allowedReactions.includes(customReaction)) {
            setFormData(prev => ({
                ...prev,
                allowedReactions: [...prev.allowedReactions, customReaction]
            }));
            setCustomReaction('');
            setShowEmojiPicker(false);
        }
    };

    const createGroup = async () => {
        if (!formData.name.trim()) {
            setError('Group name is required');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('aboutGroup', formData.aboutGroup);
            formDataToSend.append('allowChatting', formData.allowChatting);
            formDataToSend.append('is_private', formData.is_private);
            formDataToSend.append('allowedReactions', JSON.stringify(formData.allowedReactions));

            selectedMembers.forEach(member => {
                formDataToSend.append('participants', member._id);
            });

            if (avatar) {
                formDataToSend.append('group_avatar', avatar);
            }

            const response = await axios.post(
                `${API_URL}api/chatgroup/newGroupChat/${userId}`,
                formDataToSend,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );

            if (response.data.id) {
                const groupId = response.data.id;

                if (onCreateSuccess) {
                    onCreateSuccess();
                } else {
                    navigate(`/group/${groupId}`);
                }
            }
        } catch (err) {
            console.error('Error creating group:', err);
            setError(err.response?.data?.message || 'Failed to create group');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-group-container">
            {/* Overlay when modal is open */}
            {showAddMembers && (
                <div className="modal-overlay" onClick={() => setShowAddMembers(false)} />
            )}

            {/* Add Members Modal */}
            {showAddMembers && (
                <div className="add-members-modal">
                    <div className="modal-header">
                        <h3>Add Friends to Group</h3>
                        <button className="close-btn" onClick={() => setShowAddMembers(false)}>
                            <X size={20} />
                        </button>
                    </div>

                    {friendsLoading ? (
                        <div className="loading-state">
                            <p>Loading friends...</p>
                        </div>
                    ) : friends.length > 0 ? (
                        <>
                            <div className="members-list">
                                {friends.map(friend => (
                                    <div
                                        key={friend._id || friend.id}
                                        className={`member-item ${selectedMembers.some(m => m._id === friend._id) ? 'selected' : ''}`}
                                        onClick={() => toggleMemberSelection(friend)}
                                    >
                                        <div className="member-avatar">
                                            {friend.profilePic ? (
                                                <img
                                                    src={friend.profilePic}
                                                    alt={friend.name}
                                                    className="avatar-image"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = '';
                                                        e.target.parentNode.textContent = friend.name?.charAt(0).toUpperCase() || '?';
                                                    }}
                                                />
                                            ) : (
                                                friend.name?.charAt(0).toUpperCase() || '?'
                                            )}
                                        </div>
                                        <div className="member-info">
                                            <div className="member-name">{friend.name || 'Unknown User'}</div>
                                            {friend.lastMessage && (
                                                <div className="member-last-message">{friend.lastMessage}</div>
                                            )}
                                        </div>
                                        {selectedMembers.some(m => m._id === friend._id) && (
                                            <Check size={20} className="check-icon" />
                                        )}
                                    </div>
                                ))}
                            </div>
                            <div className="selected-count">
                                {selectedMembers.length} friend(s) selected
                            </div>
                        </>
                    ) : (
                        <div className="empty-state">
                            You have no friends to add
                        </div>
                    )}

                    <div className="modal-actions">
                        <button
                            className="cancel-btn"
                            onClick={() => setShowAddMembers(false)}
                        >
                            Cancel
                        </button>
                        <button
                            className="confirm-btn"
                            onClick={() => setShowAddMembers(false)}
                        >
                            Done
                        </button>
                    </div>
                </div>
            )}

            {/* Emoji Picker Modal */}
            {showEmojiPicker && (
                <div className="emoji-picker-modal">
                    <div className="emoji-picker-container">
                        <EmojiPicker
                            onEmojiClick={(emojiData) => setCustomReaction(emojiData.emoji)}
                            width="100%"
                            height={350}
                        />
                        <div className="emoji-picker-actions">
                            <div className="selected-emoji-preview">
                                {customReaction || 'Select an emoji'}
                            </div>
                            <button
                                className="add-emoji-btn"
                                onClick={addCustomReaction}
                                disabled={!customReaction}
                            >
                                Add Reaction
                            </button>
                            <button
                                className="cancel-emoji-btn"
                                onClick={() => {
                                    setCustomReaction('');
                                    setShowEmojiPicker(false);
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Group Creation Form */}
            <div className="create-group-header">
                <h2>Create New Group</h2>
                <button className="close-btn" onClick={onClose}>
                    <X size={24} />
                </button>
            </div>

            <div className="avatar-section">
                <div className="avatar-upload" onClick={triggerFileInput}>
                    {avatarPreview ? (
                        <img src={avatarPreview} alt="Group avatar" className="avatar-preview" />
                    ) : (
                        <div className="avatar-placeholder">
                            <Plus size={32} />
                        </div>
                    )}
                </div>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleAvatarChange}
                    accept="image/*"
                    style={{ display: 'none' }}
                />
                <p className="avatar-hint">Click to add group photo</p>
            </div>

            <div className="form-group">
                <label htmlFor="name">Group Name *</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter group name"
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="aboutGroup">Description (Optional)</label>
                <textarea
                    id="aboutGroup"
                    name="aboutGroup"
                    value={formData.aboutGroup}
                    onChange={handleInputChange}
                    placeholder="What's this group about?"
                    rows="3"
                />
            </div>

            <div className="form-group checkbox-group1">
                <input
                    type="checkbox"
                    id="allowChatting"
                    name="allowChatting"
                    checked={formData.allowChatting}
                    onChange={handleInputChange}
                />
                <label htmlFor="allowChatting">Allow members to chat</label>
            </div>

            <div className="form-group checkbox-group2">
                <input
                    type="checkbox"
                    id="is_private"
                    name="is_private"
                    checked={formData.is_private}
                    onChange={handleInputChange}
                />
                <label htmlFor="is_private">Make group private</label>
            </div>

            <div className="reactions-section">
                <div className="section-header">
                    <h3>Allowed Reactions</h3>
                    <button
                        className="add-reaction-btn"
                        onClick={() => setShowEmojiPicker(true)}
                    >
                        <Smile size={18} />
                        <span>Add Custom</span>
                    </button>
                </div>

                <div className="reactions-list">
                    {formData.allowedReactions.map((reaction, index) => (
                        <button
                            key={index}
                            className={`reaction-item ${formData.allowedReactions.includes(reaction) ? 'selected' : ''}`}
                            onClick={() => toggleReaction(reaction)}
                        >
                            {reaction}
                        </button>
                    ))}
                </div>
            </div>

            <div className="members-section">
                <div className="section-header">
                    <h3>Add Friends</h3>
                    <button
                        className="add-members-btn"
                        onClick={() => setShowAddMembers(true)}
                    >
                        <UserPlus size={18} />
                        <span>Add</span>
                    </button>
                </div>

                {selectedMembers.length > 0 ? (
                    <div className="selected-members">
                        {selectedMembers.map(member => (
                            <div key={member._id} className="member-tag">
                                <span>{member.name}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-members">
                        <Users size={32} />
                        <p>No friends added yet</p>
                    </div>
                )}
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="action-buttons">
                <button
                    className="cancel-btn"
                    onClick={onClose}
                    disabled={loading}
                >
                    Cancel
                </button>
                <button
                    className="create-btn"
                    onClick={createGroup}
                    disabled={loading || !formData.name.trim()}
                >
                    {loading ? 'Creating...' : 'Create Group'}
                </button>
            </div>

            <style jsx>{`
                .create-group-container {
                    background: white;
                    border-radius: 12px;
                    padding: 24px;
                    max-width: 500px;
                    margin: 0 auto;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                    position: relative;
                    z-index: 1;
                }
                
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.5);
                    z-index: 10;
                }
                
                .add-members-modal {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 90%;
                    max-width: 450px;
                    background: white;
                    border-radius: 12px;
                    padding: 20px;
                    z-index: 11;
                    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
                    max-height: 80vh;
                    display: flex;
                    flex-direction: column;
                }
                
                .emoji-picker-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 20;
                }
                
                .emoji-picker-container {
                    background: white;
                    border-radius: 12px;
                    overflow: hidden;
                    width: 90%;
                    max-width: 400px;
                }
                
                .emoji-picker-actions {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 12px;
                    background: #f5f5f5;
                }
                
                .selected-emoji-preview {
                    font-size: 24px;
                    min-width: 40px;
                    text-align: center;
                }
                
                .add-emoji-btn, .cancel-emoji-btn {
                    padding: 8px 16px;
                    border-radius: 6px;
                    border: none;
                    cursor: pointer;
                    margin-left: 10px;
                }
                
                .add-emoji-btn {
                    background: #14AE5C;
                    color: white;
                }
                
                .add-emoji-btn:disabled {
                    background: #ccc;
                    cursor: not-allowed;
                }
                
                .cancel-emoji-btn {
                    background: #f0f0f0;
                    color: #333;
                }
                
                .reactions-section {
                    margin: 24px 0;
                }
                
                .reactions-list {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                    margin-top: 12px;
                }
                
                .reaction-item {
                    font-size: 24px;
                    background: #f0f0f0;
                    border: none;
                    border-radius: 50%;
                    width: 40px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                
                .reaction-item.selected {
                    background: #e1f5fe;
                    transform: scale(1.1);
                }
                
                .add-reaction-btn {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    background: none;
                    border: 1px solid #14AE5C;
                    color: #14AE5C;
                    padding: 6px 12px;
                    border-radius: 20px;
                    cursor: pointer;
                    font-size: 0.9rem;
                }
                
                /* Rest of your existing styles remain the same */
                .members-list {
                    flex: 1;
                    overflow-y: auto;
                    margin: 15px 0;
                    border: 1px solid #eee;
                    border-radius: 8px;
                    padding: 5px;
                }
                
                .member-item {
                    display: flex;
                    align-items: center;
                    padding: 10px;
                    margin: 5px 0;
                    border-radius: 5px;
                    cursor: pointer;
                    transition: background-color 0.2s;
                }
                
                .member-item:hover {
                    background-color: #f5f5f5;
                }
                
                .member-item.selected {
                    background-color: #e1f5fe;
                }
                
                .member-avatar {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background-color: #14AE5C;
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-right: 12px;
                    font-weight: bold;
                    overflow: hidden;
                }
                
                .member-info {
                    flex: 1;
                }
                
                .member-name {
                    font-weight: 500;
                    margin-bottom: 2px;
                }
                
                .member-last-message {
                    font-size: 0.8rem;
                    color: #666;
                }
                
                .create-group-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 24px;
                }
                
                .create-group-header h2 {
                    font-size: 1.5rem;
                    font-weight: 600;
                    margin: 0;
                }
                
                .close-btn {
                    background: none;
                    border: none;
                    cursor: pointer;
                    color: #666;
                    padding: 4px;
                }
                
                .avatar-section {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    margin-bottom: 24px;
                }
                
                .avatar-upload {
                    width: 120px;
                    height: 120px;
                    border-radius: 50%;
                    background-color: #f5f5f5;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    overflow: hidden;
                    margin-bottom: 8px;
                }
                
                .avatar-preview, .avatar-image {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                
                .avatar-placeholder {
                    color: #999;
                }
                
                .avatar-hint {
                    color: #666;
                    font-size: 0.9rem;
                    margin: 0;
                }
                
                .form-group {
                    margin-bottom: 20px;
                }
                
                .form-group label {
                    display: block;
                    margin-bottom: 8px;
                    font-weight: 500;
                    color: #333;
                }
                
                .form-group input[type="text"],
                .form-group textarea {
                    width: 100%;
                    padding: 10px 12px;
                    border: 1px solid #ddd;
                    border-radius: 6px;
                    font-size: 1rem;
                }
                
                .form-group textarea {
                    resize: vertical;
                    min-height: 80px;
                }
                
                .checkbox-group1 {
                    display: flex;
                    align-items: center;
                    margin-left:-150px;
                     margin-top:-20px;
                }
                
                .checkbox-group1 input {
                    margin-right: 8px;
                }
                .checkbox-group2 {
                    display: flex;
                    align-items: center;
                    margin-left:10px;
                    margin-top:-75px;
                }
                
                .checkbox-group2 input {
                    margin-right: 8px;
                }
                .members-section {
                    margin: 24px 0;
                }
                
                .section-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 12px;
                }
                
                .section-header h3 {
                    margin: 0;
                    font-size: 1.1rem;
                }
                
                .add-members-btn {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    background: none;
                    border: 1px solid #14AE5C;
                    color: #14AE5C;
                    padding: 6px 12px;
                    border-radius: 20px;
                    cursor: pointer;
                    font-size: 0.9rem;
                }
                
                .selected-members {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                    margin-top: 12px;
                }
                
                .member-tag {
                    background: #f0f4ff;
                    padding: 6px 12px;
                    border-radius: 16px;
                    font-size: 0.9rem;
                }
                
                .empty-members {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                    background: #f9f9f9;
                    border-radius: 8px;
                    margin-top: 12px;
                    color: #666;
                }
                
                .empty-members p {
                    margin-top: 8px;
                    margin-bottom: 0;
                }
                
                .error-message {
                    color: #e74c3c;
                    background: #fdecea;
                    padding: 12px;
                    border-radius: 6px;
                    margin: 16px 0;
                    font-size: 0.9rem;
                }
                
                .action-buttons {
                    display: flex;
                    justify-content: flex-end;
                    gap: 12px;
                    margin-top: 24px;
                }
                
                .cancel-btn {
                    background: #f0f0f0;
                    color: #333;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 6px;
                    cursor: pointer;
                }
                
                .create-btn {
                    background: #14AE5C;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 6px;
                    cursor: pointer;
                }
                
                .create-btn:disabled {
                    background: #ccc;
                    cursor: not-allowed;
                }
                
                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                }
                
                .modal-header h3 {
                    margin: 0;
                    font-size: 1.3rem;
                }
                
                .check-icon {
                    color: #14AE5C;
                    margin-left: 12px;
                }
                
                .empty-state, .loading-state {
                    text-align: center;
                    padding: 40px 0;
                    color: #666;
                }
                
                .selected-count {
                    text-align: center;
                    font-size: 0.9rem;
                    color: #666;
                    margin-bottom: 16px;
                }
                
                .modal-actions {
                    display: flex;
                    justify-content: flex-end;
                    gap: 12px;
                }
                
                .confirm-btn {
                    background: #14AE5C;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 6px;
                    cursor: pointer;
                }
            `}</style>
        </div>
    );
};

export default CreateGroupChat;