import React, { useState, useRef, useEffect } from 'react';
import {
  FaRegThumbsUp,
  FaRegComment,
  FaCamera,
  FaPaperclip
} from "react-icons/fa";
import './BIIT.css';
import Sidebar from '../Sidebar/Sidebar';
import { fetchGroups } from "../../API/api.js";
// import Alerts from '../Notifications/Alerts.js';
import {
  addPost,
  fetchPosts,
  togglePostLike,
  addComment,
  toggleCommenting,
  toggleCommentInteraction,
  getComments,
  changeVisibility,
  getOfficialPosts
} from '../../API/biit';
import { deletePost } from '../../API/homepage';
import API_URL from '../../Config';
import MessageFilter from '../Messages/utils/MessageFilter'; // Adjust path as needed

const BIIT = () => {
  const userId = localStorage.getItem("userId");
  const user = JSON.parse(localStorage.getItem("user"));
  console.log("---------------------->", userId);
  const [postContent, setPostContent] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [postType, setPostType] = useState(0);
  const [privacy, setPrivacy] = useState(0);
  const [groups, setgroups] = useState('select');
  const [groupList, setGroupList] = useState([]);
  const [allowCommenting, setAllowCommenting] = useState(true);
  const [isemergency, setisemergency] = useState(true);
  const [postOnTimeline, setPostOnTimeline] = useState(true);
  const [showComments, setShowComments] = useState(false);
  const [posts, setPosts] = useState([]);
  const [officialPosts, setOfficialPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState('');
  const [filePreview, setFilePreview] = useState(null);
  // const [show, setshow] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    loadOfficialPosts();
    loadUserGroups();
  }, []);
  const loadUserGroups = async () => {
    const data = await fetchGroups(userId);
    setGroupList(data);
  };

  function fixDoubleSlashBeforeStatic(url) {
    return url.replace(/\/+(?=static)/g, '/');
  }
  const loadPosts = async () => {
    const data = await fetchPosts(userId);
    console.log('post' + JSON.stringify(data));
    setPosts(data);
  };

  const onPin = (postId) => {

  };

  const onDelete = async (postId) => {

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

  const loadOfficialPosts = async () => {
    const data = await getOfficialPosts(userId);
    console.log('data', JSON.stringify(data))
    setOfficialPosts(data);
  };


  // const handlePost = async () => {
  //   if (!postContent.trim() && !selectedFile) {
  //     alert('Cannot post empty content!');
  //     return;
  //   }

  //   const formData = new FormData();
  //   formData.append("author", "6797ebcc37200dbcdec36ba9");
  //   formData.append("postedBy", userId);

  //   formData.append('content', postContent);
  //   if (selectedFile) formData.append('file', selectedFile);
  //   // formData.append('postType', postType);
  //   formData.append('type', postType === "xlsx" ? 1 : 0);
  //   formData.append('privacyLevel', privacy);
  //   formData.append('group', groups);
  //   formData.append('allowCommenting', allowCommenting);
  //   formData.append('postOnTimeline', postOnTimeline);
  //   formData.append('userId', userId);

  //   try {
  //     await addPost(formData);
  //     alert('Post submitted!');
  //     setPostContent('');
  //     setSelectedFile(null);
  //     loadPosts();
  //   } catch (err) {
  //     console.error('Post failed:', err);
  //   }
  // };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type and size
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      alert('Please select a valid file type (JPEG, PNG, GIF, XLS, XLSX)');
      return;
    }

    if (file.size > maxSize) {
      alert('File size should be less than 5MB');
      return;
    }
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setFilePreview(e.target.result);
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }

    // Determine post type based on file extension
    let detectedPostType = 'picture';
    if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
      detectedPostType = file.name.endsWith('.xlsx') ? 'xlsx' : 'xlx';
    }

    setSelectedFile(file);
    setPostType(detectedPostType);
  };

  const cleanUrl = (baseUrl, path) => {
    return `${baseUrl.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
  };
  const triggerFileInput = (type) => {
    // You can use the type parameter if you want different buttons for different file types
    fileInputRef.current.click();
  };
  // const handlePost = async () => {
  //   if (!postContent.trim() && !selectedFile) {
  //     alert('Cannot post empty content!');
  //     return;
  //   }

  //   const formData = new FormData();
  //   formData.append("author", "6754a9268db89992d5b8221e"); // Official group as author
  //   formData.append("postedBy", userId);
  //   formData.append('content', postContent);
  //   if (selectedFile) formData.append('file', selectedFile);
  //   formData.append('type', postType === "xlsx" ? 1 : 0);
  //   formData.append('privacyLevel', privacy);
  //   formData.append('group_id[]', "6797ebcc37200dbcdec36ba9"); // Hardcoded official group ID
  //   formData.append('allowCommenting', allowCommenting);
  //   formData.append('postOnTimeline', postOnTimeline);
  //   formData.append('userId', userId);

  //   try {
  //     await addPost(formData);
  //     console.log("form data----->", formData);
  //     alert('Post submitted to official group!');
  //     setPostContent('');
  //     setSelectedFile(null);
  //     loadPosts();
  //     loadOfficialPosts(); // Refresh the official posts list
  //   } catch (err) {
  //     console.error('Post failed:', err);
  //   }
  // };
  // const handlePost = async () => {
  //   if (!postContent.trim() && !selectedFile) {
  //     alert('Cannot post empty content!');
  //     return;
  //   }

  //   const formData = new FormData();
  //   formData.append("author", "6754a9268db89992d5b8221e");
  //   formData.append("postedBy", userId);
  //   formData.append('content', postContent);

  //   if (selectedFile) {
  //     formData.append('file', selectedFile);
  //   }

  //   formData.append('type', postType === "xlsx" ? 1 : 0);
  //   formData.append('privacyLevel', privacy);
  //   formData.append('group_id[]', "6797ebcc37200dbcdec36ba9");
  //   formData.append('allowCommenting', allowCommenting);
  //   formData.append('postOnTimeline', postOnTimeline);
  //   formData.append('userId', userId);

  //   try {
  //     const response = await addPost(formData);

  //     // Check if the response indicates success
  //     if (response && (response.status === 'success' || response.success)) {
  //       alert('Post submitted successfully!');
  //       setPostContent('');
  //       setSelectedFile(null);
  //       if (fileInputRef.current) {
  //         fileInputRef.current.value = ''; // Clear the file input
  //       }
  //       loadPosts();
  //       loadOfficialPosts();
  //     } else {
  //       // Handle API-specific error messages
  //       throw new Error(response.message || 'Post failed, please try again');
  //     }
  //   } catch (err) {
  //     console.error('Post failed:', err);
  //     // Show user-friendly error message
  //     alert(err.message || 'An error occurred while posting');
  //   }
  // };
  const handlePost = async () => {
    if (!postContent.trim() && !selectedFile) {
      alert('Cannot post empty content!');
      return;
    }

    const formData = new FormData();
    formData.append("author", "6754a9268db89992d5b8221e");
    formData.append("postedBy", userId);
    formData.append('content', postContent);


    console.log(selectedFile)

    // Change: Use 'attachments[]' for array uploads
    if (selectedFile) {
      formData.append('images', selectedFile);
    }

    // Change: Ensure group_id is an array (backend expects 'group_id[]')
    const groupIds = groups === 'select' ? [] : [groups]; // Convert to array
    groupIds.forEach(id => formData.append('group_id[]', id)); // ⚠️ Changed from 'group'

    formData.append('type', postType === "xlsx" ? 1 : 0);
    formData.append('privacyLevel', privacy);
    formData.append('allowCommenting', allowCommenting);
    formData.append('postOnTimeline', postOnTimeline);
    formData.append('IsEmergency', isemergency);

    console.log(formData)

    try {
      const response = await addPost(formData);
      if (response && response.post_id) {
        alert('Post submitted successfully!');
        setPostContent('');
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = ''; // Clear file input
        loadOfficialPosts(); // Refresh posts
      } else if (response === 0x101) {
        alert('You must upload an Excel file for timetables/datesheets!');
      } else {
        throw new Error(response?.message || 'Post failed');
      }
    } catch (err) {
      console.error('Post failed:', err);
      alert(err.message || 'Upload failed. Check file type/size.');
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

  const handleAddComment = async (postId) => {
    if (commentInput.trim() === '') return;
    await addComment(postId, userId, commentInput);
    setCommentInput('');
    fetchComments(postId);
  };

  const fetchComments = async (postId) => {
    const res = await getComments(postId, userId);
    setComments(res);
  };

  const handleToggleCommenting = async (postId) => {
    await toggleCommenting(postId);
    loadPosts();
  };

  const handleCommentLike = async (commentId, liked) => {
    await toggleCommentInteraction(commentId, userId, liked ? 'unlike' : 'like');
    // optionally refresh comments
  };

  const handleChangeVisibility = async (postId, currentVis) => {
    const newVis = currentVis === 'public' ? 'private' : 'public';
    await changeVisibility(postId, newVis);
    loadPosts();
  };

  return (
    <div className="biitpage">
      {/* {show &&( <Alerts />)} */}
      <Sidebar />

      {/* Header */}
      <div className="header">
        <h2 className='h2'>BIIT</h2>
        <input type="text" placeholder="Search..." className="biitsearch-bar" />
      </div>

      {(user.type === 'administrator' || user.type === 'teacher') && (
        <>
          <div className="biitpost-box">
            <textarea className='biitpost-box textarea'
              placeholder=""
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
            ></textarea>
            {/* {filePreview && (
              <div className="file-preview">
                <img src={filePreview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px' }} />
              </div>
            )} */}
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
                accept=".jpg,.jpeg,.png,.gif,.xlsx,.xls"
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
                    <option value="xlsx">Timetable</option>
                    <option value="xlx">Datesheet</option>
                  </select>

                  <select value={privacy} onChange={(e) => setPrivacy(e.target.value)}>
                    <option value='0'>Public</option>
                    <option value='1'>Private</option>
                  </select>

                  <select value={groups} onChange={(e) => setgroups(e.target.value)}>
                    <option value="">Select Group</option>
                    {groupList
                      .filter((g) => g && g._id && g.name)
                      .map((g) => (
                        <option key={g._id} value={g._id}>
                          {g.name}
                        </option>
                      ))}
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
                  <label>
                    <input
                      type="checkbox"
                      checked={isemergency}
                      onChange={() => setisemergency(!isemergency)}
                    /> Emergency ALerts
                  </label>
                </div>

                <button className="post-button" onClick={handlePost}>Post</button>
              </>
            )}
          </div>


        </>)}



      {officialPosts.map((post) => (
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
              <div className='info'>
                <strong>{post.postData.authorData.name || 'User'}</strong>
                <div className="post-meta">{post.postData.createdAt}</div>
              </div>
            </div>
            {(user.type === 'administrator' || user.type === 'teacher') && (
              <>
                <div className="dots-menu">
                  <span className="dot">⋮</span>
                  <div className="dropdown">
                    <div onClick={() => onPin(post._id)}>📌 Pin</div>
                    <div onClick={() => onDelete(post._id)}>🗑️ Delete</div>
                  </div>
                </div>
              </>)}

          </div>

          <div className="post-body">
            <MessageFilter message={post.postData.content}>
              {(filteredContent) => (
                <p>{filteredContent || post.postData.content}</p> // Fallback to original if empty
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
            <button onClick={() => {
              setShowComments(!showComments);
              fetchComments(post._id);
            }}>
              <FaRegComment className="action-icon" /> Comment
            </button>
          </div>

          {/* Comments */}
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
                <button onClick={() => handleAddComment(post._id)} className="comment-post-btn">Post</button>
              </div>

              <div className="comment-list">
                {comments.map((c) => (
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
      ))}
    </div>
  );
};

export default BIIT;
