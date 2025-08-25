// import React, { useEffect, useState } from "react";
// import "./Settings.css";
// import Sidebar from "../Sidebar/Sidebar";
// import { getPendingRequests } from "../../API/api";
// const FriendRequests = () => {
//     const [requests, setRequests] = useState([]);
//     const uid = localStorage.getItem("userId");
//     useEffect(() => {
//         const fetchRequests = async () => {
//             const data = await getPendingRequests(uid);
//             console.log(JSON.stringify(data));
//             setRequests(data);
//         };

//         if (uid) {
//             fetchRequests();
//         }
//     }, []);

//     return (
//         <div className="friend-requests-container">
//             <Sidebar />
//             <h2>Friend Requests</h2>
//             {requests.map((req) => (
//                 <div key={req.id} className="friend-request-card">
//                     <img src={req.profilePic} alt={req.name} className="friend-avatar" />
//                     <div className="friend-info">
//                         <h4>{req.name}</h4>
//                         <div className="friend-actions">
//                             <button className="confirm-btn">Accept</button>
//                             <button className="ignore-btn">Reject</button>
//                         </div>
//                     </div>
//                 </div>
//             ))}
//         </div>
//     );
// };

// export default FriendRequests;
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import {
//     AppBar,
//     Avatar,
//     Box,
//     Button,
//     Card,
//     CardContent,
//     Container,
//     Typography,
//     Snackbar
// } from '@mui/material';
// import API_URL from '../../Config';
// const FriendRequests = () => {

//     const userId = '6754a9268db89992d5b8221e';

//     const [requests, setRequests] = useState([]);
//     const [snackbarOpen, setSnackbarOpen] = useState(false);
//     const [snackbarMessage, setSnackbarMessage] = useState('');
//     const navigate = useNavigate();

//     useEffect(() => {
//         fetchRequests();
//     }, []);

//     const fetchRequests = async () => {
//         try {
//             const response = await fetch(`${API_URL}api/user/getPendingRequests/${userId}`);
//             if (response.ok) {
//                 const data = await response.json();
//                 setRequests(data.map(item => ({
//                     _id: item._id,
//                     name: item.uid.name,
//                     imgUrl: item.uid.imgUrl
//                 })));
//             }
//         } catch (e) {
//             console.error('Error fetching friend requests:', e);
//         }
//     };

//     const handleAccept = async (id) => {
//         try {
//             const response = await fetch(`${API_URL}api/user/acceptRequest/${id}`, {
//                 method: 'POST'
//             });
//             if (response.ok) {
//                 setSnackbarMessage('Friend request accepted!');
//                 setSnackbarOpen(true);
//                 setTimeout(() => {
//                     navigate('/friends');
//                 }, 500);
//             }
//         } catch (e) {
//             console.error('Error accepting request:', e);
//         }
//     };

//     const handleReject = async (id) => {
//         try {
//             const response = await fetch(`${API_URL}api/user/rejectRequest/${id}`, {
//                 method: 'POST'
//             });
//             if (response.ok) {
//                 setSnackbarMessage('Friend request rejected!');
//                 setSnackbarOpen(true);
//                 setTimeout(() => {
//                     navigate('/friends');
//                 }, 500);
//             }
//         } catch (e) {
//             console.error('Error rejecting request:', e);
//         }
//     };

//     return (
//         <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
//             <AppBar
//                 position="static"
//                 sx={{ backgroundColor: '#21A558' }}
//             >
//                 <Container sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
//                     <Typography variant="h6" component="div" color="white">
//                         Friend Requests
//                     </Typography>
//                 </Container>
//             </AppBar>

//             <Container sx={{ flex: 1, py: 2, px: 2 }}>
//                 <Box sx={{ mb: 2, textAlign: 'center' }}>
//                     <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#21A558' }}>
//                         {requests.length} Requests
//                     </Typography>
//                 </Box>

//                 <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
//                     {requests.map((item) => (
//                         <Card key={item._id} elevation={2}>
//                             <CardContent>
//                                 <Box sx={{
//                                     display: 'flex',
//                                     alignItems: 'center',
//                                     gap: 2
//                                 }}>
//                                     <Avatar
//                                         src={`${API_URL}${item.imgUrl}`}
//                                         sx={{ width: 40, height: 40 }}
//                                     />
//                                     <Typography variant="body1" sx={{ flexGrow: 1 }}>
//                                         {item.name}
//                                     </Typography>
//                                     <Box sx={{ display: 'flex', gap: 1 }}>
//                                         <Button
//                                             variant="contained"
//                                             size="small"
//                                             sx={{
//                                                 backgroundColor: '#21A558',
//                                                 color: 'white',
//                                                 textTransform: 'none',
//                                                 px: 2,
//                                                 py: 0.5,
//                                                 borderRadius: 1
//                                             }}
//                                             onClick={() => handleAccept(item._id)}
//                                         >
//                                             Confirm
//                                         </Button>
//                                         <Button
//                                             variant="contained"
//                                             size="small"
//                                             sx={{
//                                                 backgroundColor: 'grey.300',
//                                                 color: 'black',
//                                                 textTransform: 'none',
//                                                 px: 2,
//                                                 py: 0.5,
//                                                 borderRadius: 1,
//                                                 '&:hover': {
//                                                     backgroundColor: 'grey.400'
//                                                 }
//                                             }}
//                                             onClick={() => handleReject(item._id)}
//                                         >
//                                             Reject
//                                         </Button>
//                                     </Box>
//                                 </Box>
//                             </CardContent>
//                         </Card>
//                     ))}
//                 </Box>
//             </Container>

//             <Snackbar
//                 open={snackbarOpen}
//                 autoHideDuration={3000}
//                 onClose={() => setSnackbarOpen(false)}
//                 message={snackbarMessage}
//                 anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
//             />
//         </Box>
//     );
// };

// export default FriendRequests;
import React, { useEffect, useState } from 'react';
import {
    Avatar,
    Button,
    Card,
    CardContent,
    Snackbar,
    Typography,
    AppBar,
    Toolbar
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_URL from '../../Config';
import Sidebar from '../Sidebar/Sidebar';

function FriendRequests() {
    const [requests, setRequests] = useState([]);
    const [snack, setSnack] = useState({ open: false, message: '' });
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');
    const fetchRequests = async () => {
        try {
            const res = await axios.get(`${API_URL}api/user/getPendingRequests/${userId}`);
            setRequests(res.data.map(item => ({
                _id: item._id,
                name: item.uid.name,
                imgUrl: item.uid.imgUrl,
            })));
        } catch (err) {
            console.error('Error fetching friend requests:', err);
        }
    };

    const handleAccept = async (id) => {
        try {
            const res = await axios.post(`${API_URL}api/user/acceptRequest/${id}`);
            if (res.status === 200) {
                setSnack({ open: true, message: 'Friend request accepted!' });
                setTimeout(() => navigate('/settings/friends'), 500);
            }
        } catch (err) {
            console.error('Error accepting request:', err);
        }
    };

    const handleReject = async (id) => {
        try {
            const res = await axios.post(`${API_URL}api/user/rejectRequest/${id}`);
            if (res.status === 200) {
                setSnack({ open: true, message: 'Friend request rejected!' });
                setTimeout(() => navigate('/settings/friends'), 500);
            }
        } catch (err) {
            console.error('Error rejecting request:', err);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    return (
        <div style={{ display: 'flex', marginLeft: '200px' }}>
            <Sidebar />

            <div style={{ flex: 1 }}>
                <AppBar position="static" sx={{ backgroundColor: '#21A558' }}>
                    <Toolbar>
                        <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center', color: '#fff' }}>
                            Friend Requests
                        </Typography>
                    </Toolbar>
                </AppBar>

                <div style={{ padding: '16px' }}>
                    <Typography variant="subtitle1" sx={{ color: '#21A558', fontWeight: 'bold', mb: 2 }}>
                        {requests.length} Requests
                    </Typography>

                    {requests.map((req, idx) => (
                        <Card key={idx} sx={{ mb: 2 }}>
                            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                                <Avatar
                                    src={`${API_URL}${req.imgUrl}`}
                                    alt={req.name}
                                    sx={{ width: 40, height: 40, mr: 2 }}
                                />
                                <Typography sx={{ flexGrow: 1 }}>{req.name}</Typography>
                                <Button
                                    variant="contained"
                                    sx={{ backgroundColor: '#21A558', mr: 1 }}
                                    onClick={() => handleAccept(req._id)}
                                >
                                    Confirm
                                </Button>
                                <Button
                                    variant="outlined"
                                    sx={{ color: 'black', borderColor: 'gray' }}
                                    onClick={() => handleReject(req._id)}
                                >
                                    Reject
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <Snackbar
                    open={snack.open}
                    autoHideDuration={3000}
                    message={snack.message}
                    onClose={() => setSnack({ ...snack, open: false })}
                />
            </div>
        </div>
    );
}

export default FriendRequests;
