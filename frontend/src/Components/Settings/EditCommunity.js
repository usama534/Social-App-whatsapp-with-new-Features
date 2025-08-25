import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../../Config';
import { useNavigate, useParams } from 'react-router-dom';
import './Settings.css'; // Assuming you'll create a corresponding CSS file
import Sidebar from '../Sidebar/Sidebar';

const EditCommunity = () => {
    const { communityId, userId } = useParams();
    const navigate = useNavigate();
    const [community, setCommunity] = useState(null);
    const [title, setTitle] = useState('');
    const [about, setAbout] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [loading, setLoading] = useState(false);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        fetchCommunity();
    }, [communityId, userId]);

    const fetchCommunity = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                `${API_URL}api/community/getCommunity/${communityId}/${userId}`,
            );
            setCommunity(response.data);
            setTitle(response.data.title);
            setAbout(response.data.aboutCommunity);
            // if (response.data.imgUrl) {
            //     setImagePreview(`${IMG_BASE_URL}${response.data.imgUrl}`);
            // }
        } catch (error) {
            console.error('Failed to fetch community:', error);
            alert('Failed to load community data');
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleUpdate = async () => {
        if (!title.trim()) {
            alert('Community title cannot be empty');
            return;
        }

        setUpdating(true);
        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('aboutCommunity', about);

            if (image) {
                formData.append('image', image);
            }

            await axios.put(
                `${API_URL}api/community/editCommunity/${communityId}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                },
            );

            alert('Community updated successfully!');
            navigate(-1); // Go back to previous page
        } catch (error) {
            console.error('Update error:', error);
            alert('Failed to update community');
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="edit-community-container">
            <Sidebar />
            <header className="edit-community-header">
                <button onClick={() => navigate(-1)} className="back-button">
                    &larr;
                </button>
                <h1 className="header-title">Edit Community</h1>
                <button
                    onClick={handleUpdate}
                    disabled={updating}
                    className="save-button"
                >
                    {updating ? 'Saving...' : 'Save'}
                </button>
            </header>

            <main className="edit-community-content">
                <div className="image-upload-container">
                    <label htmlFor="community-image" className="image-picker-label">
                        <img
                            src={imagePreview || 'https://via.placeholder.com/150'}
                            alt="Community"
                            className="community-image"
                        />
                        <div className="edit-icon">
                            <span>✏️</span>
                        </div>
                    </label>
                    <input
                        id="community-image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="file-input"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Community Name</label>
                    <input
                        type="text"
                        className="form-input"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter community name"
                        maxLength="50"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">About Community</label>
                    <textarea
                        className="form-input textarea"
                        value={about}
                        onChange={(e) => setAbout(e.target.value)}
                        placeholder="Tell us about your community"
                        rows="4"
                        maxLength="500"
                    />
                    <div className="char-count">{about.length}/500</div>
                </div>
            </main>
        </div>
    );
};

export default EditCommunity;