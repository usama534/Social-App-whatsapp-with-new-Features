import React, { useState } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    IconButton,
    Box,
    Container,
    Paper,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
    CircularProgress,
    Snackbar,
    Alert,
    styled
} from '@mui/material';
import {
    CloudUpload as CloudUploadIcon,
    InsertDriveFile as InsertDriveFileIcon,
    Close as CloseIcon,
    Cancel as CancelIcon,
    FactCheck as FactCheckIcon
} from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import API_URL from '../../Config';
import Sidebar from '../Sidebar/Sidebar';


const DottedBorderContainer = styled(Paper)(({ theme }) => ({
    border: `2px dashed ${theme.palette.grey[400]}`,
    borderRadius: '12px',
    padding: theme.spacing(3),
    width: '100%',
    backgroundColor: theme.palette.grey[50],
    textAlign: 'center',
    cursor: 'pointer',
    '&:hover': {
        backgroundColor: theme.palette.grey[100]
    }
}));

const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
};

const AttendanceUploadScreen = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    const { getRootProps, getInputProps } = useDropzone({
        accept: {
            'application/vnd.ms-excel': ['.xls'],
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
        },
        maxFiles: 1,
        onDrop: acceptedFiles => {
            if (acceptedFiles.length > 0) {
                setSelectedFile(acceptedFiles[0]);
            }
        }
    });

    const toggleModal = () => {
        setIsModalVisible(!isModalVisible);
        if (!isModalVisible) setSelectedFile(null);
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const uploadFile = async () => {
        if (!selectedFile) {
            setSnackbar({
                open: true,
                message: 'Please select a file',
                severity: 'error'
            });
            return;
        }

        setIsUploading(true);

        try {
            const formData = new FormData();
            formData.append('attendance', selectedFile);

            const response = await fetch(`${API_URL}api/datacell/updateAttendance`, {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                setSnackbar({
                    open: true,
                    message: 'Attendance uploaded successfully',
                    severity: 'success'
                });
                toggleModal();
            } else {
                throw new Error(response.statusText);
            }
        } catch (error) {
            setSnackbar({
                open: true,
                message: `Upload failed: ${error.message}`,
                severity: 'error'
            });
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <Box sx={{ backgroundColor: '#f3f4f6', minHeight: '100vh', marginLeft: '200px' }}>
            <Sidebar />
            <AppBar position="static" sx={{ bgcolor: '#21A558' }}>
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: 'center' }}>
                        Upload Attendance
                    </Typography>
                </Toolbar>
            </AppBar>

            <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <Button
                    variant="contained"
                    startIcon={<FactCheckIcon />}
                    onClick={toggleModal}
                    sx={{
                        bgcolor: '#2563eb',
                        color: 'white',
                        padding: '16px 24px',
                        borderRadius: '12px',
                        boxShadow: 5,
                        '&:hover': { bgcolor: '#1d4ed8' }
                    }}
                >
                    Upload Attendance
                </Button>
            </Container>

            {isModalVisible && (
                <Paper
                    sx={{
                        position: 'fixed',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '50vh',
                        borderTopLeftRadius: '24px',
                        borderTopRightRadius: '24px',
                        boxShadow: '0 -4px 10px rgba(0,0,0,0.1)',
                        p: 3,
                        overflow: 'auto'
                    }}
                    elevation={3}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
                            Upload Attendance
                        </Typography>
                        <IconButton onClick={toggleModal}>
                            <CloseIcon sx={{ color: 'grey.500' }} />
                        </IconButton>
                    </Box>

                    <Divider sx={{ mb: 2 }} />

                    {selectedFile ? (
                        <Paper
                            sx={{
                                p: 2,
                                display: 'flex',
                                alignItems: 'center',
                                mb: 3,
                                bgcolor: 'grey.50',
                                border: '1px solid',
                                borderColor: 'grey.300',
                                borderRadius: '12px'
                            }}
                        >
                            <InsertDriveFileIcon sx={{ color: '#3b82f6', fontSize: 40, mr: 2 }} />
                            <Box sx={{ flexGrow: 1 }}>
                                <Typography fontWeight="bold" noWrap>
                                    {selectedFile.name}
                                </Typography>
                                <Typography variant="body2" color="grey.500">
                                    {formatBytes(selectedFile.size)}
                                </Typography>
                            </Box>
                            <IconButton onClick={() => setSelectedFile(null)}>
                                <CloseIcon sx={{ color: 'error.main' }} />
                            </IconButton>
                        </Paper>
                    ) : (
                        <div {...getRootProps()}>
                            <input {...getInputProps()} />
                            <DottedBorderContainer>
                                <CloudUploadIcon sx={{ fontSize: 48, color: 'grey.500', mb: 1 }} />
                                <Typography fontWeight="bold">Tap to Select Excel File</Typography>
                                <Typography variant="body2" color="grey.500">
                                    Supported: .xls or .xlsx
                                </Typography>
                            </DottedBorderContainer>
                        </div>
                    )}

                    <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                        <Button
                            fullWidth
                            variant="outlined"
                            startIcon={<CancelIcon />}
                            onClick={toggleModal}
                            disabled={isUploading}
                        >
                            Cancel
                        </Button>
                        <Button
                            fullWidth
                            variant="contained"
                            startIcon={
                                isUploading ? (
                                    <CircularProgress size={20} color="inherit" />
                                ) : (
                                    <CloudUploadIcon />
                                )
                            }
                            onClick={uploadFile}
                            disabled={!selectedFile || isUploading}
                            sx={{ bgcolor: '#2563eb' }}
                        >
                            {isUploading ? 'Uploading...' : 'Upload'}
                        </Button>
                    </Box>
                </Paper>
            )}

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default AttendanceUploadScreen;