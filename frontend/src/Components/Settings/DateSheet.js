import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_URL from '../../Config';
import Sidebar from '../Sidebar/Sidebar';

const userId = localStorage.getItem('userId');

const DateSheet = () => {
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [dateSheets, setDateSheets] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const formatDate = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleDateString();
    };

    const formatTime = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const fetchData = async () => {
        try {
            const coursesRes = await axios.get(
                `${API_URL}api/student/getEnrolledCourses/${userId}`
            );
            const allSheetsRes = await axios.get(
                `${API_URL}api/student/datesheets/all`
            );

            console.log(
                'Enrolled Courses:',
                JSON.stringify(coursesRes.data, null, 2)
            );
            console.log(
                'All DateSheets:',
                JSON.stringify(allSheetsRes.data, null, 2)
            );

            const filteredSheets = allSheetsRes.data.data.filter((sheet) =>
                coursesRes.data.includes(sheet.course?._id)
            );

            setEnrolledCourses(coursesRes.data);
            setDateSheets(filteredSheets);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="centered">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (dateSheets.length === 0) {
        return (
            <div className="centered">
                <p className="empty-text">
                    No Datesheet found for your courses.
                </p>
            </div>
        );
    }

    return (
        <div className="container">
            <Sidebar />
            {dateSheets.map((sheet, index) => (
                <div key={index} className="card">
                    <div>
                        <h5 className="course-title">
                            <span className="value">{formatDate(sheet.date_time)}</span>
                        </h5>
                        <p className="label">
                            Code: <span className="value">{sheet.course?._id}</span>
                        </p>
                        <p className="label">
                            Session: <span className="value">{sheet.session}</span>
                        </p>
                    </div>
                    <div>
                        <p className="label">
                            Type: <span className="value">{sheet.type}</span>
                        </p>
                        <p className="label">
                            {sheet.course?.title ?? 'Unknown Course'}
                        </p>
                        <p className="label">
                            Time:
                            <span className="value">{formatTime(sheet.date_time)}</span>
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
};

// CSS (you can put this in a separate .css file or use CSS-in-JS)
const styles = `
  .container {
    padding: 1rem;
    background-color: #fff;
    margin-left:200px;
  }

  .centered {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }

  .empty-text {
    color: #000;
    font-size: 1rem;
  }

  .card {
    background-color: #f2f2f2;
    border-radius: 10px;
    padding: 1rem;
    margin-bottom: 1rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .course-title {
    font-size: 1.125rem;
    font-weight: bold;
    color: #000;
    margin-bottom: 0.5rem;
  }

  .label {
    color: #000;
    margin-bottom: 0.25rem;
  }

  .value {
    font-weight: 600;
    color: #000;
  }
`;

// Add styles to the document head
const styleElement = document.createElement('style');
styleElement.innerHTML = styles;
document.head.appendChild(styleElement);

export default DateSheet;


// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import API_URL from '../../Config';
// import Sidebar from '../Sidebar/Sidebar';

// const userId = localStorage.getItem('userId');

// const DateSheet = () => {
//     const [enrolledCourses, setEnrolledCourses] = useState([]);
//     const [dateSheets, setDateSheets] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);

//     const [userData, setUserData] = useState(null);
//     const [studentData, setStudentData] = useState(null);
//     const [courses, setCourses] = useState([]);
//     const [attendanceMap, setAttendanceMap] = useState({});
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const fetchEverything = async () => {
//             try {
//                 const userRes = await axios.get(
//                     `${API_URL}api/user/getUserData/${userId}`,
//                 );
//                 const user = userRes.data;
//                 setUserData(user);

//                 const studentRes = await axios.get(
//                     `${API_URL}api/student/getStudent/${user.uid}`,
//                 );
//                 const student = studentRes.data?.data;
//                 setStudentData(student);

//                 const courseRes = await axios.get(
//                     `${API_URL}api/datacell/getCourses/${student.reg_no}`,
//                 );
//                 setCourses(courseRes.data);

//                 const attendancePromises = courseRes.data.map(item =>
//                     axios.get(
//                         `${API_URL}api/datacell/getCourseAttendance/${student.reg_no}/${item.course}`,
//                     ),
//                 );

//                 const attendanceResponses = await Promise.all(attendancePromises);
//                 const attendanceObj = {};
//                 attendanceResponses.forEach(res => {
//                     const course = res.data.course;
//                     attendanceObj[course] = res.data;
//                 });
//                 console.log('This is the attendance we got', attendanceObj);

//                 setAttendanceMap(attendanceObj);
//             } catch (error) {
//                 console.error('Something went wrong:', error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchEverything();
//     }, []);

//     useEffect(() => {
//         fetchData();
//     }, []);

//     const fetchData = async () => {
//         try {
//             const coursesRes = await axios.get(
//                 `${API_URL}api/student/getEnrolledCourses/${userId}`,
//             );
//             const allSheetsRes = await axios.get(
//                 `${API_URL}api/student/datesheets/all`,
//             );

//             console.log(
//                 'Enrolled Courses:',
//                 JSON.stringify(coursesRes.data, null, 2),
//             );
//             console.log(
//                 'All DateSheets:',
//                 JSON.stringify(allSheetsRes.data, null, 2),
//             );

//             const filteredSheets = allSheetsRes.data.data.filter(sheet =>
//                 coursesRes.data.includes(sheet.course?._id),
//             );
//             console.log('This is the DateSheet we have', filteredSheets);
//             setEnrolledCourses(coursesRes.data);
//             setDateSheets(filteredSheets);
//         } catch (error) {
//             console.error('Error fetching data:', error);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const getAttendanceInfo = courseCode => {
//         const attendance = attendanceMap[courseCode];
//         if (!attendance) {
//             return { percentage: 'N/A', isShort: false };
//         }
//         return {
//             percentage: attendance.percentage,
//             isShort: attendance.isShort,
//         };
//     };

//     if (isLoading || loading) {
//         return (
//             <div className="centered">
//                 <div className="spinner"></div>
//             </div>
//         );
//     }

//     if (dateSheets.length === 0) {
//         return (
//             <div className="centered">
//                 <p className="empty-text">
//                     No Datesheet found for your courses.
//                 </p>
//             </div>
//         );
//     }

//     return (
//         <div className="container">
//             <Sidebar />
//             {dateSheets.map((sheet, index) => {
//                 const courseCode = sheet.course?._id;
//                 const attendanceInfo = getAttendanceInfo(courseCode);

//                 return (
//                     <div key={index} className="card">
//                         <div className="left-section">
//                             <p className="day-text">{sheet.day}</p>
//                             <p className="course-code">{courseCode}</p>
//                             <p className="attendance-text">
//                                 Attendance: {attendanceInfo.percentage}%
//                                 {attendanceInfo.isShort && (
//                                     <span className="warning-text"> (Short)</span>
//                                 )}
//                             </p>
//                         </div>
//                         <div className="right-section">
//                             <p className="course-title">
//                                 {sheet.course?.title ?? 'Unknown Course'}
//                             </p>
//                             <p className="session-text">{sheet.session}</p>
//                             <p className="time-text">{sheet.time}</p>
//                             <p className="type-text">{sheet.type}</p>
//                         </div>
//                     </div>
//                 );
//             })}
//         </div>
//     );
// };

// // CSS styles (you can put this in a separate CSS file)
// const styles = `
//   .container {
//     padding: 16px;
//     background-color: #fff;
//     margin-left:200px;
//   }
  
//   .centered {
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     height: 100vh;
//   }
  
//   .empty-text {
//     color: #000;
//     font-size: 16px;
//   }
  
//   .card {
//     background-color: #f2f2f2;
//     border-radius: 10px;
//     padding: 16px;
//     margin-bottom: 16px;
//     box-shadow: 0 3px 6px rgba(0,0,0,0.16);
//     display: flex;
//     justify-content: space-between;
//   }
  
//   .left-section {
//     flex: 1;
//   }
  
//   .right-section {
//     flex: 1;
//     text-align: right;
//   }
  
//   .day-text {
//     font-size: 18px;
//     font-weight: bold;
//     color: #000;
//     margin-bottom: 4px;
//   }
  
//   .course-code {
//     font-size: 16px;
//     color: #333;
//     margin-bottom: 4px;
//   }
  
//   .attendance-text {
//     font-size: 14px;
//     color: #333;
//   }
  
//   .warning-text {
//     color: red;
//     font-weight: bold;
//   }
  
//   .course-title {
//     font-size: 16px;
//     font-weight: bold;
//     color: #000;
//     margin-bottom: 4px;
//   }
  
//   .session-text {
//     font-size: 14px;
//     color: #333;
//     margin-bottom: 4px;
//   }
  
//   .time-text {
//     font-size: 14px;
//     color: #333;
//     margin-bottom: 4px;
//     font-weight: 600;
//   }
  
//   .type-text {
//     font-size: 14px;
//     color: #333;
//     font-style: italic;
//   }
  
//   .spinner {
//     border: 4px solid rgba(0, 0, 0, 0.1);
//     width: 36px;
//     height: 36px;
//     border-radius: 50%;
//     border-left-color: black;
//     animation: spin 1s linear infinite;
//   }
  
//   @keyframes spin {
//     0% { transform: rotate(0deg); }
//     100% { transform: rotate(360deg); }
//   }
// `;

// // Add styles to the document head
// const styleElement = document.createElement('style');
// styleElement.innerHTML = styles;
// document.head.appendChild(styleElement);

// export default DateSheet;