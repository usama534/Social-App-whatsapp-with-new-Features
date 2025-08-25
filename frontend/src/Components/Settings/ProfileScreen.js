// // ProfileScreen.js
// import React from 'react';
// import './Settings.css';
// import Sidebar from '../Sidebar/Sidebar';
// const ProfileScreen = () => {
//     const user = {
//         name: 'Syed Shah Meer Haider',
//         role: 'student',
//         friends: ['Hassan Shahzad', 'Ch. Attique', 'Abdul Rafe'],
//         postDate: 'Feb 16, 2025',
//         postText:
//             'The Model Context Protocol is an open standard that enables developers to build secure, two-way connections between their data sources and AI-powered tools.',
//         postImage: '/sample-post.png', // you can place image in public folder
//         profileImage: '/sample-profile.png',
//     };

//     return (
//         <div className="profile-container">
//             <Sidebar />
//             <div className="header-section">

//                 <img
//                     src={user.profileImage}
//                     alt="Profile"
//                     className="profile-image"
//                 />
//                 <h2>{user.name}</h2>
//                 <p className="role">{user.role}</p>
//                 <div className="profile-buttons">
//                     <span>{user.friends.length} Friends</span>
//                     <button className="edit-btn">Edit Profile</button>
//                 </div>
//             </div>

//             <div className="friends-section">
//                 <div className="friends-header">
//                     <h3>Friends</h3>
//                     <a href="#kwjiw">View All</a>
//                 </div>
//                 <div className="friends-list">
//                     {user.friends.map((friend, index) => (
//                         <div className="friend-item" key={index}>
//                             <div className="friend-avatar" />
//                             <p>{friend}</p>
//                         </div>
//                     ))}
//                 </div>
//             </div>

//             <div className="posts-section">
//                 <div className="post-card">
//                     <div className="post-header">
//                         <img
//                             src={user.profileImage}
//                             alt="Profile"
//                             className="post-profile"
//                         />
//                         <div>
//                             <h4>{user.name}</h4>
//                             <span>{user.postDate}</span>
//                         </div>
//                         <div className="dots">•••</div>
//                     </div>
//                     <p className="post-text">{user.postText}</p>
//                     <img src={user.postImage} alt="Post" className="post-image" />
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ProfileScreen;
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import { useParams, useNavigate } from 'react-router-dom';
import {
    MdAdd,
    MdClose,
    MdComment,
    MdMoreVert,
    MdSend,
    MdAttachFile,
    MdPhotoCamera,
    MdImage,
    MdInsertDriveFile,
    MdPerson,
    MdFileDownload
} from 'react-icons/md';
import { FaSpinner, FaHeart } from 'react-icons/fa';
import API_URL from '../../Config';
import Sidebar from '../Sidebar/Sidebar';

const DEFAULT_PROFILE_PIC = 'https://via.placeholder.com/40';

