import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_URL from '../../Config';
import './Settings.css'; // Assuming you'll create a corresponding CSS file
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import IMG_URL from '../../imagurl';

const userId = localStorage.getItem('userId');

const Communities = () => {
    const [communities, setCommunities] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [creating, setCreating] = useState(false);
    const [title, setTitle] = useState('');
    const [about, setAbout] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchCommunities();
    }, []);

    const fetchCommunities = async () => {
        try {
            const response = await axios.get(
                `${API_URL}api/community/getCommunities/${userId}`,
            );
            setCommunities(response.data);
        } catch (error) {
            console.error('Failed to load communities:', error.message);
            alert('Failed to load communities');
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const openModal = () => {
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setTitle('');
        setAbout('');
        setImage(null);
        setImagePreview('');
    };

    const handleCreateCommunity = async () => {
        if (!title.trim()) {
            alert('Title is required');
            return;
        }

        setCreating(true);

        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('about', about);
            if (image) {
                formData.append('image', image);
            }

            await axios.post(
                `${API_URL}api/community/newCommunity/${userId}`,
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                },
            );

            alert('Community Created!');
            closeModal();
            fetchCommunities();
        } catch (err) {
            console.error(err);
            alert('Failed to create community');
        } finally {
            setCreating(false);
        }
    };

    // const navigateToDetail = (id) => {
    //     navigate(`/community/${id}`);
    // };
    const navigateToDetail = (id) => {
        navigate(`/community/${id}`); // Now it will work
    };
    const renderCommunity = (community) => (
        <div
            key={community._id}
            className="community-card"
            onClick={() => navigateToDetail(community._id)}
        >
            <img
                src={`${IMG_URL}${community.imgUrl}`}
                alt={community.title}
                className="community-avatar"
            />
            <div className="community-text-container">
                <h3 className="community-title">{community.title}</h3>
                <p className="community-about">
                    {community.aboutCommunity || 'No description available.'}
                </p>
            </div>
        </div>
    );

    return (
        <div className="communities-container">
            <Sidebar />
            <div className="communities-list">
                {communities.map(renderCommunity)}
            </div>

            {modalVisible && (
                <div className="modal-overlay">
                    <div className="modal-container">
                        <h2 className="modal-heading">Create Community</h2>

                        {imagePreview && (
                            <div className="image-preview-container">
                                <img src={imagePreview} alt="Preview" className="image-preview" />
                            </div>
                        )}

                        <input
                            type="text"
                            placeholder="Community Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="modal-input"
                        />

                        <textarea
                            placeholder="About the Community"
                            value={about}
                            onChange={(e) => setAbout(e.target.value)}
                            className="modal-input textarea"
                            rows="4"
                        />

                        <label className="file-upload-label">
                            {image ? 'Change Image' : 'Select Image'}
                            <input
                                type="file"
                                onChange={handleImageChange}
                                accept="image/*"
                                className="file-upload-input"
                            />
                        </label>

                        <button
                            className="create-btn"
                            onClick={handleCreateCommunity}
                            disabled={creating}
                        >
                            {creating ? 'Creating...' : 'Create'}
                        </button>

                        <button className="cancel-btn" onClick={closeModal}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            <button className="fab" onClick={openModal}>
                +
            </button>
        </div>
    );
};

export default Communities;