import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import {
    FaEllipsisV, FaComment, FaCamera, FaPaperclip,
    FaImage, FaFileAlt, FaDownload, FaPlus,
    FaCheckCircle, FaTimes, FaThumbsUp, FaPaperPlane
} from 'react-icons/fa';
import API_URL from '../../Config';
import Sidebar from '../Sidebar/Sidebar';

const GroupDetailsAndPosts = () => {
    const USER_ID = localStorage.getItem('userId');
    const { id: groupId } = useParams();
    const navigate = useNavigate();
    const [groupInfo, setGroupInfo] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isMember, setIsMember] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isCreator, setIsCreator] = useState(false);
    const [showCommentSection, setShowCommentSection] = useState(false);
    const [selectedPostId, setSelectedPostId] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [commentLoading, setCommentLoading] = useState(false);
    const [requestSent, setRequestSent] = useState(false);
    const [membersCount, setMembersCount] = useState(0);
    const [leaving, setLeaving] = useState(false);
    const [showPostForm, setShowPostForm] = useState(false);
    const [content, setContent] = useState('');
    const [attachments, setAttachments] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [postData, setPostData] = useState({
        privacyLevel: '0',
        type: '0',
        allowCommenting: true,
        postOnTimeline: true,
    });

    const DEFAULT_PROFILE_PIC = 'https://via.placeholder.com/40';


    const getFullFileUrl = (relativeUrl) => {
        if (!relativeUrl) return null;
        if (relativeUrl.startsWith('http')) return relativeUrl;
        return `${API_URL.replace('/api', '')}${relativeUrl.startsWith('/') ? '' : '/'}${relativeUrl}`;
    };

    const isImageAttachment = (fileName) => {
        if (!fileName) return false;
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
        return imageExtensions.some(ext => fileName.toLowerCase().endsWith(ext));
    };

    // API functions
    const fetchGroupData = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}api/postgroup/getGroup/${groupId}/${USER_ID}`);
            const data = response.data;
            setGroupInfo(data.groupInfo);
            setPosts(data.posts || []);
            setIsAdmin(data.isAdmin);
            setIsCreator(data.isCreator);
        } catch (error) {
            console.error('Error fetching group data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchGroupMembersCount = async () => {
        try {
            const response = await axios.get(`${API_URL}/postgroup/getGroupMembers/${groupId}`);
            setMembersCount(response.data.members?.length || 0);
        } catch (error) {
            console.error('Error fetching members count:', error);
        }
    };

    const checkUserMembership = async () => {
        try {
            const response = await axios.get(`${API_URL}api/postgroup/getGroupMembers/${groupId}`);
            setIsMember(response.data.members?.includes(USER_ID) || false);
        } catch (error) {
            console.error('Error checking user membership:', error);
            setIsMember(false);
        }
    };

    const fetchComments = async (postId) => {
        if (!postId) return;
        try {
            setCommentLoading(true);
            const response = await axios.get(`${API_URL}api/posts/getComments/${postId}/${USER_ID}`);
            setComments(response.data || []);
        } catch (error) {
            console.error('Error fetching comments:', error);
            setComments([]);
        } finally {
            setCommentLoading(false);
        }
    };

    // Event handlers
    const handleAddComment = async () => {
        if (!selectedPostId || !newComment.trim()) return;

        try {
            await axios.post(`${API_URL}api/posts/addComment/${selectedPostId}`, {
                author: USER_ID,
                content: newComment,
            });
            setNewComment('');
            fetchComments(selectedPostId);
            setPosts(prevPosts =>
                prevPosts.map(post =>
                    post._id === selectedPostId
                        ? { ...post, commentCount: (post.commentCount || 0) + 1 }
                        : post
                )
            );
        } catch (error) {
            console.error('Error adding comment:', error);
            alert('Failed to add comment');
        }
    };

    const handleLike = async (postId) => {
        try {
            const post = posts.find(p => p._id === postId);
            if (!post) return;

            const isLiked = post.hasLiked;

            await axios.put(
                `${API_URL}api/posts/togglePostLike/${postId}/${USER_ID}/${isLiked}`
            );

            setPosts(prevPosts =>
                prevPosts.map(p =>
                    p._id === postId
                        ? {
                            ...p,
                            hasLiked: !isLiked,
                            likesCount: isLiked ? p.likesCount - 1 : p.likesCount + 1,
                        }
                        : p
                )
            );
        } catch (error) {
            console.error('Error handling like:', error);
        }
    };

    const handleJoinRequest = async () => {
        try {
            const response = await axios.post(
                `${API_URL}api/postgroup/joinGroup/${groupId}/${USER_ID}`
            );
            alert(response.data.message);
            if (response.data.message === 'Requested..') {
                setRequestSent(true);
                navigate('/GroupJoinRequests')
            } else {
                fetchGroupData();
            }
        } catch (error) {
            console.error('Error sending join request:', error);
            alert('Failed to send join request');
        }
    };

    const handleLeaveGroup = async () => {
        if (isCreator) {
            if (!window.confirm('If you leave this group, it will be permanently deleted. Are you sure?')) {
                return;
            }
            try {
                setLeaving(true);
                await axios.delete(`${API_URL}api/postgroup/deleteGroup/${groupId}`);
                alert('Group has been deleted');
                navigate('/groups');
            } catch (error) {
                console.error('Delete group error:', error);
                alert(error.response?.data?.message || 'Failed to delete group');
            } finally {
                setLeaving(false);
            }
        } else {
            if (!window.confirm('Are you sure you want to leave this group?')) {
                return;
            }
            try {
                setLeaving(true);
                await axios.post(`${API_URL}api/postgroup/removeMember/${groupId}/${USER_ID}`);
                alert('You have left the group');
                navigate('/groups');
            } catch (error) {
                console.error('Leave group error:', error);
                alert(error.response?.data?.error || 'Failed to leave group');
            } finally {
                setLeaving(false);
            }
        }
    };

    // Post creation handlers
    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            setAttachments(files);
        }
    };

    const handleSubmitPost = async () => {
        if ((!content || !content.trim()) && attachments.length === 0) {
            alert('Please add content or at least one attachment.');
            return;
        }

        try {
            setUploading(true);
            const formData = new FormData();
            formData.append('author', USER_ID);
            formData.append('content', content.trim());
            formData.append('privacyLevel', postData.privacyLevel);
            formData.append('type', postData.type);
            formData.append('allowCommenting', postData.allowCommenting);
            formData.append('postOnTimeline', postData.postOnTimeline);
            formData.append('group_ids[]', groupId);

            attachments.forEach(file => {
                formData.append('attachments', file);
            });

            await axios.post(`${API_URL}/posts/addPost`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            alert('Post created successfully!');
            setShowPostForm(false);
            setContent('');
            setAttachments([]);
            fetchGroupData();
        } catch (error) {
            console.error('Error creating post:', error);
            alert(error.response?.data?.message || 'Failed to create post');
        } finally {
            setUploading(false);
        }
    };

    // Effects
    useEffect(() => {
        fetchGroupData();
        fetchGroupMembersCount();
        checkUserMembership();
    }, [groupId]);

    // Styles
    const styles = {
        container: {
            backgroundColor: '#f5f5f5',
            minHeight: '100vh',
            padding: '20px',
            marginLeft: '200px'
        },
        loadingContainer: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh'
        },
        groupHeader: {
            backgroundColor: '#fff',
            padding: '20px',
            borderRadius: '8px',
            marginBottom: '20px',
            textAlign: 'center'
        },
        groupImage: {
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            marginBottom: '16px',
            objectFit: 'cover'
        },
        groupName: {
            fontSize: '22px',
            fontWeight: 'bold',
            marginBottom: '8px',
            color: '#333'
        },
        groupMembers: {
            fontSize: '14px',
            color: '#666',
            marginBottom: '12px'
        },
        groupDescription: {
            fontSize: '15px',
            color: '#444',
            marginBottom: '16px'
        },
        groupActions: {
            display: 'flex',
            justifyContent: 'center',
            gap: '10px'
        },
        actionButton: {
            backgroundColor: '#e0e0e0',
            padding: '10px 20px',
            borderRadius: '20px',
            border: 'none',
            cursor: 'pointer'
        },
        joinButton: {
            backgroundColor: '#14AE5C',
            padding: '10px 20px',
            borderRadius: '20px',
            border: 'none',
            color: 'white',
            cursor: 'pointer'
        },
        postContainer: {
            backgroundColor: '#fff',
            padding: '16px',
            marginBottom: '12px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        },
        authorContainer: {
            display: 'flex',
            alignItems: 'center',
            marginBottom: '12px'
        },
        avatar: {
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            marginRight: '10px'
        },
        authorName: {
            fontWeight: '600',
            fontSize: '15px',
            color: '#222'
        },
        postDate: {
            fontSize: '12px',
            color: '#777'
        },
        postContent: {
            fontSize: '14.5px',
            color: '#333',
            lineHeight: '21px',
            marginBottom: '8px'
        },
        attachmentsContainer: {
            marginTop: '12px'
        },
        attachmentImage: {
            width: '100%',
            height: '250px',
            borderRadius: '8px',
            backgroundColor: '#eee',
            objectFit: 'cover'
        },
        attachmentItemRow: {
            display: 'flex',
            alignItems: 'center',
            padding: '10px 12px',
            backgroundColor: '#f0f8ff',
            borderRadius: '8px',
            marginBottom: '8px',
            cursor: 'pointer'
        },
        interactionContainer: {
            display: 'flex',
            paddingTop: '12px',
            marginTop: '12px',
            borderTop: '1px solid #eee'
        },
        interactionButton: {
            display: 'flex',
            alignItems: 'center',
            marginRight: '25px',
            background: 'none',
            border: 'none',
            cursor: 'pointer'
        },
        interactionText: {
            color: '#666',
            fontWeight: '500',
            fontSize: '14px',
            marginRight: '6px'
        },
        createPostButton: {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            backgroundColor: '#14AE5C',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
        },
        commentsSection: {
            position: 'fixed',
            bottom: '0',
            left: '0',
            right: '0',
            backgroundColor: '#fff',
            borderTopLeftRadius: '16px',
            borderTopRightRadius: '16px',
            padding: '16px',
            maxHeight: '60%',
            boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
            zIndex: 1000
        },
        commentsHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px'
        },
        commentsTitle: {
            fontSize: '18px',
            fontWeight: '600',
            color: '#222'
        },
        commentItem: {
            display: 'flex',
            marginBottom: '16px',
            alignItems: 'flex-start'
        },
        commentAvatar: {
            width: '36px',
            height: '36px',
            borderRadius: '18px',
            marginRight: '12px'
        },
        commentContent: {
            flex: 1,
            backgroundColor: '#f4f6f8',
            padding: '12px',
            borderRadius: '12px'
        },
        commentAuthor: {
            fontWeight: '600',
            color: '#333',
            marginBottom: '4px',
            fontSize: '13.5px'
        },
        commentText: {
            color: '#444',
            marginBottom: '5px',
            fontSize: '14px',
            lineHeight: '19px'
        },
        commentTime: {
            fontSize: '11px',
            color: '#888',
            textAlign: 'right'
        },
        commentInputContainer: {
            display: 'flex',
            alignItems: 'center',
            borderTop: '1px solid #eee',
            paddingTop: '10px'
        },
        commentInput: {
            flex: 1,
            border: '1px solid #d5d5d5',
            borderRadius: '20px',
            padding: '10px 15px',
            minHeight: '40px',
            fontSize: '15px'
        },
        postFormContainer: {
            position: 'fixed',
            bottom: '0',
            left: '0',
            right: '0',
            backgroundColor: '#fff',
            padding: '16px',
            maxHeight: '80%',
            borderTopLeftRadius: '16px',
            borderTopRightRadius: '16px',
            boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
            zIndex: 1000
        },
        postFormHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px'
        },
        postFormTitle: {
            fontSize: '18px',
            fontWeight: '600',
            color: '#222'
        },
        postInput: {
            fontSize: '16px',
            color: '#333',
            minHeight: '100px',
            width: '100%',
            padding: '12px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            marginBottom: '16px',
            resize: 'vertical'
        },
        postButton: {
            backgroundColor: '#14AE5C',
            padding: '14px',
            borderRadius: '8px',
            border: 'none',
            color: 'white',
            fontSize: '16px',
            fontWeight: '600',
            width: '100%',
            cursor: 'pointer'
        },
        privateGroupContainer: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '20px',
            backgroundColor: '#fff',
            height: '100vh'
        },
        privateGroupImage: {
            width: '200px',
            height: '200px',
            marginBottom: '20px'
        },
        privateGroupTitle: {
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#333',
            marginBottom: '10px',
            textAlign: 'center'
        },
        privateGroupText: {
            fontSize: '16px',
            color: '#666',
            textAlign: 'center',
            marginBottom: '30px',
            padding: '0 40px'
        },
        requestJoinButton: {
            backgroundColor: '#14AE5C',
            padding: '12px 30px',
            borderRadius: '25px',
            border: 'none',
            color: 'white',
            fontSize: '16px',
            fontWeight: '500',
            cursor: 'pointer'
        },
        requestSentContainer: {
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#f0f8f0',
            padding: '12px 30px',
            borderRadius: '25px'
        },
        requestSentText: {
            color: '#14AE5C',
            fontSize: '16px',
            fontWeight: '500',
            marginRight: '10px'
        },
        noPosts: {
            textAlign: 'center',
            margin: '30px 0',
            fontSize: '16px',
            color: '#888'
        },
        noCommentsText: {
            textAlign: 'center',
            color: '#999',
            marginTop: '30px',
            fontSize: '14px'
        }
    };

    if (loading) {
        return (
            <div style={styles.loadingContainer}>
                <div>Loading...</div>
            </div>
        );
    }

    if (groupInfo?.is_private && !isMember) {
        return (
            <div style={styles.privateGroupContainer}>
                <img
                    src="/private-group-icon.png"
                    alt="Private Group"
                    style={styles.privateGroupImage}
                />
                <h2 style={styles.privateGroupTitle}>This is a private group</h2>
                <p style={styles.privateGroupText}>
                    You need to be a member to view its content
                </p>
                {requestSent ? (
                    <div style={styles.requestSentContainer}>
                        <span style={styles.requestSentText}>Request Sent</span>
                        <FaCheckCircle size={24} color="#14AE5C" />
                    </div>
                ) : (
                    <button
                        style={styles.requestJoinButton}
                        onClick={handleJoinRequest}
                    >
                        Request to Join
                    </button>
                )}
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <Sidebar />
            {/* Group Header */}
            <div style={styles.groupHeader}>
                <img
                    src={getFullFileUrl(groupInfo?.imgUrl)}
                    alt="Group"
                    style={styles.groupImage}
                />
                <h1 style={styles.groupName}>{groupInfo?.name}</h1>
                <p style={styles.groupMembers}>
                    {membersCount} members • {groupInfo?.is_private ? 'Private' : 'Public'} group
                </p>
                <p style={styles.groupDescription}>
                    {groupInfo?.aboutGroup || 'No description available'}
                </p>

                <div style={styles.groupActions}>
                    {isMember ? (
                        <>
                            <button
                                style={styles.actionButton}
                                onClick={handleLeaveGroup}
                                disabled={leaving}
                            >
                                {leaving ? 'Processing...' : 'Leave Group'}
                            </button>
                            {(isAdmin || isCreator) && (
                                <button
                                    style={styles.actionButton}
                                    onClick={() => navigate(`/groups/${groupId}/settings`)}
                                >
                                    Group Settings
                                </button>
                            )}
                        </>
                    ) : (
                        <button
                            style={styles.joinButton}
                            onClick={handleJoinRequest}
                        >
                            Join Group
                        </button>
                    )}
                </div>
            </div>

            {/* Posts List */}
            {isMember ? (
                <div>
                    {posts.length > 0 ? (
                        posts.map(post => (
                            <div key={post._id} style={styles.postContainer}>
                                <div style={styles.authorContainer}>
                                    <img
                                        src={getFullFileUrl(post.postData?.authorData?.imgUrl) || DEFAULT_PROFILE_PIC}
                                        alt="Author"
                                        style={styles.avatar}
                                    />
                                    <div>
                                        <div style={styles.authorName}>
                                            {post.postData?.authorData?.name || 'Unknown User'}
                                        </div>
                                        <div style={styles.postDate}>
                                            {moment(post.postData?.createdAt).fromNow()}
                                        </div>
                                    </div>
                                    {post.isAuthor && (
                                        <button
                                            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                                            onClick={() => {
                                                if (window.confirm('Are you sure you want to delete this post?')) {
                                                    //   handleDeletePost(post._id);
                                                }
                                            }}
                                        >
                                            <FaEllipsisV size={24} color="#555" />
                                        </button>
                                    )}
                                </div>

                                {post.postData?.content && (
                                    <div style={styles.postContent}>{post.postData.content}</div>
                                )}

                                {post.postData?.attachments?.length > 0 && (
                                    <div style={styles.attachmentsContainer}>
                                        {post.postData.attachments.map((attachment, index) => {
                                            if (!attachment) return null;
                                            const fileName = attachment.split('/').pop();
                                            const isImage = isImageAttachment(fileName);
                                            const fullUrl = getFullFileUrl(attachment);
                                            if (!fullUrl) return null;

                                            return isImage ? (
                                                <button
                                                    key={index}
                                                    onClick={() => window.open(fullUrl, '_blank')}
                                                    style={{ border: 'none', background: 'none', padding: 0 }}
                                                >
                                                    <img
                                                        src={fullUrl}
                                                        alt="Attachment"
                                                        style={styles.attachmentImage}
                                                    />
                                                </button>
                                            ) : (
                                                <div
                                                    key={index}
                                                    style={styles.attachmentItemRow}
                                                    onClick={() => window.open(fullUrl, '_blank')}
                                                >
                                                    <FaPaperclip size={20} color="#01A082" />
                                                    <div style={{ flex: 1, marginLeft: '10px' }}>
                                                        {fileName || 'Download file'}
                                                    </div>
                                                    <FaDownload size={20} color="#01A082" />
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                                <div style={styles.interactionContainer}>
                                    <button
                                        style={styles.interactionButton}
                                        onClick={() => handleLike(post._id)}
                                    >
                                        <div style={styles.interactionText}>{post.likesCount || 0}</div>
                                        <FaThumbsUp
                                            size={20}
                                            color={post.hasLiked ? '#14AE5C' : '#828282'}
                                        />
                                    </button>
                                    <button
                                        style={styles.interactionButton}
                                        onClick={() => {
                                            setSelectedPostId(post._id);
                                            setShowCommentSection(true);
                                            fetchComments(post._id);
                                        }}
                                    >
                                        <div style={styles.interactionText}>{post.commentCount || 0}</div>
                                        <FaComment size={20} color="#828282" />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p style={styles.noPosts}>No posts in this group yet</p>
                    )}
                </div>
            ) : (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                    <p>Join this group to view and participate in discussions</p>
                </div>
            )}

            {/* Comment Section */}
            {showCommentSection && (
                <div style={styles.commentsSection}>
                    <div style={styles.commentsHeader}>
                        <h3 style={styles.commentsTitle}>Comments</h3>
                        <button
                            onClick={() => setShowCommentSection(false)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                            <FaTimes size={24} color="#333" />
                        </button>
                    </div>

                    {commentLoading ? (
                        <div>Loading comments...</div>
                    ) : (
                        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                            {comments.length > 0 ? (
                                comments.map(comment => (
                                    <div key={comment._id} style={styles.commentItem}>
                                        <img
                                            src={getFullFileUrl(comment.authorData?.imgUrl) || DEFAULT_PROFILE_PIC}
                                            alt="Commenter"
                                            style={styles.commentAvatar}
                                        />
                                        <div style={styles.commentContent}>
                                            <div style={styles.commentAuthor}>
                                                {comment.authorData?.name || 'Unknown User'}
                                            </div>
                                            <div style={styles.commentText}>{comment.content}</div>
                                            <div style={styles.commentTime}>
                                                {moment(comment.createdAt).fromNow()}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p style={styles.noCommentsText}>No comments yet. Be the first!</p>
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
                            onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                        />
                        <button
                            style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                marginLeft: '10px'
                            }}
                            onClick={handleAddComment}
                            disabled={!newComment.trim()}
                        >
                            <FaPaperPlane size={24} color={newComment.trim() ? '#14AE5C' : '#aaa'} />
                        </button>
                    </div>
                </div>
            )}

            {/* Post Form */}
            {showPostForm && (
                <div style={styles.postFormContainer}>
                    <div style={styles.postFormHeader}>
                        <h3 style={styles.postFormTitle}>Create New Post</h3>
                        <button
                            onClick={() => !uploading && setShowPostForm(false)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                            <FaTimes size={24} color="#333" />
                        </button>
                    </div>

                    <div style={{ maxHeight: '400px', overflowY: 'auto', padding: '10px' }}>
                        <textarea
                            style={styles.postInput}
                            placeholder="What's on your mind?"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600' }}>
                                Attachments
                            </label>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <label style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '10px',
                                    backgroundColor: '#f0f8f0',
                                    borderRadius: '8px',
                                    cursor: 'pointer'
                                }}>
                                    <FaCamera size={20} color="#14AE5C" />
                                    <span style={{ marginLeft: '6px' }}>Take Photo</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        capture="environment"
                                        style={{ display: 'none' }}
                                        onChange={handleFileChange}
                                    />
                                </label>

                                <label style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '10px',
                                    backgroundColor: '#f0f8f0',
                                    borderRadius: '8px',
                                    cursor: 'pointer'
                                }}>
                                    <FaPaperclip size={20} color="#14AE5C" />
                                    <span style={{ marginLeft: '6px' }}>Add Files</span>
                                    <input
                                        type="file"
                                        style={{ display: 'none' }}
                                        onChange={handleFileChange}
                                        multiple
                                    />
                                </label>
                            </div>

                            {attachments.length > 0 && (
                                <div style={{ marginTop: '10px' }}>
                                    {attachments.map((file, index) => (
                                        <div key={index} style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            padding: '10px',
                                            backgroundColor: '#f8f8f8',
                                            borderRadius: '8px',
                                            marginBottom: '8px'
                                        }}>
                                            {isImageAttachment(file.name) ? (
                                                <FaImage size={20} color="#14AE5C" style={{ marginRight: '8px' }} />
                                            ) : (
                                                <FaFileAlt size={20} color="#14AE5C" style={{ marginRight: '8px' }} />
                                            )}
                                            <div style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                {file.name}
                                            </div>
                                            <button
                                                onClick={() => {
                                                    setAttachments(prev => prev.filter((_, i) => i !== index));
                                                }}
                                                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                                            >
                                                <FaTimes size={20} color="#ff4444" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <button
                        style={styles.postButton}
                        onClick={handleSubmitPost}
                        disabled={uploading}
                    >
                        {uploading ? 'Posting...' : 'Post'}
                    </button>
                </div>
            )}

            {/* Floating Action Button */}
            {isMember && !showPostForm && !showCommentSection && (
                <button
                    style={styles.createPostButton}
                    onClick={() => setShowPostForm(true)}
                >
                    <FaPlus size={24} color="#fff" />
                </button>
            )}
        </div>
    );
};

export default GroupDetailsAndPosts;