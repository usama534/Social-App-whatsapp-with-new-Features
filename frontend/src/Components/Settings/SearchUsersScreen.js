import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import {
    AppBar,
    TextField,
    CircularProgress,
    List,
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemText,
    Button,
    Snackbar,
    IconButton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import API_URL from '../../Config';
import Sidebar from '../Sidebar/Sidebar';

const SearchUsersScreen = ({ currentFriendIds }) => {
    const [users, setUsers] = useState([]);
    const [sentRequests, setSentRequests] = useState(new Set());
    const [searchText, setSearchText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const userId = localStorage.getItem('userId');

    const searchUsers = async (query) => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}api/user/searchUsers?query=${query}`);
            if (response.ok) {
                const data = await response.json();
                setUsers(data);
            }
        } catch (e) {
            console.error('Search error:', e);
        } finally {
            setIsLoading(false);
        }
    };

    const sendFriendRequest = async (fid) => {
        try {
            const response = await fetch(`${API_URL}api/user/addFriend/${userId}/${fid}`, {
                method: 'POST'
            });
            if (response.ok) {
                setSentRequests(prev => new Set(prev).add(fid));
                setSnackbarOpen(true);
            }
        } catch (e) {
            console.error('Add friend error:', e);
        }
    };

    // const isAlreadyFriend = (id) => {
    //     return currentFriendIds.includes(id);
    // };
    const isAlreadyFriend = (id) => {
        return Array.isArray(currentFriendIds) && currentFriendIds.includes(id);
    };


    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchText(value);
        if (value.trim()) {
            searchUsers(value);
        } else {
            setUsers([]);
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', marginLeft: '203px', }}>
            <Sidebar />
            <AppBar
                position="static"
                style={{ backgroundColor: '#21A558', color: 'white' }}
            >
                <div style={{ display: 'flex', justifyContent: 'center', padding: '16px' }}>
                    <h2>Search Users</h2>
                </div>
            </AppBar>

            <div style={{ padding: '10px' }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search by name..."
                    value={searchText}
                    onChange={handleSearchChange}
                    InputProps={{
                        endAdornment: (
                            <IconButton>
                                <SearchIcon />
                            </IconButton>
                        )
                    }}
                />
            </div>

            {isLoading && <CircularProgress style={{ alignSelf: 'center', margin: '10px' }} />}

            <div style={{ flex: 1, overflow: 'auto' }}>
                <List>
                    {users.map((user) => {
                        const userIdToAdd = user._id;
                        const alreadyFriend = isAlreadyFriend(userIdToAdd);
                        const alreadyRequested = sentRequests.has(userIdToAdd);
                        const isSelf = userIdToAdd === userId;

                        return (
                            <ListItem key={user._id}>
                                <ListItemAvatar>
                                    <Avatar src={`${API_URL}${user.imgUrl}`} />
                                </ListItemAvatar>
                                <ListItemText
                                    primary={user.name}
                                    secondary={user.type || ''}
                                />
                                {!isSelf && (
                                    <Button
                                        variant="contained"
                                        disabled={alreadyFriend || alreadyRequested}
                                        onClick={() => sendFriendRequest(userIdToAdd)}
                                        style={{
                                            backgroundColor: alreadyFriend || alreadyRequested ? '#cccccc' : '#21A558',
                                            color: 'white'
                                        }}
                                    >
                                        {alreadyFriend ? 'Friend' : alreadyRequested ? 'Requested' : 'Add'}
                                    </Button>
                                )}
                            </ListItem>
                        );
                    })}
                </List>
            </div>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                message="Request Sent!"
            />
        </div>
    );
};

export default SearchUsersScreen;