const UserProfile = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [userData, setUserData] = useState({});
    const [friends, setFriends] = useState([]);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCommentSection, setShowCommentSection] = useState(false);
    const [selectedPostId, setSelectedPostId] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [commentLoading, setCommentLoading] = useState(false);
    const [showPostForm, setShowPostForm] = useState(false);
    const [content, setContent] = useState('');
    const [attachments, setAttachments] = useState([]);
    const [selectedDocuments, setSelectedDocuments] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [postData, setPostData] = useState({
        privacyLevel: '0',
        type: '0',
        allowCommenting: true,
        postOnTimeline: true,
    });

    const showMessage = (message) => {
        alert(message);
    };

    // Fetch user data
    const fetchUserData = async () => {
        try {
            const res = await axios.get(`${API_URL}api/user/getUserData/${userId}`);
            setUserData(res.data);
        } catch (error) {
            console.log('Error fetching user data:', error);
        }
    };

    // Fetch user's friends
    const fetchUserFriends = async () => {
        try {
            const res = await axios.get(`${API_URL}api/user/getFriends/${userId}`);
            setFriends(res.data);
        } catch (error) {
            console.log('Error fetching friends:', error);
        }
    };

    // Fetch user's posts
    const fetchUserPosts = async () => {
        try {
            const res = await axios.get(`${API_URL}api/posts/getPosts/${userId}`);
            const sortedPosts = res.data.sort(
                (a, b) => new Date(b.postData.createdAt) - new Date(a.postData.createdAt),
            );
            setPosts(sortedPosts);
        } catch (error) {
            console.log('Error fetching Posts:', error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch comments for a post
    const fetchComments = async (postId) => {
        if (!postId) return;
        try {
            setCommentLoading(true);
            const response = await axios.get(
                `${API_URL}api/posts/getComments/${postId}/${userId}`,
            );
            const formattedComments = (response.data || []).map((comment) => ({
                ...comment,
                authorData: {
                    ...(comment.authorData || {}),
                    name: comment.authorData?.name || 'Unknown User',
                    imgUrl: comment.authorData?.imgUrl || null,
                },
            }));
            setComments(formattedComments);
        } catch (error) {
            console.error('Error fetching comments:', error);
            showMessage('Failed to load comments');
            setComments([]);
        } finally {
            setCommentLoading(false);
        }
    };

    // Handle adding a comment
    const handleAddComment = async () => {
        if (!selectedPostId || !newComment.trim()) {
            showMessage('Please enter a comment');
            return;
        }
        try {
            await axios.post(`${API_URL}api/posts/addComment/${selectedPostId}`, {
                author: userId,
                content: newComment,
            });
            setNewComment('');
            fetchComments(selectedPostId);
            setPosts((currentPosts) =>
                currentPosts.map((p) => {
                    if (p._id === selectedPostId) {
                        return { ...p, commentCount: (p.commentCount || 0) + 1 };
                    }
                    return p;
                }),
            );
        } catch (error) {
            console.error('Error adding comment:', error);
            showMessage('Failed to add comment');
        }
    };

    // Handle like/unlike a post
    const handleLike = async (postId) => {
        if (!postId) return;

        try {
            const post = posts.find((p) => p && p._id === postId);
            if (!post) return;

            const isLiked = post.hasLiked;

            await axios.put(
                `${API_URL}api/posts/togglePostLike/${postId}/${userId}/${isLiked}`,
            );

            const updatedPosts = posts.map((p) => {
                if (p && p._id === postId) {
                    return {
                        ...p,
                        hasLiked: !isLiked,
                        likesCount: isLiked
                            ? (p.likesCount || 0) - 1
                            : (p.likesCount || 0) + 1,
                    };
                }
                return p;
            });

            setPosts(updatedPosts);
        } catch (error) {
            console.error('Error handling like:', error);
            showMessage('Failed to update like');
        }
    };

    // Handle deleting a post
    const handleDeletePost = async (postId) => {
        if (!postId) return;
        try {
            await axios.delete(`${API_URL}api/posts/deletePost/${postId}`);
            showMessage('Post deleted successfully');
            fetchUserPosts();
        } catch (error) {
            console.error('Error deleting post:', error);
            showMessage('Failed to delete post');
        }
    };

    // Show delete option for user's own posts
    const showDeleteOption = (postId) => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            handleDeletePost(postId);
        }
    };

    // File handling functions
    const isImageAttachment = (fileName) => {
        if (!fileName) return false;
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
        return imageExtensions.some((ext) => fileName.toLowerCase().endsWith(ext));
    };

    const getFullFileUrl = (relativeUrl) => {
        if (!relativeUrl) return null;
        if (relativeUrl.startsWith('http://') || relativeUrl.startsWith('https://')) {
            return relativeUrl;
        }
        const IMG_BASE_URL = API_URL.replace(/\/api$/, '');
        return `${IMG_BASE_URL}${relativeUrl.startsWith('/') ? '' : '/'}${relativeUrl}`;
    };

    const downloadAndOpenFile = async (fileUrl) => {
        const fullUrl = getFullFileUrl(fileUrl);
        if (fullUrl) {
            window.open(fullUrl, '_blank');
        } else {
            showMessage('Invalid file URL');
        }
    };

    const openImageViewer = (imageUrl) => {
        const fullUrl = getFullFileUrl(imageUrl);
        if (fullUrl) {
            window.open(fullUrl, '_blank');
        } else {
            showMessage('Invalid image URL');
        }
    };

    // Post creation functions
    const handleAttachFile = async () => {
        try {
            const input = document.createElement('input');
            input.type = 'file';
            input.multiple = true;
            input.onchange = (e) => {
                const files = Array.from(e.target.files);
                const newAttachments = files.map((file) => ({
                    file,
                    name: file.name,
                    type: file.type,
                }));
                setAttachments((prev) => [...prev, ...newAttachments]);
                setSelectedDocuments((prev) => [
                    ...prev,
                    ...files.map((f) => f.name || `file_${Date.now()}`),
                ]);
            };
            input.click();
        } catch (error) {
            console.error('Error picking file:', error);
            showMessage('Failed to attach file(s)');
        }
    };

    const handleTakePhoto = async () => {
        try {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.capture = 'environment';
            input.onchange = (e) => {
                const file = e.target.files[0];
                if (file) {
                    const newAttachment = {
                        file,
                        name: file.name || `photo_${Date.now()}.jpg`,
                        type: file.type || 'image/jpeg',
                    };
                    setAttachments((prev) => [...prev, newAttachment]);
                    setSelectedDocuments((prev) => [...prev, newAttachment.name]);
                }
            };
            input.click();
        } catch (error) {
            console.error('Error taking photo:', error);
            showMessage('Failed to take photo');
        }
    };

    const removeAttachment = (indexToRemove) => {
        setAttachments((prev) => prev.filter((_, index) => index !== indexToRemove));
        setSelectedDocuments((prev) =>
            prev.filter((_, index) => index !== indexToRemove),
        );
    };

    const handlePostFieldChange = (field, value) => {
        setPostData((prev) => ({ ...prev, [field]: value }));
    };

    const resetPostForm = () => {
        setContent('');
        setAttachments([]);
        setSelectedDocuments([]);
        setPostData({
            privacyLevel: '0',
            type: '0',
            allowCommenting: true,
            postOnTimeline: true,
        });
    };

    const handleSubmitPost = async () => {
        if ((!content || !content.trim()) && attachments.length === 0) {
            showMessage('Please add content or at least one attachment.');
            return;
        }
        try {
            setUploading(true);
            const formData = new FormData();
            formData.append('author', userId);
            formData.append('content', content.trim());
            formData.append('privacyLevel', postData.privacyLevel);
            formData.append('type', postData.type);
            formData.append('allowCommenting', postData.allowCommenting);
            formData.append('postOnTimeline', postData.postOnTimeline);

            attachments.forEach((attachment) => {
                if (attachment?.file) {
                    formData.append('attachments', attachment.file, attachment.name);
                }
            });

            const response = await axios.post(
                `${API_URL}api/posts/addPost`,
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } },
            );
            if (response.status === 200 || response.status === 201) {
                showMessage('Post created successfully!');
                setShowPostForm(false);
                resetPostForm();
                fetchUserPosts();
            } else {
                showMessage(`Post created, but received status: ${response.status}`);
            }
        } catch (error) {
            console.error(
                'Error creating post:',
                error.response?.data || error.message,
            );
            showMessage(
                error.response?.data?.message ||
                'Failed to create post. Please try again.',
            );
        } finally {
            setUploading(false);
        }
    };

    // Initial data load
    useEffect(() => {
        const loadInitialData = async () => {
            try {
                setLoading(true);
                await Promise.all([
                    fetchUserData(),
                    fetchUserFriends(),
                    fetchUserPosts(),
                ]);
            } catch (error) {
                console.error('Error loading initial data:', error);
            }
        };
        loadInitialData();
    }, [userId]);

    const styles = {
        container: {
            backgroundColor: '#F8F8F8',
            minHeight: '100vh',
            position: 'relative',
            marginLeft: '200px',
        },
        scrollContainer: {
            paddingBottom: '20px',
        },
        headerImage: {
            height: '143px',
            width: '100%',
            position: 'absolute',
            background: 'linear-gradient(to right, #14AE5C, #01A082)',
        },
        userInfoContainer: {
            display: 'flex',
            alignItems: 'center',
            marginTop: '30px',
            padding: '0 20px',
            marginBottom: '50px',
        },
        userImage: {
            height: '65px',
            width: '65px',
            borderRadius: '50%',
            marginRight: '15px',
            objectFit: 'cover',
        },
        userName: {
            fontSize: '18px',
            fontWeight: 'bold',
            color: 'white',
        },
        username: {
            fontSize: '14px',
            color: 'white',
        },
        userTypeContainer: {
            marginLeft: 'auto',
            backgroundColor: 'white',
            padding: '4px 10px',
            borderRadius: '8px',
            position: 'relative',
            top: '50px',
            right: '30px',
        },
        userType: {
            fontSize: '13px',
            color: '#333',
            fontWeight: '600',
        },
        friendsCountContainer: {
            display: 'flex',
            justifyContent: 'space-between',
            padding: '20px',
            alignItems: 'center',
            borderRadius: '10px',
            marginTop: '15px',
            backgroundColor: 'white',
        },
        friendCount: {
            fontSize: '16px',
            fontWeight: '400',
            marginBottom: '5px',
            color: '#222',
        },
        bioText: {
            fontSize: '13px',
            fontFamily: 'Courier, monospace',
            color: '#555',
        },
        editButton: {
            backgroundColor: '#CFF7D3',
            padding: '6px 14px',
            borderRadius: '6px',
            border: '1px solid #CFF7D3',
            color: '#009951',
            fontWeight: '400',
            cursor: 'pointer',
        },
        friendsHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            padding: '0 20px',
            margin: '10px 0',
        },
        friendsHeading: {
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#000',
        },
        friendsList: {
            display: 'flex',
            padding: '0 0 10px 20px',
            overflowX: 'auto',
            gap: '15px',
        },
        friendCard: {
            display: 'flex',
            alignItems: 'center',
            width: '80px',
        },
        friendImage: {
            width: '65px',
            height: '65px',
            borderRadius: '50%',
            marginBottom: '5px',
            backgroundColor: '#ccc',
            objectFit: 'cover',
        },
        friendName: {
            fontSize: '12px',
            textAlign: 'center',
            color: 'black',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            width: '100%',
        },
        postsHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            padding: '0 20px',
            margin: '20px 0 10px',
        },
        postsHeading: {
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#000',
        },
        postsList: {
            padding: '0 16px',
            paddingBottom: '80px',
        },
        loadingContainer: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            backgroundColor: '#F8F8F8',
        },
        postContainer: {
            backgroundColor: '#fff',
            padding: '16px',
            marginBottom: '12px',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
            margin: '0 16px 12px',
        },
        authorContainer: {
            display: 'flex',
            alignItems: 'center',
            marginBottom: '12px',
        },
        authorInfo: {
            flex: 1,
            marginLeft: '10px',
        },
        avatar: {
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            objectFit: 'cover',
        },
        authorName: {
            fontWeight: '600',
            fontSize: '15px',
            color: '#222',
        },
        postDate: {
            fontSize: '12px',
            color: '#777',
        },
        moreOptionsButton: {
            padding: '5px',
            marginLeft: '10px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
        },
        postContent: {
            fontSize: '14.5px',
            color: '#333',
            lineHeight: '21px',
            margin: '4px 0 8px',
        },
        attachmentsContainer: {
            marginTop: '12px',
        },
        imageAttachmentContainer: {
            marginBottom: '8px',
            borderRadius: '8px',
            overflow: 'hidden',
            border: 'none',
            padding: 0,
            background: 'none',
            cursor: 'pointer',
        },
        attachmentImage: {
            width: '100%',
            height: '250px',
            backgroundColor: '#eee',
            objectFit: 'cover',
        },
        attachmentItemRow: {
            display: 'flex',
            alignItems: 'center',
            padding: '10px 12px',
            backgroundColor: '#f0f8ff',
            borderRadius: '8px',
            marginBottom: '8px',
            border: '1px solid #d0e0f0',
            width: '100%',
            cursor: 'pointer',
        },
        attachmentIcon: {
            marginRight: '10px',
        },
        attachmentLink: {
            flex: 1,
            color: '#01A082',
            fontSize: '14px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
        },
        downloadIcon: {
            marginLeft: '10px',
        },
        interactionContainer: {
            display: 'flex',
            marginTop: '12px',
            borderTop: '1px solid #eee',
            paddingTop: '12px',
        },
        interactionButton: {
            display: 'flex',
            alignItems: 'center',
            marginRight: '20px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
        },
        interactionText: {
            marginRight: '5px',
            color: '#555',
            fontSize: '14px',
        },
        commentIcon: {
            marginLeft: '2px',
        },
        noPosts: {
            textAlign: 'center',
            marginTop: '20px',
            color: '#666',
            fontSize: '16px',
        },
        commentsSection: {
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            height: '70%',
            backgroundColor: '#fff',
            borderTopLeftRadius: '20px',
            borderTopRightRadius: '20px',
            padding: '16px',
            boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
            zIndex: 1000,
        },
        commentsHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
        },
        commentsTitle: {
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#333',
        },
        commentsList: {
            flexGrow: 1,
            paddingBottom: '80px',
        },
        commentItem: {
            display: 'flex',
            marginBottom: '16px',
        },
        commentAvatar: {
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            marginRight: '10px',
            objectFit: 'cover',
        },
        commentContent: {
            flex: 1,
            backgroundColor: '#f5f5f5',
            padding: '12px',
            borderRadius: '12px',
        },
        commentAuthor: {
            fontWeight: '600',
            fontSize: '14px',
            color: '#333',
            marginBottom: '4px',
        },
        commentText: {
            fontSize: '14px',
            color: '#333',
            lineHeight: '20px',
        },
        commentTime: {
            fontSize: '12px',
            color: '#777',
            marginTop: '4px',
        },
        noCommentsText: {
            textAlign: 'center',
            marginTop: '20px',
            color: '#666',
        },
        commentInputContainer: {
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#f5f5f5',
            borderRadius: '25px',
            padding: '8px 16px',
            marginTop: '8px',
        },
        commentInput: {
            flex: 1,
            maxHeight: '100px',
            padding: '8px 0',
            fontSize: '14px',
            color: '#333',
            border: 'none',
            background: 'transparent',
            outline: 'none',
        },
        commentPostButton: {
            marginLeft: '8px',
            padding: '8px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
        },
        postFormContainer: {
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            height: '85%',
            backgroundColor: '#fff',
            borderTopLeftRadius: '20px',
            borderTopRightRadius: '20px',
            padding: '16px',
            boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
            zIndex: 1000,
        },
        postFormHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
        },
        postFormTitle: {
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#333',
        },
        postFormScroll: {
            flex: 1,
            overflowY: 'auto',
        },
        postInput: {
            minHeight: '100px',
            fontSize: '16px',
            color: '#333',
            padding: '12px',
            backgroundColor: '#f5f5f5',
            borderRadius: '12px',
            marginBottom: '16px',
            border: 'none',
            outline: 'none',
            resize: 'vertical',
            width: '100%',
        },
        section: {
            marginBottom: '20px',
        },
        sectionTitle: {
            fontSize: '16px',
            fontWeight: '600',
            color: '#333',
            marginBottom: '12px',
        },
        optionsContainer: {
            display: 'flex',
            flexWrap: 'wrap',
            marginBottom: '8px',
            gap: '8px',
        },
        optionButton: {
            padding: '8px 16px',
            borderRadius: '20px',
            border: '1px solid #ddd',
            background: 'none',
            cursor: 'pointer',
        },
        selectedOption: {
            backgroundColor: '#14AE5C',
            borderColor: '#14AE5C',
            color: 'white',
        },
        optionText: {
            fontSize: '14px',
            color: '#555',
        },
        selectedOptionText: {
            color: '#fff',
        },
        optionRow: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '12px',
        },
        optionLabel: {
            fontSize: '15px',
            color: '#333',
        },
        attachmentButtons: {
            display: 'flex',
            marginBottom: '12px',
            gap: '12px',
        },
        attachmentButton: {
            display: 'flex',
            alignItems: 'center',
            padding: '8px 16px',
            backgroundColor: '#f0f8ff',
            borderRadius: '20px',
            cursor: 'pointer',
            border: 'none',
        },
        attachmentButtonText: {
            marginLeft: '8px',
            color: '#14AE5C',
            fontSize: '14px',
        },
        attachmentsList: {
            marginTop: '8px',
        },
        attachmentItem: {
            display: 'flex',
            alignItems: 'center',
            padding: '10px 12px',
            backgroundColor: '#f5f5f5',
            borderRadius: '8px',
            marginBottom: '8px',
        },
        attachmentName: {
            flex: 1,
            fontSize: '14px',
            color: '#333',
            marginRight: '8px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
        },
        postButton: {
            backgroundColor: '#14AE5C',
            padding: '14px',
            borderRadius: '8px',
            color: '#fff',
            fontSize: '16px',
            fontWeight: '600',
            border: 'none',
            cursor: 'pointer',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        },
        disabledButton: {
            backgroundColor: '#a0a0a0',
            cursor: 'not-allowed',
        },
        fab: {
            width: '50px',
            height: '50px',
            backgroundColor: '#14AE5C',
            position: 'fixed',
            bottom: '10px',
            right: '20px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '50%',
            cursor: 'pointer',
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
            zIndex: 100,
        },
        fabPressed: {
            backgroundColor: '#108a4a',
        },
    };

    const renderFriendItem = (item) => (
        <div key={item._id} style={styles.friendCard}>
            <img
                src={item.imgUrl ? `${API_URL}${item.imgUrl}` : DEFAULT_PROFILE_PIC}
                alt={item.name}
                style={styles.friendImage}
            />
            <div style={styles.friendName}>{item.name}</div>
        </div>
    );

    const renderPostItem = (item) => (
        <div key={item._id} style={styles.postContainer}>
            <div style={styles.authorContainer}>
                <img
                    src={
                        getFullFileUrl(item.postData.authorData?.imgUrl) || DEFAULT_PROFILE_PIC
                    }
                    alt={item.postData.authorData?.name || 'Unknown User'}
                    style={styles.avatar}
                />
                <div style={styles.authorInfo}>
                    <div style={styles.authorName}>
                        {item.postData.authorData?.name || 'Unknown User'}
                    </div>
                    <div style={styles.postDate}>
                        {moment(item.postData.createdAt).fromNow()}
                    </div>
                </div>
                {item.postData.authorData?._id === userId && (
                    <button
                        onClick={() => showDeleteOption(item.postData._id)}
                        style={styles.moreOptionsButton}
                    >
                        <MdMoreVert size={24} color="#555" />
                    </button>
                )}
            </div>

            {item.postData.content && (
                <div style={styles.postContent}>{item.postData.content}</div>
            )}

            {item.postData.attachments && item.postData.attachments.length > 0 && (
                <div style={styles.attachmentsContainer}>
                    {item.postData.attachments.map((attachment, index) => {
                        if (!attachment) return null;
                        const fileName = attachment.split('/').pop();
                        const isImage = isImageAttachment(fileName);
                        const fullAttachmentUrl = getFullFileUrl(attachment);
                        if (!fullAttachmentUrl) return null;
                        return isImage ? (
                            <button
                                key={index}
                                onClick={() => openImageViewer(attachment)}
                                style={styles.imageAttachmentContainer}
                            >
                                <img
                                    src={fullAttachmentUrl}
                                    alt="Attachment"
                                    style={styles.attachmentImage}
                                />
                            </button>
                        ) : (
                            <button
                                key={index}
                                style={styles.attachmentItemRow}
                                onClick={() => downloadAndOpenFile(attachment)}
                            >
                                <MdAttachFile size={20} color="#01A082" style={styles.attachmentIcon} />
                                <div style={styles.attachmentLink}>
                                    {fileName || 'Download file'}
                                </div>
                                <MdFileDownload size={20} color="#01A082" style={styles.downloadIcon} />
                            </button>
                        );
                    })}
                </div>
            )}

            <div style={styles.interactionContainer}>
                <button
                    style={styles.interactionButton}
                    onClick={() => handleLike(item._id)}
                >
                    <div style={styles.interactionText}>{item.likesCount || 0}</div>
                    <FaHeart
                        size={18}
                        color={item.hasLiked ? '#14AE5C' : '#828282'}
                    />
                </button>
                <button
                    style={styles.interactionButton}
                    onClick={() => {
                        setSelectedPostId(item._id);
                        setShowCommentSection(true);
                        fetchComments(item._id);
                    }}
                >
                    <div style={styles.interactionText}>{item.commentCount || 0}</div>
                    <MdComment size={20} color="#828282" style={styles.commentIcon} />
                </button>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div style={styles.loadingContainer}>
                <FaSpinner size={40} color="#14AE5C" className="spinner" />
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <Sidebar />
            <div style={styles.headerImage}></div>

            {/* User Info Section */}
            <div style={styles.userInfoContainer}>
                <img
                    src={userData.imgUrl ? `${API_URL}${userData.imgUrl}` : DEFAULT_PROFILE_PIC}
                    alt={userData.name}
                    style={styles.userImage}
                />
                <div>
                    <div style={styles.userName}>{userData.name}</div>
                    <div style={styles.username}>@{userData.name}</div>
                </div>
                <div style={styles.userTypeContainer}>
                    <div style={styles.userType}>{userData.type}</div>
                </div>
            </div>

            {/* Friends Count & Edit Button */}
            <div style={styles.friendsCountContainer}>
                <div>
                    <div style={styles.friendCount}>{friends.length} Friends</div>
                    <div style={styles.bioText}>this→insomniac = true;</div>
                </div>
                <button style={styles.editButton}>Edit Profile</button>
            </div>

            {/* Friends List */}
            <div style={styles.friendsHeader}>
                <div style={styles.friendsHeading}>Friends</div>
            </div>
            <div style={styles.friendsList}>
                {friends.map(renderFriendItem)}
            </div>

            {/* Posts Section */}
            <div style={styles.postsHeader}>
                <div style={styles.postsHeading}>Posts</div>
            </div>
            <div style={styles.postsList}>
                {posts.length > 0 ? (
                    posts.map(renderPostItem)
                ) : (
                    <div style={styles.noPosts}>No posts to show yet. Create one!</div>
                )}
            </div>

            {/* Comment Section */}
            {showCommentSection && (
                <div style={styles.commentsSection}>
                    <div style={styles.commentsHeader}>
                        <div style={styles.commentsTitle}>Comments</div>
                        <button onClick={() => setShowCommentSection(false)}>
                            <MdClose size={24} color="#333" />
                        </button>
                    </div>
                    {commentLoading ? (
                        <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
                            <FaSpinner size={40} color="#14AE5C" className="spinner" />
                        </div>
                    ) : (
                        <div style={styles.commentsList}>
                            {comments.length > 0 ? (
                                comments.map((item) => (
                                    <div style={styles.commentItem} key={item._id}>
                                        <img
                                            src={
                                                getFullFileUrl(item.authorData?.imgUrl) || DEFAULT_PROFILE_PIC
                                            }
                                            alt={item.authorData?.name || 'Unknown User'}
                                            style={styles.commentAvatar}
                                        />
                                        <div style={styles.commentContent}>
                                            <div style={styles.commentAuthor}>
                                                {item.authorData?.name || 'Unknown User'}
                                            </div>
                                            <div style={styles.commentText}>{item.content}</div>
                                            <div style={styles.commentTime}>
                                                {moment(item.createdAt).fromNow()}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div style={styles.noCommentsText}>
                                    No comments yet. Be the first!
                                </div>
                            )}
                        </div>
                    )}
                    <div style={styles.commentInputContainer}>
                        <input
                            type="text"
                            style={styles.commentInput}
                            placeholder="Write a comment..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                        />
                        <button
                            style={styles.commentPostButton}
                            onClick={handleAddComment}
                            disabled={!newComment.trim()}
                        >
                            <MdSend
                                size={24}
                                color={newComment.trim() ? '#14AE5C' : '#aaa'}
                            />
                        </button>
                    </div>
                </div>
            )}

            {/* Create Post Form */}
            {showPostForm && (
                <div style={styles.postFormContainer}>
                    <div style={styles.postFormHeader}>
                        <div style={styles.postFormTitle}>Create New Post</div>
                        <button
                            onClick={() => !uploading && setShowPostForm(false)}
                            disabled={uploading}
                        >
                            <MdClose size={24} color="#333" />
                        </button>
                    </div>
                    <div style={styles.postFormScroll}>
                        <textarea
                            style={styles.postInput}
                            placeholder="What's on your mind?"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />

                        <div style={styles.section}>
                            <div style={styles.sectionTitle}>Post Type</div>
                            <div style={styles.optionsContainer}>
                                {[
                                    { value: '0', label: 'Normal Post' },
                                    { value: '1', label: 'Timetable' },
                                    { value: '2', label: 'Datesheet' },
                                ].map((option) => (
                                    <button
                                        key={option.value}
                                        style={{
                                            ...styles.optionButton,
                                            ...(postData.type === option.value && styles.selectedOption),
                                        }}
                                        onClick={() => handlePostFieldChange('type', option.value)}
                                    >
                                        <div
                                            style={{
                                                ...styles.optionText,
                                                ...(postData.type === option.value && styles.selectedOptionText),
                                            }}
                                        >
                                            {option.label}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div style={styles.section}>
                            <div style={styles.sectionTitle}>Privacy Level</div>
                            <div style={styles.optionsContainer}>
                                {[
                                    { value: '0', label: 'Public' },
                                    { value: '1', label: 'Friends' },
                                    { value: '2', label: 'Private' },
                                ].map((option) => (
                                    <button
                                        key={option.value}
                                        style={{
                                            ...styles.optionButton,
                                            ...(postData.privacyLevel === option.value && styles.selectedOption),
                                        }}
                                        onClick={() => handlePostFieldChange('privacyLevel', option.value)}
                                    >
                                        <div
                                            style={{
                                                ...styles.optionText,
                                                ...(postData.privacyLevel === option.value && styles.selectedOptionText),
                                            }}
                                        >
                                            {option.label}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div style={styles.section}>
                            <div style={styles.sectionTitle}>Post Options</div>
                            <div style={styles.optionRow}>
                                <div style={styles.optionLabel}>Allow Comments</div>
                                <label className="switch">
                                    <input
                                        type="checkbox"
                                        checked={postData.allowCommenting}
                                        onChange={(e) => handlePostFieldChange('allowCommenting', e.target.checked)}
                                    />
                                    <span className="slider round"></span>
                                </label>
                            </div>
                            <div style={styles.optionRow}>
                                <div style={styles.optionLabel}>Post on Timeline</div>
                                <label className="switch">
                                    <input
                                        type="checkbox"
                                        checked={postData.postOnTimeline}
                                        onChange={(e) => handlePostFieldChange('postOnTimeline', e.target.checked)}
                                    />
                                    <span className="slider round"></span>
                                </label>
                            </div>
                        </div>

                        <div style={styles.section}>
                            <div style={styles.sectionTitle}>Attachments</div>
                            <div style={styles.attachmentButtons}>
                                <button
                                    style={styles.attachmentButton}
                                    onClick={handleAttachFile}
                                >
                                    <MdAttachFile size={20} color="#14AE5C" />
                                    <div style={styles.attachmentButtonText}>Add Files</div>
                                </button>
                                <button
                                    style={styles.attachmentButton}
                                    onClick={handleTakePhoto}
                                >
                                    <MdPhotoCamera size={20} color="#14AE5C" />
                                    <div style={styles.attachmentButtonText}>Take Photo</div>
                                </button>
                            </div>
                            {selectedDocuments.length > 0 && (
                                <div style={styles.attachmentsList}>
                                    {selectedDocuments.map((documentName, index) => (
                                        <div key={index} style={styles.attachmentItem}>
                                            {isImageAttachment(documentName) ? (
                                                <MdImage size={20} color="#14AE5C" style={{ marginRight: '8px' }} />
                                            ) : (
                                                <MdInsertDriveFile size={20} color="#14AE5C" style={{ marginRight: '8px' }} />
                                            )}
                                            <div style={styles.attachmentName}>
                                                {documentName || 'Unnamed file'}
                                            </div>
                                            <button onClick={() => removeAttachment(index)}>
                                                <MdClose size={20} color="#ff4444" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    <button
                        style={{
                            ...styles.postButton,
                            ...(uploading && styles.disabledButton),
                        }}
                        onClick={handleSubmitPost}
                        disabled={uploading}
                    >
                        {uploading ? (
                            <FaSpinner className="spinner" color="#fff" />
                        ) : (
                            'Post'
                        )}
                    </button>
                </div>
            )}

            {/* Floating Action Button */}
            {!showPostForm && !showCommentSection && (
                <button
                    style={styles.fab}
                    onClick={() => {
                        resetPostForm();
                        setShowPostForm(true);
                    }}
                >
                    <MdAdd size={25} color="#fff" />
                </button>
            )}

            <style>{`
        .spinner {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .switch {
          position: relative;
          display: inline-block;
          width: 60px;
          height: 34px;
        }
        .switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }
        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          transition: .4s;
        }
        .slider:before {
          position: absolute;
          content: "";
          height: 26px;
          width: 26px;
          left: 4px;
          bottom: 4px;
          background-color: white;
          transition: .4s;
        }
        input:checked + .slider {
          background-color: #14AE5C;
        }
        input:focus + .slider {
          box-shadow: 0 0 1px #14AE5C;
        }
        input:checked + .slider:before {
          transform: translateX(26px);
        }
        .slider.round {
          border-radius: 34px;
        }
        .slider.round:before {
          border-radius: 50%;
        }
      `}</style>
        </div>
    );
};

export default UserProfile;