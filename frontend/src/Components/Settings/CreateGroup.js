import React, { useState } from 'react';
import axios from 'axios';
import API_URL from '../../Config';
import Sidebar from "../Sidebar/Sidebar";


const CreateGroup = ({ userId }) => {
    const [name, setName] = useState('');
    const [aboutGroup, setAboutGroup] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const [type, setType] = useState('Post Only');
    const [visibility, setVisibility] = useState('Public');
    const [allowPosting, setAllowPosting] = useState('Only Admin');

    const typeOptions = [
        { key: '1', value: 'Post Only' },
        { key: '2', value: 'Society' },
    ];

    const visibilityOptions = [
        { key: '1', value: 'Public' },
        { key: '2', value: 'Private' },
    ];

    const postingOptions = [
        { key: '1', value: 'Only Admin' },
        { key: '2', value: 'Everyone' },
    ];

    const handlePickImage = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleCreateGroup = async () => {
        if (!name.trim()) {
            alert('Missing Info: Enter a group name.');
            return;
        }

        // Convert to proper boolean values before creating FormData
        const postingPermission = allowPosting === 'Everyone';
        const isPrivate = visibility === 'Private';
        const isOfficial = type === 'Post Only';
        const isSociety = type === 'Society';

        const formData = new FormData();
        formData.append('name', name);
        formData.append('aboutGroup', aboutGroup);
        formData.append('allowPosting', String(postingPermission));
        formData.append('is_private', String(isPrivate));
        formData.append('isOfficial', String(isOfficial));
        formData.append('isSociety', String(isSociety));

        if (image) {
            formData.append('group_avatar', image);
        }

        try {
            const res = await axios.post(
                `${API_URL}api/postgroup/createGroup/${userId}`,
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                }
            );
            alert(`Success: Group "${name}" created!`);
            // You might want to redirect or reset the form here
            setName('');
            setAboutGroup('');
            setImage(null);
            setImagePreview(null);
        } catch (err) {
            console.error('Create group failed:', err.response?.data || err.message);
            alert('Error: Failed to create group.');
        }
    };

    return (
        <div style={styles.container}>
            <Sidebar />
            <label style={styles.imagePicker}>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handlePickImage}
                    style={{ display: 'none' }}
                />
                {imagePreview ? (
                    <img src={imagePreview} alt="Group preview" style={styles.image} />
                ) : (
                    <img src="/Images/BIIT.png" alt="Default group" style={styles.image} />
                )}
                <span style={styles.editIcon}>✏️</span>
            </label>

            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Group Name"
                style={styles.input}
            />

            <textarea
                value={aboutGroup}
                onChange={(e) => setAboutGroup(e.target.value)}
                placeholder="About Group"
                style={{ ...styles.input, minHeight: '100px' }}
            />

            <label style={styles.dropdownLabel}>Type</label>
            <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                style={styles.dropdown}
            >
                {typeOptions.map((option) => (
                    <option key={option.key} value={option.value}>
                        {option.value}
                    </option>
                ))}
            </select>

            <label style={styles.dropdownLabel}>Visibility</label>
            <select
                value={visibility}
                onChange={(e) => setVisibility(e.target.value)}
                style={styles.dropdown}
            >
                {visibilityOptions.map((option) => (
                    <option key={option.key} value={option.value}>
                        {option.value}
                    </option>
                ))}
            </select>

            <label style={styles.dropdownLabel}>Allow Posting</label>
            <select
                value={allowPosting}
                onChange={(e) => setAllowPosting(e.target.value)}
                style={styles.dropdown}
            >
                {postingOptions.map((option) => (
                    <option key={option.key} value={option.value}>
                        {option.value}
                    </option>
                ))}
            </select>

            <button style={styles.createButton} onClick={handleCreateGroup}>
                Create Group
            </button>
        </div>
    );
};

const styles = {
    container: {
        flex: 1,
        padding: '20px',
        backgroundColor: 'white',
        maxWidth: '600px',
        margin: '0 auto',
        marginLeft: '200px',
    },
    imagePicker: {
        display: 'block',
        margin: '0 auto 20px',
        position: 'relative',
        width: '100px',
        height: '100px',
        cursor: 'pointer',
    },
    image: {
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        objectFit: 'cover',
    },
    editIcon: {
        position: 'absolute',
        bottom: '0',
        right: '-6px',
        backgroundColor: '#fff',
        borderRadius: '20px',
        padding: '4px',
        fontSize: '14px',
    },
    input: {
        border: '1px solid #ccc',
        padding: '12px',
        borderRadius: '8px',
        marginBottom: '16px',
        fontSize: '16px',
        color: 'black',
        width: '100%',
        boxSizing: 'border-box',
    },
    dropdownLabel: {
        fontSize: '14px',
        color: '#555',
        marginBottom: '4px',
        marginTop: '10px',
        display: 'block',
    },
    dropdown: {
        border: '1px solid #ccc',
        borderRadius: '8px',
        marginBottom: '16px',
        color: 'black',
        fontSize: '16px',
        padding: '12px',
        width: '100%',
        backgroundColor: 'white',
    },
    createButton: {
        marginTop: '20px',
        backgroundColor: '#B0F2B4',
        padding: '15px',
        borderRadius: '8px',
        color: '#21A558',
        fontWeight: 'bold',
        fontSize: '16px',
        border: 'none',
        width: '100%',
        cursor: 'pointer',
    },
};

export default CreateGroup;