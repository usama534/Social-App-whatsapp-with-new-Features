import React, { useState } from "react";
import "./Class.css";
import Sidebar from "../Sidebar/Sidebar";

const initialPosts = [
  {
    id: 1,
    author: "Zahid",
    date: "Mar 12, 2025",
    message: `[HttpPost]
public HttpResponseMessage UploadContact()
{
    try
    {
        var request = HttpContext.Current.Request;
        var path = HttpContext.Current.Server.MapPath("~/Images");
        if (Directory.Exists(path) == false)
        {
            Directory.CreateDirectory(path);
        }
        for (int i=0; i< request.Files.Count; i++)
        {
            request.Files[i].SaveAs(path + "/" + request.Files[i].FileName);
        }
        return Request.CreateResponse(HttpStatusCode.OK, "uploaded");
    }
}`,
    likes: 0
  }
];

const ClassSection = () => {
  const [activeTab, setActiveTab] = useState("BCS-7C");
  const [posts, setPosts] = useState(initialPosts);

  const handleLike = (postId) => {
    const updated = posts.map((post) =>
      post.id === postId ? { ...post, likes: post.likes + 1 } : post
    );
    setPosts(updated);
  };

  return (
    <div className="class-section-container">
      <Sidebar />

      <div className="classheader">
        <h2>Section</h2>
        <input type="text" placeholder="Search..." className="classsearch-bar" />
      </div>

      <div className="tabs">
        <button
          className={activeTab === "BCS-7C" ? "tab active" : "tab"}
          onClick={() => setActiveTab("BCS-7C")}
        >
          BCS-7C
        </button>
        <button
          className={activeTab === "iOS" ? "tab active" : "tab"}
          onClick={() => setActiveTab("iOS")}
        >
          iOS
        </button>
      </div>

      <div className="classpost-list">
        {posts.map((post) => (
          <div className="classpost-card" key={post.id}>
            <div className="classpost-header">
              <div className="avatar" />
              <div>
                <strong>{post.author}</strong>
                <div className="post-date">{post.date}</div>
              </div>
            </div>

            <div className="classpost-body">
              <pre>{post.message}</pre>
            </div>

            <div className="classpost-footer">
              <button className="classlike-btn" onClick={() => handleLike(post.id)}>
                👍 Like {post.likes}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClassSection;

// code 2

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import moment from 'moment';
// import { FaPlus, FaTimes, FaEllipsisV, FaPaperclip, FaThumbsUp, FaDownload } from 'react-icons/fa';
// import { useNavigate } from 'react-router-dom';
// import API_URL from '../../Config';
// import Sidebar from '../Sidebar/Sidebar';
// // import IMG_BASE_URL from '../constants/config';

// const ClassPostsScreen = () => {
//   const navigate = useNavigate();
//   const [posts, setPosts] = useState([]);
//   const [sections, setSections] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [userId, setUserId] = useState('6754a9268db89992d5b8221e');
//   const [selectedSection, setSelectedSection] = useState(null);
//   const [userType, setUserType] = useState('');
//   const [isAdmin, setIsAdmin] = useState(false);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [content, setContent] = useState('');
//   const [attachments, setAttachments] = useState([]);
//   const [selectedDocuments, setSelectedDocuments] = useState([]);
//   const [uploading, setUploading] = useState(false);

//   const showMessage = (message) => {
//     alert(message);
//   };

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const userResponse = await axios.get(
//           `${API_URL}api/user/getUserData/${userId}`,
//         );
//         const userData = userResponse.data;
//         setUserType(userData.type || 'student');

//         await fetchClassData(userData.type || 'student');
//       } catch (error) {
//         console.error('Error fetching user data:', error);
//         setLoading(false);
//       }
//     };

//     const fetchClassData = async (type) => {
//       try {
//         const sectionsResponse = await axios.get(
//           `${API_URL}api/feed/getClassWallsData/${type}/${userId}`,
//         );
//         setSections(sectionsResponse.data);

//         if (sectionsResponse.data.length > 0) {
//           setSelectedSection(sectionsResponse.data[0]);
//           const postsResponse = await axios.get(
//             `${API_URL}api/feed/getClassWallPosts/${sectionsResponse.data[0].group}/${userId}`,
//           );
//           setPosts(postsResponse.data);

//           if (postsResponse.data.length > 0) {
//             setIsAdmin(postsResponse.data[0].isGroupAdmin || false);
//           }
//         }
//       } catch (error) {
//         console.error('Error fetching class data:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserData();
//   }, []);

//   const loadSectionPosts = async (section) => {
//     try {
//       setLoading(true);
//       setSelectedSection(section);
//       const response = await axios.get(
//         `${API_URL}api/feed/getClassWallPosts/${section.group}/${userId}`,
//       );
//       setPosts(response.data);

//       if (response.data.length > 0) {
//         setIsAdmin(response.data[0].isGroupAdmin || false);
//       } else {
//         setIsAdmin(false);
//       }
//     } catch (error) {
//       console.error('Error loading section posts:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleLike = async (postId) => {
//     if (!postId) return;

//     try {
//       const post = posts.find((p) => p && p._id === postId);
//       if (!post) return;

//       const isLiked = post.hasLiked;

//       await axios.put(
//         `${API_URL}api/posts/togglePostLike/${postId}/${userId}/${isLiked}`,
//       );

//       const updatedPosts = posts.map((p) => {
//         if (p && p._id === postId) {
//           return {
//             ...p,
//             hasLiked: !isLiked,
//             likesCount: isLiked
//               ? (p.likesCount || 0) - 1
//               : (p.likesCount || 0) + 1,
//           };
//         }
//         return p;
//       });

//       setPosts(updatedPosts);
//     } catch (error) {
//       console.error('Error handling like:', error);
//     }
//   };

//   const handleDeletePost = async (postId) => {
//     try {
//       const postToDelete = posts.find((post) => post._id === postId);
//       if (!postToDelete) {
//         showMessage('Post not found');
//         return;
//       }

//       const postDataId = postToDelete.postData?._id;
//       if (!postDataId) {
//         showMessage('Invalid post data');
//         return;
//       }

//       if (window.confirm('Are you sure you want to delete this post?')) {
//         await axios.delete(`${API_URL}api/posts/deletePost/${postDataId}`);
//         setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
//         showMessage('Post deleted successfully');
//       }
//     } catch (error) {
//       console.error('Error deleting post:', error);
//       showMessage('Failed to delete post');
//     }
//   };

//   const isImageAttachment = (fileName) => {
//     if (!fileName) return false;
//     const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
//     return imageExtensions.some((ext) => fileName.toLowerCase().endsWith(ext));
//   };

//   const handleFileChange = (e) => {
//     const files = Array.from(e.target.files);
//     setAttachments(files);
//     setSelectedDocuments(files.map((file) => file.name));
//   };

//   const removeAttachment = (index) => {
//     setAttachments((prev) => prev.filter((_, i) => i !== index));
//     setSelectedDocuments((prev) => prev.filter((_, i) => i !== index));
//   };

//   const handleSubmitPost = async () => {
//     if ((!content || !content.trim()) && attachments.length === 0) {
//       showMessage('Please add content or attachments');
//       return;
//     }

//     try {
//       setUploading(true);

//       const formData = new FormData();
//       formData.append('author', userId);
//       formData.append('content', content || '');
//       formData.append('privacyLevel', '0');
//       formData.append('type', '0');
//       formData.append('group_ids[0]', selectedSection.group);

//       attachments.forEach((attachment) => {
//         formData.append('attachments', attachment);
//       });

//       const response = await axios.post(
//         `${API_URL}api/posts/addPost`,
//         formData,
//         {
//           headers: {
//             'Content-Type': 'multipart/form-data',
//           },
//         },
//       );

//       if (response.data && response.data.post_id) {
//         showMessage('Post created successfully!');
//         setModalVisible(false);
//         const postsResponse = await axios.get(
//           `${API_URL}api/feed/getClassWallPosts/${selectedSection.group}/${userId}`,
//         );
//         setPosts(postsResponse.data || []);

//         setContent('');
//         setAttachments([]);
//         setSelectedDocuments([]);
//       }
//     } catch (error) {
//       console.error('Error creating post:', error);
//       showMessage('Failed to create post');
//     } finally {
//       setUploading(false);
//     }
//   };

//   const AddPostModal = () => (
//     <div className={`modal ${modalVisible ? 'show' : ''}`}>

//       <div className="modal-content">
//         <div className="modal-header">
//           <h3>Create New Post</h3>
//           <button onClick={() => setModalVisible(false)}>
//             <FaTimes />
//           </button>
//         </div>

//         <div className="modal-body">
//           <textarea
//             className="post-input"
//             placeholder="What's on your mind?"
//             value={content}
//             onChange={(e) => setContent(e.target.value)}
//           />

//           <div className="section">
//             <h4>Attachments</h4>
//             <div className="attachment-buttons">
//               <label className="attachment-button">
//                 <input
//                   type="file"
//                   multiple
//                   onChange={handleFileChange}
//                   style={{ display: 'none' }}
//                 />
//                 <FaPaperclip />
//                 <span>Add Files</span>
//               </label>
//             </div>

//             {selectedDocuments.length > 0 && (
//               <div className="attachments-list">
//                 {selectedDocuments.map((documentName, index) => (
//                   <div key={index} className="attachment-item">
//                     {isImageAttachment(documentName) ? (
//                       <img
//                         src={URL.createObjectURL(attachments[index])}
//                         alt="Preview"
//                         className="attachment-preview"
//                       />
//                     ) : (
//                       <span className="file-icon">
//                         <FaPaperclip />
//                       </span>
//                     )}
//                     <span className="attachment-name">{documentName}</span>
//                     <button
//                       className="remove-attachment"
//                       onClick={() => removeAttachment(index)}
//                     >
//                       <FaTimes />
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>

//         <button
//           className="post-button"
//           onClick={handleSubmitPost}
//           disabled={uploading}
//         >
//           {uploading ? 'Posting...' : 'Post'}
//         </button>
//       </div>
//     </div>
//   );

//   if (loading) {
//     return (
//       <div className="loading-container">
//         <div className="spinner"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="class-posts-container">
//       <Sidebar />
//       <div className="content">
//         {/* Section Selector */}
//         {sections.length > 0 && (
//           <div className="section-selector">
//             {sections.map((section) => (
//               <button
//                 key={section._id}
//                 className={`section-button ${selectedSection?._id === section._id ? 'active' : ''
//                   }`}
//                 onClick={() => loadSectionPosts(section)}
//               >
//                 {section.title}
//               </button>
//             ))}
//           </div>
//         )}

//         {/* Posts */}
//         {selectedSection && (
//           <h2 className="section-title">{selectedSection.title}</h2>
//         )}

//         {posts.length > 0 ? (
//           posts.map((post) => (
//             <div key={post._id} className="post-container">
//               <div className="author-container">
//                 <img
//                   // src={
//                   //   post.postData.authorData.imgUrl
//                   //     ? `${IMG_BASE_URL}${post.postData.authorData.imgUrl}`
//                   //     : 'https://via.placeholder.com/40'
//                   // }
//                   alt="Author"
//                   className="author-avatar"
//                 />
//                 <div className="author-info">
//                   <h4 className="author-name">{post.postData.authorData.name}</h4>
//                   <span className="post-date">
//                     {moment(post.postData.createdAt).format('MMM D, YYYY h:mm A')}
//                   </span>
//                 </div>
//                 {post.is_pinned && (
//                   <span className="pinned-badge">PINNED</span>
//                 )}
//                 {isAdmin && (
//                   <button
//                     className="more-options"
//                     onClick={() => handleDeletePost(post._id)}
//                   >
//                     <FaEllipsisV />
//                   </button>
//                 )}
//               </div>

//               <p className="post-content">{post.postData.content}</p>

//               {post.postData.attachments &&
//                 post.postData.attachments.length > 0 && (
//                   <div className="attachments-container">
//                     {post.postData.attachments.map((attachment, index) => {
//                       if (!attachment) return null;
//                       const fileName = attachment.split('/').pop();
//                       const isImage = isImageAttachment(fileName);

//                       return isImage ? (
//                         <div key={index} className="image-attachment">
//                           <img
//                             // src={`${IMG_BASE_URL}${attachment}`}
//                             alt="Attachment"
//                             className="attachment-image"
//                           />
//                         </div>
//                       ) : (
//                         <a
//                           key={index}
//                           // href={`${IMG_BASE_URL}${attachment}`}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="file-attachment"
//                         >
//                           <FaPaperclip />
//                           <span>{fileName || 'Download file'}</span>
//                           <FaDownload />
//                         </a>
//                       );
//                     })}
//                   </div>
//                 )}

//               <div className="interaction-container">
//                 <button
//                   className={`like-button ${post.hasLiked ? 'liked' : ''}`}
//                   onClick={() => handleLike(post._id)}
//                 >
//                   <FaThumbsUp />
//                   <span>{post.likesCount}</span>
//                 </button>
//               </div>
//             </div>
//           ))
//         ) : (
//           <p className="no-posts">No posts available for this class.</p>
//         )}
//       </div>

//       {/* Floating Action Button for Admins */}
//       {isAdmin && (
//         <button className="fab" onClick={() => setModalVisible(true)}>
//           <FaPlus />
//         </button>
//       )}

//       <AddPostModal />

//       <style jsx>{`
//         .class-posts-container {
//           max-width: 800px;
//           margin: 0 auto;
//           padding: 20px;
//         }

//         .loading-container {
//           display: flex;
//           justify-content: center;
//           align-items: center;
//           height: 100vh;
//         }

//         .section-selector {
//           display: flex;
//           overflow-x: auto;
//           gap: 10px;
//           margin-bottom: 20px;
//           padding-bottom: 10px;
//         }

//         .section-button {
//           padding: 8px 16px;
//           border-radius: 20px;
//           border: none;
//           background: #e0e0e0;
//           cursor: pointer;
//           white-space: nowrap;
//         }

//         .section-button.active {
//           background: #14AE5C;
//           color: white;
//         }

//         .section-title {
//           text-align: center;
//           margin-bottom: 20px;
//         }

//         .post-container {
//           background: white;
//           border-radius: 8px;
//           padding: 20px;
//           margin-bottom: 20px;
//           box-shadow: 0 2px 4px rgba(0,0,0,0.1);
//         }

//         .author-container {
//           display: flex;
//           align-items: center;
//           margin-bottom: 15px;
//           padding-bottom: 15px;
//           border-bottom: 1px solid #eee;
//           position: relative;
//         }

//         .author-avatar {
//           width: 40px;
//           height: 40px;
//           border-radius: 50%;
//           margin-right: 10px;
//         }

//         .author-info {
//           flex: 1;
//         }

//         .author-name {
//           margin: 0;
//           font-size: 16px;
//           font-weight: bold;
//         }

//         .post-date {
//           font-size: 12px;
//           color: #666;
//         }

//         .more-options {
//           background: none;
//           border: none;
//           cursor: pointer;
//           color: #333;
//         }

//         .post-content {
//           margin-bottom: 15px;
//           line-height: 1.5;
//         }

//         .attachments-container {
//           margin-bottom: 15px;
//         }

//         .image-attachment {
//           margin-bottom: 10px;
//         }

//         .attachment-image {
//           max-width: 100%;
//           max-height: 300px;
//           border-radius: 8px;
//         }

//         .file-attachment {
//           display: flex;
//           align-items: center;
//           padding: 10px;
//           background: #e8f4ec;
//           border-radius: 8px;
//           margin-bottom: 8px;
//           text-decoration: none;
//           color: #01A082;
//         }

//         .file-attachment span {
//           flex: 1;
//           margin: 0 10px;
//         }

//         .interaction-container {
//           display: flex;
//           padding-top: 15px;
//           border-top: 1px solid #eee;
//         }

//         .like-button {
//           display: flex;
//           align-items: center;
//           background: none;
//           border: none;
//           cursor: pointer;
//           color: #828282;
//         }

//         .like-button.liked {
//           color: #14AE5C;
//         }

//         .like-button span {
//           margin-left: 5px;
//         }

//         .pinned-badge {
//           position: absolute;
//           right: 0;
//           top: 0;
//           background: #14AE5C;
//           color: white;
//           padding: 2px 8px;
//           border-radius: 10px;
//           font-size: 10px;
//           font-weight: bold;
//         }

//         .no-posts {
//           text-align: center;
//           color: #666;
//           margin-top: 20px;
//         }

//         .fab {
//           position: fixed;
//           bottom: 20px;
//           right: 20px;
//           width: 50px;
//           height: 50px;
//           border-radius: 50%;
//           background: #14AE5C;
//           color: white;
//           border: none;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           cursor: pointer;
//           box-shadow: 0 2px 10px rgba(0,0,0,0.2);
//         }

//         /* Modal styles */
//         .modal {
//           display: none;
//           position: fixed;
//           top: 0;
//           left: 0;
//           right: 0;
//           bottom: 0;
//           background: rgba(0,0,0,0.5);
//           z-index: 1000;
//           align-items: center;
//           justify-content: center;
//         }

//         .modal.show {
//           display: flex;
//         }

//         .modal-content {
//           background: white;
//           border-radius: 8px;
//           width: 90%;
//           max-width: 500px;
//           max-height: 80vh;
//           display: flex;
//           flex-direction: column;
//         }

//         .modal-header {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           padding: 15px 20px;
//           border-bottom: 1px solid #eee;
//         }

//         .modal-header h3 {
//           margin: 0;
//         }

//         .modal-header button {
//           background: none;
//           border: none;
//           cursor: pointer;
//         }

//         .modal-body {
//           padding: 20px;
//           overflow-y: auto;
//           flex: 1;
//         }

//         .post-input {
//           width: 100%;
//           min-height: 100px;
//           padding: 10px;
//           border: 1px solid #ddd;
//           border-radius: 4px;
//           margin-bottom: 15px;
//           resize: vertical;
//         }

//         .section {
//           margin-bottom: 20px;
//         }

//         .section h4 {
//           margin-bottom: 10px;
//         }

//         .attachment-buttons {
//           display: flex;
//           gap: 10px;
//           margin-bottom: 10px;
//         }

//         .attachment-button {
//           display: flex;
//           align-items: center;
//           gap: 5px;
//           padding: 8px 12px;
//           border: 1px solid #14AE5C;
//           border-radius: 4px;
//           color: #14AE5C;
//           cursor: pointer;
//         }

//         .attachments-list {
//           margin-top: 10px;
//         }

//         .attachment-item {
//           display: flex;
//           align-items: center;
//           padding: 8px;
//           background: #f5f5f5;
//           border-radius: 4px;
//           margin-bottom: 8px;
//         }

//         .attachment-preview {
//           max-width: 100px;
//           max-height: 100px;
//           margin-right: 10px;
//         }

//         .file-icon {
//           margin-right: 10px;
//         }

//         .attachment-name {
//           flex: 1;
//           margin: 0 10px;
//           overflow: hidden;
//           text-overflow: ellipsis;
//           white-space: nowrap;
//         }

//         .remove-attachment {
//           background: none;
//           border: none;
//           cursor: pointer;
//           color: #ff4444;
//         }

//         .post-button {
//           width: 100%;
//           padding: 15px;
//           background: #14AE5C;
//           color: white;
//           border: none;
//           border-radius: 0 0 8px 8px;
//           cursor: pointer;
//           font-weight: bold;
//         }

//         .post-button:disabled {
//           background: #ccc;
//           cursor: not-allowed;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default ClassPostsScreen;

// code 3

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import moment from 'moment';
// import { useNavigate } from 'react-router-dom';
// import { MdClose, MdAttachFile, MdPhotoCamera, MdImage, MdInsertDriveFile, MdMoreVert, MdAdd, MdFileDownload } from 'react-icons/md';
// import './Class.css';
// import API_URL from '../../Config';
// import IMG_URL from '../../imagurl';
// import Sidebar from '../Sidebar/Sidebar';

// const ClassPostsScreen = () => {
//   const navigate = useNavigate();
//   const [posts, setPosts] = useState([]);
//   const [sections, setSections] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [userId, setUserId] = useState('6754a9268db89992d5b8221e');
//   const [selectedSection, setSelectedSection] = useState(null);
//   const [userType, setUserType] = useState('');
//   const [isAdmin, setIsAdmin] = useState(false);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [content, setContent] = useState('');
//   const [attachments, setAttachments] = useState([]);
//   const [selectedDocuments, setSelectedDocuments] = useState([]);
//   const [uploading, setUploading] = useState(false);


//   const showMessage = message => {
//     alert(message);
//   };

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const userResponse = await axios.get(
//           `${API_URL}api/user/getUserData/${userId}`,
//         );
//         const userData = userResponse.data;
//         setUserType(userData.type || 'student');

//         await fetchClassData(userData.type || 'student');
//       } catch (error) {
//         console.error('Error fetching user data:', error);
//         setLoading(false);
//       }
//     };

//     const fetchClassData = async type => {
//       try {
//         const sectionsResponse = await axios.get(
//           `${API_URL}api/feed/getClassWallsData/${type}/${userId}`,
//         );
//         setSections(sectionsResponse.data);

//         if (sectionsResponse.data.length > 0) {
//           setSelectedSection(sectionsResponse.data[0]);
//           const postsResponse = await axios.get(
//             `${API_URL}api/feed/getClassWallPosts/${sectionsResponse.data[0].group}/${userId}`,
//           );
//           setPosts(postsResponse.data);

//           if (postsResponse.data.length > 0) {
//             setIsAdmin(postsResponse.data[0].isGroupAdmin || false);
//           }
//         }
//       } catch (error) {
//         console.error('Error fetching class data:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserData();
//   }, []);

//   const loadSectionPosts = async section => {
//     try {
//       setLoading(true);
//       setSelectedSection(section);
//       const response = await axios.get(
//         `${API_URL}api/feed/getClassWallPosts/${section.group}/${userId}`,
//       );
//       setPosts(response.data);

//       if (response.data.length > 0) {
//         setIsAdmin(response.data[0].isGroupAdmin || false);
//       } else {
//         setIsAdmin(false);
//       }
//     } catch (error) {
//       console.error('Error loading section posts:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleLike = async postId => {
//     if (!postId) return;

//     try {
//       const post = posts.find(p => p && p._id === postId);
//       if (!post) return;

//       const isLiked = post.hasLiked;

//       await axios.put(
//         `${API_URL}api/posts/togglePostLike/${postId}/${userId}/${isLiked}`,
//       );

//       const updatedPosts = posts.map(p => {
//         if (p && p._id === postId) {
//           return {
//             ...p,
//             hasLiked: !isLiked,
//             likesCount: isLiked
//               ? (p.likesCount || 0) - 1
//               : (p.likesCount || 0) + 1,
//           };
//         }
//         return p;
//       });

//       setPosts(updatedPosts);
//     } catch (error) {
//       console.error('Error handling like:', error);
//     }
//   };

//   const handleDeletePost = async postId => {
//     try {
//       const postToDelete = posts.find(post => post._id === postId);
//       if (!postToDelete) {
//         showMessage('Post not found');
//         return;
//       }

//       const postDataId = postToDelete.postData?._id;
//       if (!postDataId) {
//         showMessage('Invalid post data');
//         return;
//       }

//       await axios.delete(`${API_URL}api/posts/deletePost/${postDataId}`);
//       setPosts(prevPosts => prevPosts.filter(post => post._id !== postId));
//       showMessage('Post deleted successfully');
//     } catch (error) {
//       console.error('Error deleting post:', error);
//       showMessage('Failed to delete post');
//     }
//   };

//   const showDeleteOption = postId => {
//     if (window.confirm('Are you sure you want to delete this post?')) {
//       handleDeletePost(postId);
//     }
//   };

//   const isImageAttachment = fileName => {
//     if (!fileName) return false;
//     const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
//     return imageExtensions.some(ext => fileName.toLowerCase().endsWith(ext));
//   };

//   const downloadAndOpenFile = async fileUrl => {
//     if (!fileUrl) {
//       showMessage('Invalid file URL');
//       return;
//     }

//     try {
//       window.open(`${IMG_URL}${fileUrl}`, '_blank');
//     } catch (error) {
//       console.error('Error handling file:', error);
//       showMessage('Failed to open file');
//     }
//   };

//   const handleAttachFile = async () => {
//     const input = document.createElement('input');
//     input.type = 'file';
//     input.multiple = true;
//     input.onchange = e => {
//       const files = Array.from(e.target.files);
//       setAttachments([...attachments, ...files]);
//       setSelectedDocuments([...selectedDocuments, ...files.map(f => f.name)]);
//     };
//     input.click();
//   };

//   const handleTakePhoto = () => {
//     showMessage('Camera functionality not available in web version');
//   };

//   const removeAttachment = index => {
//     setAttachments(prev => prev.filter((_, i) => i !== index));
//     setSelectedDocuments(prev => prev.filter((_, i) => i !== index));
//   };

//   const handleSubmitPost = async () => {
//     if ((!content || !content.trim()) && attachments.length === 0) {
//       showMessage('Please add content or attachments');
//       return;
//     }

//     try {
//       setUploading(true);

//       const formData = new FormData();
//       formData.append('author', userId);
//       formData.append('content', content || '');
//       formData.append('privacyLevel', '0');
//       formData.append('type', '0');
//       formData.append('group_ids[0]', selectedSection.group);

//       for (const attachment of attachments) {
//         formData.append('attachments', attachment);
//       }

//       const response = await axios.post(
//         `${API_URL}api/posts/addPost`,
//         formData,
//         {
//           headers: {
//             'Content-Type': 'multipart/form-data',
//           },
//         },
//       );

//       if (response.data && response.data.post_id) {
//         showMessage('Post created successfully!');
//         setModalVisible(false);
//         const postsResponse = await axios.get(
//           `${API_URL}api/feed/getClassWallPosts/${selectedSection.group}/${userId}`,
//         );
//         setPosts(postsResponse.data || []);

//         setContent('');
//         setAttachments([]);
//         setSelectedDocuments([]);
//       }
//     } catch (error) {
//       console.error('Error creating post:', error);
//       showMessage('Failed to create post');
//     } finally {
//       setUploading(false);
//     }
//   };

//   const AddPostModal = () => (
//     <div className="modal-overlay">
//       <div className="modal-content">
//         <div className="modal-header">
//           <h3>Create New Post</h3>
//           <button onClick={() => setModalVisible(false)}>
//             <MdClose size={24} />
//           </button>
//         </div>

//         <div className="modal-body">
//           <textarea
//             className="post-input"
//             placeholder="What's on your mind?"
//             value={content}
//             onChange={e => setContent(e.target.value)}
//           />

//           <div className="section">
//             <h4>Attachments</h4>
//             <div className="attachment-buttons">
//               <button className="attachment-button" onClick={handleAttachFile}>
//                 <MdAttachFile size={20} color="#14AE5C" />
//                 <span>Add Files</span>
//               </button>
//               <button className="attachment-button" onClick={handleTakePhoto}>
//                 <MdPhotoCamera size={20} color="#14AE5C" />
//                 <span>Take Photo</span>
//               </button>
//             </div>

//             {selectedDocuments.length > 0 && (
//               <div className="attachments-list">
//                 {selectedDocuments.map((documentName, index) => (
//                   <div key={index} className="attachment-item">
//                     {isImageAttachment(documentName) ? (
//                       <MdImage size={20} color="#14AE5C" />
//                     ) : (
//                       <MdInsertDriveFile size={20} color="#14AE5C" />
//                     )}
//                     <span className="attachment-name">{documentName || 'Unnamed file'}</span>
//                     <button onClick={() => removeAttachment(index)}>
//                       <MdClose size={20} color="#ff4444" />
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>

//         <button
//           className="post-button"
//           onClick={handleSubmitPost}
//           disabled={uploading}
//         >
//           {uploading ? 'Posting...' : 'Post'}
//         </button>
//       </div>
//     </div>
//   );

//   if (loading) {
//     return (
//       <div className="loading-container">
//         <div className="spinner"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="class-posts-container">
//       {/* <Sidebar /> */}
//       <div className="section-selector">
//         {sections.map(section => (
//           <button
//             key={section._id}
//             className={`section-button ${selectedSection?._id === section._id ? 'selected' : ''}`}
//             onClick={() => loadSectionPosts(section)}
//           >
//             {section.title}
//           </button>
//         ))}
//       </div>

//       {selectedSection && <h2 className="section-title">{selectedSection.title}</h2>}

//       <div className="posts-container">
//         {posts.length > 0 ? (
//           posts.map(post => (
//             <div key={post._id} className="post-container">
//               <div className="author-container">
//                 <img
//                   src={
//                     post.postData.authorData.imgUrl
//                       ? `${IMG_URL}${post.postData.authorData.imgUrl}`
//                       : 'https://via.placeholder.com/40'
//                   }
//                   alt="Author"
//                   className="avatar"
//                 />
//                 <div className="author-info">
//                   <h4>{post.postData.authorData.name}</h4>
//                   <span className="post-date">
//                     {moment(post.postData.createdAt).format('MMM D, YYYY h:mm A')}
//                   </span>
//                 </div>
//                 {post.is_pinned && <span className="pinned-badge">PINNED</span>}
//                 {isAdmin && (
//                   <button
//                     onClick={() => showDeleteOption(post._id)}
//                     className="more-options-button"
//                   >
//                     <MdMoreVert size={24} />
//                   </button>
//                 )}
//               </div>

//               <p className="post-content">{post.postData.content}</p>

//               {post.postData.attachments && post.postData.attachments.length > 0 && (
//                 <div className="attachments-container">
//                   {post.postData.attachments.map((attachment, index) => {
//                     if (!attachment) return null;
//                     const fileName = attachment.split('/').pop();
//                     const isImage = isImageAttachment(fileName);

//                     return isImage ? (
//                       <div key={index} className="image-attachment-container">
//                         <img
//                           src={`${IMG_URL}${attachment}`}
//                           alt="Attachment"
//                           className="attachment-image"
//                           onClick={() => window.open(`${IMG_URL}${attachment}`, '_blank')}
//                         />
//                       </div>
//                     ) : (
//                       <div
//                         key={index}
//                         className="attachment-item"
//                         onClick={() => downloadAndOpenFile(attachment)}
//                       >
//                         <MdAttachFile size={20} color="#01A082" />
//                         <span className="attachment-link">{fileName || 'Download file'}</span>
//                         <MdFileDownload size={20} color="#01A082" />
//                       </div>
//                     );
//                   })}
//                 </div>
//               )}

//               <div className="interaction-container">
//                 <button
//                   className="interaction-button"
//                   onClick={() => handleLike(post._id)}
//                 >
//                   <span>{post.likesCount}</span>
//                   <span
//                     className={`like-icon ${post.hasLiked ? 'liked' : ''}`}
//                   >
//                     👍
//                   </span>
//                 </button>
//               </div>
//             </div>
//           ))
//         ) : (
//           <p className="no-posts">No posts available for this class.</p>
//         )}
//       </div>

//       {isAdmin && (
//         <button className="fab" onClick={() => setModalVisible(true)}>
//           <MdAdd size={25} color="#fff" />
//         </button>
//       )}

//       {modalVisible && <AddPostModal />}
//     </div>
//   );
// };

// export default ClassPostsScreen;