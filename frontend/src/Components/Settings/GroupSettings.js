import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../../Config';
import { FiEdit2, FiTrash2, FiPlus, FiMinus, FiMail, FiUserPlus } from 'react-icons/fi';
import Select from 'react-select';


const GroupSettings = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { groupId, groupInfo, isCreator } = location.state || {};

    const [deleting, setDeleting] = useState(false);
    const [name, setName] = useState('');
    const [aboutGroup, setAboutGroup] = useState('');
    const [type, setType] = useState('');
    const [visibility, setVisibility] = useState('');
    const [allowPosting, setAllowPosting] = useState('');
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (groupInfo) {
            setName(groupInfo.name || '');
            setAboutGroup(groupInfo.aboutGroup || '');
            setType(groupInfo.isOfficial ? 'Post Only' : 'Society');
            setVisibility(groupInfo.is_private ? 'Private' : 'Public');
            setAllowPosting(groupInfo.allowPosting ? 'Everyone' : 'Only Admin');
            setImage(
                groupInfo.imgUrl
                    ? { url: API_URL.replace('api', '') + groupInfo.imgUrl }
                    : null
            );
        }
    }, [groupInfo]);

    const handlePickImage = async () => {
        // In web, you would typically use an input type="file"
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                setImage({
                    file,
                    url: URL.createObjectURL(file)
                });
            }
        };
        fileInput.click();
    };

    const handleUpdateGroup = async () => {
        if (!name.trim()) {
            alert('Group name cannot be empty');
            return;
        }

        setLoading(true);

        const formData = new FormData();
        formData.append('name', name);
        formData.append('aboutGroup', aboutGroup);
        formData.append('allowPosting', allowPosting === 'Everyone' ? 'true' : 'false');
        formData.append('is_private', visibility === 'Private' ? 'true' : 'false');
        formData.append('isOfficial', type === 'Post Only' ? 'true' : 'false');
        formData.append('isSociety', type === 'Society' ? 'true' : 'false');

        if (image?.file) {
            formData.append('group_avatar', image.file);
        }

        try {
            const response = await axios.put(
                `${API_URL}api/postgroup/updateGroup/${groupId}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            alert('Group updated successfully!');
            navigate(-1); // Go back
        } catch (error) {
            console.error('Update error:', error.response?.data || error.message);
            alert('Failed to update group. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteGroup = async () => {
        if (!window.confirm('Are you sure you want to delete this group? This action cannot be undone.')) {
            return;
        }

        try {
            setDeleting(true);
            const response = await axios.delete(
                `${API_URL}api/postgroup/deleteGroup/${groupId}`,
                { timeout: 10000 }
            );
            if (response.data.success) {
                alert('Group deleted successfully!');
                navigate('/groups');
            } else {
                throw new Error(response.data.message || 'Deletion failed');
            }
        } catch (error) {
            console.error('Delete error:', {
                message: error.message,
                response: error.response?.data,
                config: error.config,
            });
            alert(error.response?.data?.message || 'Failed to delete group');
        } finally {
            setDeleting(false);
        }
    };

    const typeOptions = [
        { value: 'Post Only', label: 'Post Only' },
        { value: 'Society', label: 'Society' }
    ];

    const visibilityOptions = [
        { value: 'Public', label: 'Public' },
        { value: 'Private', label: 'Private' }
    ];

    const postingOptions = [
        { value: 'Only Admin', label: 'Only Admin' },
        { value: 'Everyone', label: 'Everyone' }
    ];

    return (
        <div className="container">
            {/* Top Buttons */}
            <div className="topButtonContainer">
                <button
                    className="smallButton"
                    onClick={() => navigate('/group-join-requests', { state: { groupId } })}
                >
                    <FiMail /> Requests
                </button>

                <button
                    className="smallButton"
                    onClick={() => navigate('/group-member-add', { state: { groupId } })}
                >
                    <FiPlus /> Add
                </button>

                <button
                    className="smallButton"
                    onClick={() => navigate('/group-member-remove', { state: { groupId } })}
                >
                    <FiMinus /> Remove
                </button>

                {isCreator && (
                    <button
                        disabled={deleting}
                        className="smallButton deleteButton"
                        onClick={handleDeleteGroup}
                    >
                        {deleting ? 'Deleting...' : <><FiTrash2 /> Delete</>}
                    </button>
                )}

                <button
                    className="smallButton"
                    onClick={async () => {
                        try {
                            const response = await axios.get(
                                `${API_URL}api/postgroup/getGroupAdmins/${groupId}`
                            );
                            console.log('These are admins------------------>', response.data.admins);
                            navigate('/add-group-admins', {
                                state: {
                                    groupId,
                                    currentAdmins: response.data.admins || []
                                }
                            });
                        } catch (error) {
                            console.error('Failed to fetch group admins:', error);
                            alert('Unable to fetch group admins');
                        }
                    }}
                >
                    <FiUserPlus /> Admin
                </button>
            </div>

            {/* Editable Fields */}
            <div className="imagePicker" onClick={handlePickImage}>
                {image ? (
                    <img src={image.url} alt="Group" className="image" />
                ) : (
                    <img src="/Images/BIIT.png" alt="Default Group" className="image" />
                )}
                <span className="editIcon"><FiEdit2 /></span>
            </div>

            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Group Name"
                className="input"
            />

            <textarea
                value={aboutGroup}
                onChange={(e) => setAboutGroup(e.target.value)}
                placeholder="About Group"
                className="input multilineInput"
                rows={4}
            />

            <label className="dropdownLabel">Type</label>
            <Select
                options={typeOptions}
                value={typeOptions.find(option => option.value === type)}
                onChange={(selected) => setType(selected.value)}
                className="dropdown"
                classNamePrefix="select"
            />

            <label className="dropdownLabel">Visibility</label>
            <Select
                options={visibilityOptions}
                value={visibilityOptions.find(option => option.value === visibility)}
                onChange={(selected) => setVisibility(selected.value)}
                className="dropdown"
                classNamePrefix="select"
            />

            <label className="dropdownLabel">Allow Posting</label>
            <Select
                options={postingOptions}
                value={postingOptions.find(option => option.value === allowPosting)}
                onChange={(selected) => setAllowPosting(selected.value)}
                className="dropdown"
                classNamePrefix="select"
            />

            <button
                className="updateButton"
                onClick={handleUpdateGroup}
                disabled={loading}
            >
                {loading ? (
                    <div className="spinner"></div>
                ) : (
                    'Update Group'
                )}
            </button>

            <style jsx>{`
        .container {
          padding: 20px;
          background-color: #fff;
          max-width: 800px;
          margin: 0 auto;
        }
        
        .input {
          border: 1px solid #ddd;
          padding: 15px;
          border-radius: 10px;
          margin-bottom: 20px;
          font-size: 16px;
          color: #333;
          background-color: #f9f9f9;
          width: 100%;
          box-sizing: border-box;
        }
        
        .multilineInput {
          height: 100px;
          resize: vertical;
        }
        
        .dropdownLabel {
          display: block;
          font-size: 16px;
          color: #555;
          margin-bottom: 8px;
          font-weight: 500;
        }
        
        .dropdown {
          margin-bottom: 20px;
        }
        
        .updateButton {
          margin-top: 30px;
          background-color: #14AE5C;
          color: #fff;
          padding: 16px;
          border-radius: 10px;
          border: none;
          font-weight: bold;
          font-size: 18px;
          width: 100%;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .updateButton:hover {
          background-color: #0e8c4a;
        }
        
        .updateButton:disabled {
          background-color: #95a5a6;
          cursor: not-allowed;
        }
        
        .topButtonContainer {
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          margin-bottom: 25px;
          gap: 10px;
        }
        
        .smallButton {
          background-color: #e3f2fd;
          color: #1976d2;
          padding: 10px 15px;
          border-radius: 8px;
          border: none;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 5px;
          transition: background-color 0.2s;
        }
        
        .smallButton:hover {
          background-color: #bbdefb;
        }
        
        .deleteButton {
          background-color: #ffebee;
          color: #d32f2f;
        }
        
        .deleteButton:hover {
          background-color: #ffcdd2;
        }
        
        .imagePicker {
          position: relative;
          width: 120px;
          height: 120px;
          margin: 0 auto 25px;
          cursor: pointer;
        }
        
        .image {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          border: 2px solid #eee;
          object-fit: cover;
        }
        
        .editIcon {
          position: absolute;
          bottom: 5px;
          right: 5px;
          background-color: #fff;
          border-radius: 50%;
          padding: 5px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .spinner {
          border: 3px solid rgba(255,255,255,0.3);
          border-radius: 50%;
          border-top: 3px solid #fff;
          width: 20px;
          height: 20px;
          animation: spin 1s linear infinite;
          margin: 0 auto;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    );
};

export default GroupSettings;