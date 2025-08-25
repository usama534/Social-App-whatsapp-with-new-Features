import React, { useState, useEffect } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    CircularProgress,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Card,
    CardContent,
    Divider,
    Button,
    Container,
    Paper,
    Box,
    Chip
} from '@mui/material';
import {
    Warning as WarningIcon,
    CheckCircle as CheckCircleIcon,
    ArrowForwardIos as ArrowForwardIcon,
    ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import API_URL from '../../Config';
import Sidebar from '../Sidebar/Sidebar';


const StudentAttendanceScreen = () => {
    const [courses, setCourses] = useState([]);
    const [selectedCourseData, setSelectedCourseData] = useState(null);
    const [loading, setLoading] = useState(true);
    const regno = "2021-ARID-4591";

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}api/datacell/getCourses/${regno}`);
            const data = await response.json();
            setCourses(data);
        } catch (error) {
            console.error("Error fetching courses:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCourseDetails = async (course) => {
        try {
            const response = await fetch(`${API_URL}api/datacell/getCourseAttendance/${regno}/${course}`);
            const data = await response.json();
            setSelectedCourseData(data);
        } catch (error) {
            console.error("Error fetching course details:", error);
        }
    };

    const buildCourseList = () => {
        if (courses.length === 0) {
            return (
                <Box display="flex" justifyContent="center" p={4}>
                    <Typography variant="body1">No attendance records found.</Typography>
                </Box>
            );
        }

        return (
            <List>
                {courses.map((course, index) => (
                    <Card key={index} sx={{ mb: 2, mx: 1, borderRadius: 2 }}>
                        <ListItem
                            button
                            onClick={() => fetchCourseDetails(course.course)}
                            sx={{ py: 2 }}
                        >
                            <ListItemIcon sx={{ minWidth: 40 }}>
                                {course.isShort ? (
                                    <WarningIcon color="error" fontSize="medium" />
                                ) : (
                                    <CheckCircleIcon color="success" fontSize="medium" />
                                )}
                            </ListItemIcon>
                            <ListItemText
                                primary={course.course}
                                primaryTypographyProps={{ fontWeight: 'bold', fontSize: '1.1rem' }}
                                secondary={course.isShort ? 'Attendance is short!' : 'Attendance is okay'}
                                secondaryTypographyProps={{
                                    color: course.isShort ? 'error.main' : 'success.main'
                                }}
                            />
                            <ArrowForwardIcon fontSize="small" />
                        </ListItem>
                    </Card>
                ))}
            </List>
        );
    };

    const buildCourseDetail = () => {
        if (!selectedCourseData) return null;

        const isShort = selectedCourseData.isShort;

        return (
            <Card sx={{ m: 2, borderRadius: 3 }}>

                <CardContent>
                    <Box display="flex" justifyContent="space-between" mb={2}>
                        <Typography variant="h6" fontWeight="bold">Course Code:</Typography>
                        <Typography variant="h6" fontWeight="bold">
                            {selectedCourseData.course}
                        </Typography>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography variant="body1">Total Present:</Typography>
                        <Typography variant="body1" fontWeight="bold">
                            {selectedCourseData.totalP}
                        </Typography>
                    </Box>

                    <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography variant="body1">Total Held:</Typography>
                        <Typography variant="body1" fontWeight="bold">
                            {selectedCourseData.totalHeld}
                        </Typography>
                    </Box>

                    <Box display="flex" justifyContent="space-between" mb={3}>
                        <Typography variant="body1">Percentage:</Typography>
                        <Typography
                            variant="body1"
                            fontWeight="bold"
                            color={isShort ? 'error.main' : 'success.main'}
                        >
                            {selectedCourseData.percentage}%
                        </Typography>
                    </Box>

                    {isShort && (
                        <Paper
                            elevation={0}
                            sx={{
                                p: 2,
                                mb: 3,
                                bgcolor: 'error.light',
                                border: '1px solid',
                                borderColor: 'error.main',
                                borderRadius: 1
                            }}
                        >
                            <Box display="flex" alignItems="center">
                                <WarningIcon color="error" sx={{ mr: 1 }} />
                                <Typography variant="body2" color="error">
                                    ⚠️ Your attendance is short. Please take corrective action.
                                </Typography>
                            </Box>
                        </Paper>
                    )}

                    <Box display="flex" justifyContent="center">
                        <Button
                            variant="contained"
                            startIcon={<ArrowBackIcon />}
                            onClick={() => setSelectedCourseData(null)}
                            sx={{
                                bgcolor: 'grey.800',
                                '&:hover': { bgcolor: 'grey.700' },
                                px: 3,
                                py: 1,
                                borderRadius: 2
                            }}
                        >
                            Back to Courses
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        );
    };

    return (
        <div style={{ marginLeft: '202px' }}>
            <Sidebar />
            <AppBar position="static" sx={{ bgcolor: '#21A558' }}>
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: 'center' }}>
                        My Attendance
                    </Typography>
                </Toolbar>
            </AppBar>

            <Container sx={{ p: 2 }}>
                {loading ? (
                    <Box display="flex" justifyContent="center" p={4}>
                        <CircularProgress />
                    </Box>
                ) : selectedCourseData ? (
                    buildCourseDetail()
                ) : (
                    buildCourseList()
                )}
            </Container>
        </div>
    );
};

export default StudentAttendanceScreen;