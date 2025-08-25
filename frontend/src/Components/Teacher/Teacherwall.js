import React, { useState, useRef, useEffect } from 'react';
import {
    FaRegThumbsUp,
    FaRegComment,
    FaCamera,
    FaPaperclip
} from "react-icons/fa";
import './teacher.css';
import Sidebar from '../Sidebar/Sidebar';
import { getTeacherPosts } from '../../API/biit';

const TeacherWall = () => {
    const userId = localStorage.getItem("userId");
    const [postContent, setPostContent] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [postType, setPostType] = useState('picture');
    const [privacy, setPrivacy] = useState('public');
    const [allowCommenting, setAllowCommenting] = useState(true);
    const [postOnTimeline, setPostOnTimeline] = useState(true);
    const [showComments, setShowComments] = useState(false);
    const [commentInput, setCommentInput] = useState('');
    const [posts, setPosts] = useState([]);

    const fileInputRef = useRef(null);

    const handleFileChange = (e) => setSelectedFile(e.target.files[0]);
    const triggerFileInput = () => fileInputRef.current.click();

    const handlePost = () => {
        if (!postContent && !selectedFile) {
            alert("Cannot post empty content");
            return;
        }
        alert("Post created successfully!");
        setPostContent('');
        setSelectedFile(null);
    };

    const loadTeacherPosts = async () => {
        try {
            const data = await getTeacherPosts(userId);
            console.log('data', data); // Remove JSON.stringify for better debugging
            setPosts(data || []); // Handle case where data might be undefined
        } catch (error) {
            console.error('Error loading posts:', error);
            setPosts([]); // Set empty array on error
        }
    };

    useEffect(() => {
        loadTeacherPosts();
    }, []);
    return (
        <div className="teacherpage">
            <Sidebar />

            <div className="header">
                <h2 className='h2'>Teacher Wall</h2>
                <input type="text" placeholder="Search..." className="teachersearch-bar" />
            </div>

            <div className="teacherpost-box">
                <textarea className='teacherpost-box textarea'
                    placeholder="What's on your mind?"
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                ></textarea>

                <div className="upload-icons">
                    <button className="upload-btn" onClick={triggerFileInput}>
                        <FaCamera /> Photo
                    </button>
                    <button className="upload-btn" onClick={triggerFileInput}>
                        <FaPaperclip /> File
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                    />
                </div>

                {selectedFile && (
                    <div className="selected-file-preview">
                        <span>{selectedFile.name}</span>
                        <button onClick={() => setSelectedFile(null)} className="cancel-file-btn">❌ Cancel</button>
                    </div>
                )}

                {(postContent.trim() !== '' || selectedFile) && (
                    <>
                        <div className="options">
                            <select value={postType} onChange={(e) => setPostType(e.target.value)}>
                                <option value="picture">Picture</option>
                                <option value="xlsx">.xlsx File</option>
                                <option value="xlx">.xlx File</option>
                            </select>

                            <select value={privacy} onChange={(e) => setPrivacy(e.target.value)}>
                                <option value="public">Public</option>
                                <option value="private">Private</option>
                            </select>

                            <label>
                                <input
                                    type="checkbox"
                                    checked={allowCommenting}
                                    onChange={() => setAllowCommenting(!allowCommenting)}
                                /> Allow Commenting
                            </label>

                            <label>
                                <input
                                    type="checkbox"
                                    checked={postOnTimeline}
                                    onChange={() => setPostOnTimeline(!postOnTimeline)}
                                /> Post on Timeline
                            </label>
                        </div>

                        <button className="post-button" onClick={handlePost}>Post</button>
                    </>
                )}
            </div>

            <div className="classposted-content">
                <div className="post-header">
                    <div className="user-info">
                        <img src="/default-user.png" alt="User" className="user-avatar" />
                        <div className='info'>
                            <strong>Prof. Ahsan Raza</strong>
                            <div className="post-meta">Just now · Public</div>
                        </div>
                    </div>
                </div>

                <div className="post-body">
                    <p>Midterm exams will start from next Monday. Prepare well!</p>
                    <img src="/announcement.jpg" alt="Announcement" className="post-image" />
                </div>

                <div className="post-footer">
                    <button className="action-btn">
                        <FaRegThumbsUp className="action-icon" /> Like 22
                    </button>
                    <button onClick={() => setShowComments(!showComments)}>
                        <FaRegComment className="action-icon" /> Comments 3
                    </button>
                </div>

                {showComments && (
                    <div className="comment-section">
                        <div className="comment-input">
                            <img src="/default-user.png" alt="User" className="user-avatar" />
                            <input
                                type="text"
                                placeholder="Write a comment..."
                                value={commentInput}
                                onChange={(e) => setCommentInput(e.target.value)}
                            />
                            <button className="comment-post-btn">Post</button>
                        </div>

                        <div className="comment-list">
                            <div className="comment">
                                <img src="/default-user.png" alt="User" className="user-avatar" />
                                <div className="comment-content">
                                    <strong>Sana Tariq</strong>
                                    <p>Thanks for the update, sir!</p>
                                    <button className="comment-like-btn">Like</button>
                                </div>
                            </div>
                            <div className="comment">
                                <img src="/default-user.png" alt="User" className="user-avatar" />
                                <div className="comment-content">
                                    <strong>Zeeshan Ahmed</strong>
                                    <p>Can we get the syllabus outline again?</p>
                                    <button className="comment-like-btn">Like</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TeacherWall;


// code 2

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import moment from 'moment';
// import {
//     Add as AddIcon,
//     Close as CloseIcon,
//     MoreVert as MoreVertIcon,
//     AttachFile as AttachFileIcon,
//     PhotoCamera as PhotoCameraIcon,
//     Description as DescriptionIcon,
//     InsertDriveFile as InsertDriveFileIcon,
//     FileDownload as FileDownloadIcon,
//     Image as ImageIcon
// } from '@mui/icons-material';
// import './teacher.css';
// import API_URL from '../../Config';
// import IMG_URL from '../../imagurl';

// // Placeholder images - replace with your actual image paths
// // import likeIcon from '../../assets/images/like-icon.png';
// // import noProfile from '../../assets/images/no-profile.jpg';

// const TeacherWall = () => {
//     const [posts, setPosts] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [userId] = useState('6754a9268db89992d5b8221e');
//     const [modalVisible, setModalVisible] = useState(false);
//     const [groups, setGroups] = useState([]);
//     const [content, setContent] = useState('');
//     const [type, setType] = useState('0');
//     const [attachments, setAttachments] = useState([]);
//     const [selectedDocuments, setSelectedDocuments] = useState([]);
//     const [uploading, setUploading] = useState(false);
//     const [isAdmin, setIsAdmin] = useState(false);
//     const teacherGroupId = '6866da5a99499ca6106e01a7';

//     const showMessage = (message) => {
//         alert(message);
//     };

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const [postsResponse, groupsResponse, groupInfoResponse] =
//                     await Promise.all([
//                         axios.get(`${API_URL}api/feed/getTeacherWallPosts/${userId}`),
//                         axios.get(`${API_URL}api/user/getGroups/${userId}`),
//                         axios.get(
//                             `${API_URL}api/postgroup/getGroup/${teacherGroupId}/${userId}`,
//                         ),
//                     ]);

//                 setPosts(postsResponse.data || []);
//                 setIsAdmin(groupInfoResponse.data?.isAdmin || false);

//                 const validatedGroups = (groupsResponse.data || [])
//                     .filter(group => group && group._id)
//                     .map(group => ({
//                         _id: group._id,
//                         name: group.name || 'Unnamed Group',
//                         imgUrl: group.imgUrl || 'https://via.placeholder.com/40',
//                     }));

//                 setGroups(validatedGroups);
//             } catch (error) {
//                 console.error('Error fetching data:', error);
//                 showMessage('Failed to load data');
//                 setPosts([]);
//                 setGroups([]);
//                 setIsAdmin(false);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchData();
//     }, []);

//     const handleDeletePost = async (postId) => {
//         try {
//             const postToDelete = posts.find(post => post._id === postId);
//             if (!postToDelete) {
//                 showMessage('Post not found');
//                 return;
//             }

//             const postDataId = postToDelete.postData?._id;
//             if (!postDataId) {
//                 showMessage('Invalid post data');
//                 return;
//             }

//             await axios.delete(`${API_URL}api/posts/deletePost/${postDataId}`);
//             setPosts(prevPosts => prevPosts.filter(post => post._id !== postId));
//             showMessage('Post deleted successfully');
//         } catch (error) {
//             console.error('Error deleting post:', error);
//             showMessage('Failed to delete post');
//         }
//     };

//     const showDeleteOption = (postId) => {
//         if (window.confirm('Are you sure you want to delete this post?')) {
//             handleDeletePost(postId);
//         }
//     };

//     const getFullFileUrl = (relativeUrl) => {
//         if (!relativeUrl) return null;
//         if (relativeUrl.startsWith('http://') || relativeUrl.startsWith('https://')) {
//             return relativeUrl;
//         }
//         return `${IMG_URL}${relativeUrl.startsWith('/') ? '' : '/'}${relativeUrl}`;
//     };

//     const downloadAndOpenFile = async (fileUrl) => {
//         const fullUrl = getFullFileUrl(fileUrl);
//         if (!fullUrl) {
//             showMessage('Invalid file URL');
//             return;
//         }
//         window.open(fullUrl, '_blank');
//     };

//     const isImageAttachment = (fileName) => {
//         if (!fileName) return false;
//         const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
//         return imageExtensions.some(ext => fileName.toLowerCase().endsWith(ext));
//     };

//     const isExcelFile = (fileName) => {
//         if (!fileName) return false;
//         return (
//             fileName.toLowerCase().endsWith('.xlsx') ||
//             fileName.toLowerCase().endsWith('.xls')
//         );
//     };

//     const handleLike = async (postId) => {
//         if (!postId) return;

//         try {
//             const post = posts.find(p => p && p._id === postId);
//             if (!post) return;

//             const isLiked = post.hasLiked;

//             await axios.put(
//                 `${API_URL}api/posts/togglePostLike/${postId}/${userId}/${isLiked}`,
//             );

//             const updatedPosts = posts.map(p => {
//                 if (p && p._id === postId) {
//                     return {
//                         ...p,
//                         hasLiked: !isLiked,
//                         likesCount: isLiked
//                             ? (p.likesCount || 0) - 1
//                             : (p.likesCount || 0) + 1,
//                     };
//                 }
//                 return p;
//             });

//             setPosts(updatedPosts);
//         } catch (error) {
//             console.error('Error handling like:', error);
//             showMessage('Failed to update like');
//         }
//     };

//     const handleAttachFile = (e) => {
//         const files = Array.from(e.target.files);
//         const newAttachments = files.map(file => ({
//             file,
//             name: file.name,
//             type: file.type,
//             uri: URL.createObjectURL(file)
//         }));

//         setAttachments(prev => [...prev, ...newAttachments]);
//         setSelectedDocuments(prev => [...prev, ...files.map(f => f.name)]);
//         e.target.value = ''; // Reset file input
//     };

//     const handleTakePhoto = async () => {
//         try {
//             const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//             // You would need to implement camera capture logic here
//             showMessage('Camera functionality would be implemented here');
//             // Don't forget to stop the stream when done
//             stream.getTracks().forEach(track => track.stop());
//         } catch (error) {
//             console.error('Error accessing camera:', error);
//             showMessage('Failed to access camera');
//         }
//     };

//     const removeAttachment = (index) => {
//         setAttachments(prev => prev.filter((_, i) => i !== index));
//         setSelectedDocuments(prev => prev.filter((_, i) => i !== index));
//     };

//     const handleSubmitPost = async () => {
//         if ((!content || !content.trim()) && attachments.length === 0) {
//             showMessage('Please add content or attachments');
//             return;
//         }

//         if (type === '1' || type === '2') {
//             const hasExcel = attachments.some(attachment => {
//                 const fileName = attachment.name || '';
//                 return isExcelFile(fileName);
//             });

//             if (!hasExcel) {
//                 showMessage(
//                     'You must upload an Excel file for Timetable or Datesheet posts',
//                 );
//                 return;
//             }
//         }

//         try {
//             setUploading(true);

//             const formData = new FormData();

//             formData.append('author', userId);
//             formData.append('content', content || '');
//             formData.append('privacyLevel', '0');
//             formData.append('type', type);
//             formData.append('allowCommenting', true);
//             formData.append('postOnTimeline', false);
//             formData.append('group_ids[]', teacherGroupId);

//             attachments.forEach(attachment => {
//                 formData.append('attachments', attachment.file);
//             });

//             const response = await axios.post(
//                 `${API_URL}api/posts/addPost`,
//                 formData,
//                 {
//                     headers: {
//                         'Content-Type': 'multipart/form-data',
//                     },
//                 },
//             );

//             if (response.data && response.data.post_id) {
//                 showMessage('Post created successfully!');
//                 setModalVisible(false);

//                 const postsResponse = await axios.get(
//                     `${API_URL}api/feed/getTeacherWallPosts/${userId}`,
//                 );
//                 setPosts(postsResponse.data || []);

//                 setContent('');
//                 setAttachments([]);
//                 setSelectedDocuments([]);
//                 setType('0');
//             }
//         } catch (error) {
//             console.error('Error creating post:', error);
//             if (error.response) {
//                 console.error('Response data:', error.response.data);
//                 console.error('Response status:', error.response.status);
//                 if (error.response.data === 0x101) {
//                     showMessage(
//                         'You must upload an Excel file for Timetable or Datesheet posts',
//                     );
//                 } else {
//                     showMessage('Failed to create post');
//                 }
//             } else {
//                 showMessage('Failed to create post');
//             }
//         } finally {
//             setUploading(false);
//         }
//     };

//     if (loading) {
//         return (
//             <div className="loading-container">
//                 <div className="spinner"></div>
//             </div>
//         );
//     }

//     return (
//         <div className="teacher-wall-container">
//             <div className="scroll-container">
//                 <h1 className="title">Teacher Wall</h1>
//                 {posts && posts.length > 0 ? (
//                     posts.map(post => {
//                         if (!post || !post._id || !post.postData) return null;

//                         return (
//                             <div key={post._id} className="post-container">
//                                 <div className="author-container">
//                                     <img
//                                         src={post.postData.authorData?.imgUrl
//                                             ? getFullFileUrl(post.postData.authorData.imgUrl)
//                                             : 'https://via.placeholder.com/40'}
//                                         className="avatar"
//                                         alt="Profile"
//                                     // onError={(e) => { e.target.src = noProfile }}
//                                     />
//                                     <div className="author-info">
//                                         <h3 className="author-name">
//                                             {post.postData.authorData?.name || 'Unknown User'}
//                                         </h3>
//                                         <span className="post-date">
//                                             {moment(post.postData.createdAt).format(
//                                                 'MMM D, YYYY h:mm A',
//                                             )}
//                                         </span>
//                                     </div>
//                                     {post.is_pinned && (
//                                         <span className="pinned-badge">PINNED</span>
//                                     )}
//                                     {isAdmin && (
//                                         <button
//                                             onClick={() => showDeleteOption(post._id)}
//                                             className="more-options-button">
//                                             <MoreVertIcon />
//                                         </button>
//                                     )}
//                                 </div>

//                                 <p className="post-content">{post.postData.content}</p>

//                                 {post.postData.attachments?.length > 0 && (
//                                     <div className="attachments-container">
//                                         {post.postData.attachments.map((attachment, index) => {
//                                             if (!attachment) return null;
//                                             const fileName = attachment.split('/').pop();
//                                             const isImage = isImageAttachment(fileName);
//                                             const fullUrl = getFullFileUrl(attachment);

//                                             return isImage ? (
//                                                 <div
//                                                     key={index}
//                                                     className="image-attachment-container">
//                                                     <button
//                                                         onClick={() => window.open(fullUrl, '_blank')}
//                                                         className="image-button"
//                                                     >
//                                                         <img
//                                                             src={fullUrl}
//                                                             className="attachment-image"
//                                                             alt="Attachment"
//                                                         />
//                                                     </button>
//                                                 </div>
//                                             ) : (
//                                                 <button
//                                                     key={index}
//                                                     className="attachment-item"
//                                                     onClick={() => downloadAndOpenFile(attachment)}>
//                                                     <AttachFileIcon className="attachment-icon" />
//                                                     <span className="attachment-link">
//                                                         {fileName || 'Download file'}
//                                                     </span>
//                                                     <FileDownloadIcon className="download-icon" />
//                                                 </button>
//                                             );
//                                         })}
//                                     </div>
//                                 )}

//                                 <div className="interaction-container">
//                                     <button
//                                         className="interaction-button"
//                                         onClick={() => handleLike(post._id)}>
//                                         <span className="interaction-text">
//                                             {post.likesCount || 0}
//                                         </span>
//                                         <img
//                                             //   src={likeIcon}
//                                             className="like-icon"
//                                             style={{
//                                                 filter: post.hasLiked ? 'hue-rotate(120deg)' : 'none',
//                                             }}
//                                             alt="Like"
//                                         />
//                                     </button>
//                                 </div>
//                             </div>
//                         );
//                     })
//                 ) : (
//                     <p className="no-posts">No posts available</p>
//                 )}
//             </div>

//             {isAdmin && (
//                 <button
//                     className="fab"
//                     onClick={() => setModalVisible(true)}>
//                     <AddIcon />
//                 </button>
//             )}

//             {modalVisible && (
//                 <div className="modal-overlay">
//                     <div className="modal-container">
//                         <div className="modal-header">
//                             <h2 className="modal-title">Create New Post</h2>
//                             <button
//                                 onClick={() => !uploading && setModalVisible(false)}
//                                 className="close-modal-button"
//                             >
//                                 <CloseIcon />
//                             </button>
//                         </div>

//                         <div className="modal-content">
//                             <textarea
//                                 className="post-input"
//                                 placeholder="What's on your mind?"
//                                 value={content}
//                                 onChange={(e) => setContent(e.target.value)}
//                                 rows={5}
//                             />

//                             <div className="section">
//                                 <h3 className="section-title">Post Type</h3>
//                                 <div className="options-container">
//                                     {[
//                                         { value: '0', label: 'Normal Post' },
//                                         { value: '1', label: 'Timetable' },
//                                         { value: '2', label: 'Datesheet' },
//                                     ].map(option => (
//                                         <button
//                                             key={option.value}
//                                             className={`option-button ${type === option.value ? 'selected-option' : ''}`}
//                                             onClick={() => setType(option.value)}>
//                                             {option.label}
//                                         </button>
//                                     ))}
//                                 </div>
//                                 {(type === '1' || type === '2') && (
//                                     <p className="excel-note">
//                                         * Must include an Excel file (.xlsx or .xls)
//                                     </p>
//                                 )}
//                             </div>

//                             <div className="section">
//                                 <h3 className="section-title">Attachments</h3>
//                                 <div className="attachment-buttons">
//                                     <input
//                                         type="file"
//                                         id="file-upload"
//                                         className="file-input"
//                                         onChange={handleAttachFile}
//                                         multiple
//                                     />
//                                     <label htmlFor="file-upload" className="attachment-button">
//                                         <AttachFileIcon />
//                                         <span>Add Files</span>
//                                     </label>

//                                     <button
//                                         className="attachment-button"
//                                         onClick={handleTakePhoto}>
//                                         <PhotoCameraIcon />
//                                         <span>Take Photo</span>
//                                     </button>
//                                 </div>

//                                 {selectedDocuments.length > 0 && (
//                                     <div className="attachments-list">
//                                         {selectedDocuments.map((documentName, index) => (
//                                             <div key={index} className="attachment-item">
//                                                 {isImageAttachment(documentName) ? (
//                                                     <ImageIcon className="file-type-icon" />
//                                                 ) : isExcelFile(documentName) ? (
//                                                     <DescriptionIcon className="file-type-icon" />
//                                                 ) : (
//                                                     <InsertDriveFileIcon className="file-type-icon" />
//                                                 )}
//                                                 <span className="attachment-name">
//                                                     {documentName || 'Unnamed file'}
//                                                 </span>
//                                                 <button
//                                                     onClick={() => removeAttachment(index)}
//                                                     className="remove-attachment-button"
//                                                 >
//                                                     <CloseIcon className="remove-icon" />
//                                                 </button>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 )}
//                             </div>
//                         </div>

//                         <button
//                             className={`post-button ${uploading ? 'disabled-button' : ''}`}
//                             onClick={handleSubmitPost}
//                             disabled={uploading}>
//                             {uploading ? (
//                                 <div className="button-spinner"></div>
//                             ) : (
//                                 'Post'
//                             )}
//                         </button>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default TeacherWall;