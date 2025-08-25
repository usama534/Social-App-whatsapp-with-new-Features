import React, { useState, useEffect } from "react";
import "./Settings.css";
import Sidebar from "../Sidebar/Sidebar";
import API_URL from "../../Config";

const ProfileSettings = () => {
    const [setProfilePic] = useState("https://i.pravatar.cc/150?img=10");
    // const [name, setName] = useState("Sha Meer Haider");
    const [preview, setPreview] = useState(null);
    const [userName, setUserName] = useState("User"); // Default
    const [userIMG, setUserIMG] = useState(""); // Default



    useEffect(() => {
        // const userData = ;
        console.log("useR DATA", JSON.parse(localStorage.getItem("user")));
        const storedUser = JSON.parse(localStorage.getItem("user")).name;
        const storedUserIMG = JSON.parse(localStorage.getItem("user")).avatarURL;
        if (storedUser && storedUserIMG) {
            setUserName(storedUser);
            const fullURL = `${API_URL.replace(/\/$/, "")}${storedUserIMG}`;
            setUserIMG(fullURL);
        }

    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSave = () => {
        alert(`Profile updated:\nName: ${userName}`);
        if (preview) {
            setProfilePic(preview);
            setPreview(null);
        }
    };

    return (
        <div className="profile-settings-container">
            <Sidebar />
            <h2>Profile Settings</h2>

            <div className="profile-image-section">
                <img src={userIMG} alt="Profile" className="profile-avatar" />
                <label className="change-pic-btn">
                    Change Picture
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        hidden
                    />
                </label>
            </div>

            <div className="input-group">
                <label>Name</label>
                <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                />
            </div>

            <button className="save-btn" onClick={handleSave}>
                Save Changes
            </button>
        </div>
    );
};

export default ProfileSettings;
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import API_URL from '../../Config';

// const App = () => {
//     const [userData, setUserData] = useState({});
//     const USER_ID = '6754a9268db89992d5b8221e';
//     const DEFAULT_PROFILE_PIC = 'https://via.placeholder.com/40';

//     const fetchUserData = async () => {
//         try {
//             const res = await axios.get(
//                 `${API_URL}api/user/getUserData/${USER_ID}`,
//             );
//             setUserData(res.data);
//         } catch (error) {
//             console.log('Error fetching user data:', error);
//         }
//     };

//     useEffect(() => {
//         fetchUserData();
//     }, []);

//     return (
//         <div>
//             <img
//                 // src={userData.imgUrl ? `${IMG_BASE_URL}${userData.imgUrl}` : DEFAULT_PROFILE_PIC}
//                 alt="User profile"
//                 style={{ width: 40, height: 40, borderRadius: '50%' }}
//             />
//         </div>
//     );
// };

// export default App;