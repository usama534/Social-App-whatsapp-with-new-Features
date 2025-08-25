import React, { useState, useRef, useEffect } from 'react';
import {
  FaRegThumbsUp,
  FaRegComment,
  FaCamera,
  FaPaperclip
} from "react-icons/fa";
import './home.css';
import Sidebar from '../Sidebar/Sidebar';
import {
  addPost,
  fetchPosts,
  togglePostLike,
  addComment,
  toggleCommentInteraction,
  getComments,
  deletePost, getSocialFeed
} from '../../API/homepage';
import API_URL from '../../Config';
import { fetchGroups } from '../../API/api';
import MessageFilter from '../Messages/utils/MessageFilter';

const Homepage = () => {
  const userId = localStorage.getItem("userId");
  const [postContent, setPostContent] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [postType, setPostType] = useState(0);
  const [privacy, setPrivacy] = useState(0);
  const [groups, setGroups] = useState('select');
  const [groupList, setGroupList] = useState([]);
  const [allowCommenting, setAllowCommenting] = useState(true);
  const [postOnTimeline, setPostOnTimeline] = useState(true);
  const [posts, setPosts] = useState([]);
  const [commentsMap, setCommentsMap] = useState({});
  const [commentInputs, setCommentInputs] = useState({});
  const [expandedComments, setExpandedComments] = useState({});
  const [openMenuPostId, setOpenMenuPostId] = useState(null);

  const toggleMenu = (postId) => {
    if (openMenuPostId === postId) {
      setOpenMenuPostId(null); // close if same post
    } else {
      setOpenMenuPostId(postId); // open new one
    }
  };

  const onPin = (postId) => {
    // handle pin logic here
  };

  const onDelete = async (postId) => {
    // handle delete logic here
    try {
      const confirmDelete = window.confirm("Are you sure you want to delete this post?");
      if (!confirmDelete) return;

      await deletePost(postId, false); // or true if you want to delete all
      // Optionally, refresh posts or remove the post from the local state:
      setPosts(posts.filter(p => p._id !== postId));

      alert("Post deleted successfully.");
    } catch (error) {
      alert("Failed to delete post.");
      console.error(error);
    }
  };


  const fileInputRef = useRef(null);

  useEffect(() => {
    loadPosts();
    loadUserGroups(); // ⬅️ new function
  }, []);
  const loadUserGroups = async () => {
    const data = await fetchGroups(userId);
    console.log("Fetched groups:", data);
    if (Array.isArray(data)) setGroupList(data.filter(g => g && g._id && g.name));
  };


  // const loadPosts = async () => {
  //   const data = await fetchPosts(userId);
  //   setPosts(data);
  // };
  const loadPosts = async () => {
    try {
      const [socialFeed, yourPosts] = await Promise.all([
        getSocialFeed(userId),
        fetchPosts(userId)
      ]);

      const normalizedPosts = [...yourPosts, ...socialFeed].map(post => ({
        ...post,
        postData: post.postData || {
          authorData: { _id: 'unknown', name: 'Unknown User' },
          content: '',
          createdAt: new Date().toISOString(),
          attachments: []
        },
        hasLiked: post.hasLiked || false,
        likesCount: post.likesCount || 0,
        commentCount: post.commentCount || 0
      }));

      setPosts(normalizedPosts);
    } catch (error) {
      console.error("Error loading posts:", error);
      setPosts([]); // Fallback to empty array
    }
  };

  const handlePost = async () => {
    if (!postContent.trim() && !selectedFile) return alert('Cannot post empty content!');

    const formData = new FormData();
    formData.append("author", userId);
    formData.append("content", postContent);
    formData.append("privacyLevel", privacy);
    formData.append("type", postType === "xlsx" ? 1 : 0);
    formData.append("allowCommenting", allowCommenting);
    formData.append("postOnTimeline", postOnTimeline);
    formData.append("group_ids", JSON.stringify([]));
    if (selectedFile) {
      formData.append('images', selectedFile);
    }

    const response = await addPost(formData);
    if (response) {
      alert("Posted successfully!");
      setPostContent("");
      setSelectedFile(null);
      loadPosts();
    } else {
      alert("Failed to post.");
    }
  };

  const handleLike = async (postId, currentlyLiked) => {
    // Optimistic UI update
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post._id === postId
          ? {
            ...post,
            hasLiked: !currentlyLiked,
            likesCount: currentlyLiked ? post.likesCount - 1 : post.likesCount + 1
          }
          : post
      )
    );

    try {
      await togglePostLike(postId, userId, currentlyLiked ? 'unlike' : 'like');
    } catch (error) {
      // Revert if API call fails
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post._id === postId
            ? {
              ...post,
              hasLiked: currentlyLiked,
              likesCount: currentlyLiked ? post.likesCount : post.likesCount - 1
            }
            : post
        )
      );
      console.error('Error toggling like:', error);
    }
  };

  const fetchComments = async (postId) => {
    const data = await getComments(postId, userId);
    setCommentsMap(prev => ({ ...prev, [postId]: data }));
  };

  const handleAddComment = async (postId) => {
    const text = commentInputs[postId];
    if (!text || text.trim() === '') return;
    await addComment(postId, userId, text);
    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
    fetchComments(postId);
  };

  const handleCommentLike = async (commentId, liked) => {
    await toggleCommentInteraction(commentId, userId, liked ? 'unlike' : 'like');
    for (let postId in commentsMap) {
      if (commentsMap[postId].some(c => c._id === commentId)) {
        fetchComments(postId);
        break;
      }
    }
  };
  function fixDoubleSlashBeforeStatic(url) {
    return url.replace(/\/+(?=static)/g, '/');
  }

  const toggleCommentSection = (postId) => {
    setExpandedComments(prev => ({ ...prev, [postId]: !prev[postId] }));
    fetchComments(postId);
  };

  const cleanUrl = (baseUrl, path) => {
    return `${baseUrl.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
  };
  return (
    <div className="homepage">
      <Sidebar />
      <div className="header">
        <h2 className='h2'>Home</h2>
        <input type="text" placeholder="Search..." className="homesearch-bar" />
      </div>

      <div className="homepost-box">
        <textarea
          className='homepost-box textarea'
          placeholder=""
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
        ></textarea>

        <div className="upload-icons">
          <button className="upload-btn" onClick={() => fileInputRef.current.click()}>
            <FaCamera /> Photo
          </button>
          <button className="upload-btn" onClick={() => fileInputRef.current.click()}>
            <FaPaperclip /> File
          </button>
          <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={(e) => setSelectedFile(e.target.files[0])} />
        </div>

        {selectedFile && (
          <div className="selected-file-preview">
            <span>{selectedFile.name}</span>
            <button onClick={() => setSelectedFile(null)} className="cancel-file-btn">❌ Cancel</button>
          </div>
        )}

        {(postContent.trim() || selectedFile) && (
          <>
            <div className="options">
              <select value={postType} onChange={(e) => setPostType(e.target.value)}>
                <option value="picture">Picture</option>
                <option value="xlsx">Timetable</option>
                <option value="xlx">Datesheet</option>
              </select>

              <select value={privacy} onChange={(e) => setPrivacy(e.target.value)}>
                <option value="0">Public</option>
                <option value="1">Private</option>
              </select>

              <select value={groups} onChange={(e) => setGroups(e.target.value)}>
                <option value="">Select Group</option>
                {groupList.map((g) => (
                  <option key={g._id} value={g._id}>
                    {g.name}
                  </option>
                ))}
              </select>

              <label><input type="checkbox" checked={allowCommenting} onChange={() => setAllowCommenting(!allowCommenting)} /> Allow Commenting</label>
              <label><input type="checkbox" checked={postOnTimeline} onChange={() => setPostOnTimeline(!postOnTimeline)} /> Post on Timeline</label>
            </div>
            <button className="post-button" onClick={handlePost}>Post</button>
          </>
        )}
      </div>

      {posts.length === 0 ? (
        <p>No posts found</p>
      ) : (
        posts.map((post) => (
          <div className="posted-content" key={post._id}>
            <div className="post-header">
              <div className="user-info">
                <img
                  src={cleanUrl(API_URL, `static/avatars/${post.postData.authorData._id}.png`)}
                  alt={post.postData.authorData?.name || 'User'}
                  className="user-avatar"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/default-user.png";
                  }}
                />

                <div className='info-aurthor'>
                  <strong>{post?.postData?.authorData?.name || 'Unknown User'}</strong>
                  <div className="post-meta">{post.postData.createdAt}</div>
                </div>
              </div>
              <div className="dots-menu">
                <span className="dot" onClick={() => toggleMenu(post._id)}>
                  ⋮
                </span>
                {openMenuPostId === post._id && (
                  <div className="dropdown-menu">
                    <button onClick={() => onPin(post._id)}>📌 Pin</button>
                    <button onClick={() => onDelete(post._id)}>🗑️ Delete</button>
                  </div>
                )}
              </div>

            </div>

            <div className="post-body">
              <MessageFilter message={post.postData.content}>
                {(filteredContent) => (
                  <p>{filteredContent}</p>  // Wrap in <p> like your original
                )}
              </MessageFilter>
              {post.postData.attachments && post.postData.attachments.map((attachment, index) => (
                <img
                  key={index}
                  src={fixDoubleSlashBeforeStatic(`${API_URL}${attachment}`)}
                  alt={`Attachment ${index + 1}`}
                  className="post-image"
                />
              ))}
            </div>

            <div className="post-footer">
              <button
                className={`action-btn ${post.hasLiked ? 'liked' : ''}`}
                onClick={() => handleLike(post._id, post.hasLiked)}
              >
                <FaRegThumbsUp className="action-icon" />
                {post.hasLiked ? 'Liked' : 'Like'} ({post.likesCount})
              </button>
              <button onClick={() => toggleCommentSection(post._id)}>
                <FaRegComment className="action-icon" /> Comments {post.commentCount}
              </button>
            </div>

            {expandedComments[post._id] && (
              <div className="comment-section">
                <div className="comment-input">
                  <img src="/default-user.png" alt="User" className="user-avatar" />
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    value={commentInputs[post._id] || ''}
                    onChange={(e) => setCommentInputs({ ...commentInputs, [post._id]: e.target.value })}
                  />
                  <button onClick={() => handleAddComment(post._id)} className="comment-post-btn">Post</button>
                </div>
                <div className="comment-list">
                  {(commentsMap[post._id] || []).map((c) => (
                    <div key={c._id} className="comment">
                      <img src="/default-user.png" alt="User" className="user-avatar" />
                      <div className="comment-content">
                        <strong>{c.author}</strong>
                        <p>{c.content}</p>
                        <button onClick={() => handleCommentLike(c._id, c.liked)} className="comment-like-btn">
                          {c.liked ? 'Unlike' : 'Like'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default Homepage;
