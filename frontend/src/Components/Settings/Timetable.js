// import React from "react";
// import "./Settings.css";
// import Sidebar from "../Sidebar/Sidebar";
// const Timetable = () => {
//     const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
//     const activeDay = "Friday";

//     const classes = [
//         {
//             time: "9:30",
//             subject: "COMPILER CONSTRUCTION",
//             code: "CSC312",
//             teacher: "Dr. Naseer",
//             location: "Lt7",
//             color: "light-blue",
//         },
//         {
//             time: "10:30",
//             subject: "COMPILER CONSTRUCTION",
//             code: "CSC312",
//             teacher: "Dr. Naseer, Raheem",
//             location: "Lab8",
//             color: "blue",
//         },
//         {
//             time: "11:30",
//             subject: "MOBILE APPLICATION DEVELOPMENT",
//             code: "CS693",
//             teacher: "Zahid",
//             location: "Lab3",
//             color: "yellow",
//         },
//         {
//             time: "12:30",
//             subject: "MOBILE APPLICATION DEVELOPMENT",
//             code: "CS693",
//             teacher: "Zahid, Jaweria",
//             location: "Lab3",
//             color: "orange",
//         },
//     ];

//     return (
//         <div className="timetable-container">
//             <Sidebar />
//             <div className="timetable-header">
//                 <h2>Timetable</h2>
//             </div>
//             <div className="days-selector">
//                 {days.map((day) => (
//                     <button
//                         key={day}
//                         className={`day-button ${day === activeDay ? "active" : ""}`}
//                     >
//                         {day}
//                     </button>
//                 ))}
//             </div>
//             <div className="classes-list">
//                 {classes.map((cls, index) => (
//                     <div key={index} className={`class-card ${cls.color}`}>
//                         <p className="time">{cls.time}</p>
//                         <div className="class-info">
//                             <h4>{cls.subject}</h4>
//                             <p>{cls.code}</p>
//                             <p>{cls.teacher}</p>
//                             <p>{cls.location}</p>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default Timetable;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../../Config';
import Sidebar from '../Sidebar/Sidebar';

const userId = localStorage.getItem('userId');

// Color palette from Figma design
const COLOR_PALETTE = [
    '#FFEFE7', // Soft pink
    '#FFEFE7', // Light coral
    '#FFEFE7', // Peach
    '#FFEFE7', // Mint
];

const TimetableScreen = () => {
    const [timetable, setTimetable] = useState({
        Monday: { slots: [] },
        Tuesday: { slots: [] },
        Wednesday: { slots: [] },
        Thursday: { slots: [] },
        Friday: { slots: [] },
    });
    const [loading, setLoading] = useState(true);
    const [selectedDay, setSelectedDay] = useState(null);
    const [currentDate] = useState(new Date());
    const [courseColors, setCourseColors] = useState({});

    useEffect(() => {
        const fetchTimetable = async () => {
            try {
                const response = await axios.get(
                    `${API_URL}api/student/getTimetable/${userId}`
                );
                setTimetable(response.data);

                // Generate random colors for each course
                const colors = {};
                Object.values(response.data).forEach(day => {
                    day.slots?.forEach(slot => {
                        if (slot.course?.code && !colors[slot.course.code]) {
                            colors[slot.course.code] =
                                COLOR_PALETTE[Math.floor(Math.random() * COLOR_PALETTE.length)];
                        }
                    });
                });
                setCourseColors(colors);

                // Auto-select current day
                const days = [
                    'Sunday',
                    'Monday',
                    'Tuesday',
                    'Wednesday',
                    'Thursday',
                    'Friday',
                    'Saturday',
                ];
                const today = days[new Date().getDay()];
                if (response.data[today]) {
                    setSelectedDay(today);
                }
            } catch (error) {
                console.error('Error fetching timetable:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTimetable();
    }, []);

    const formatDate = date => {
        const options = {
            weekday: 'long',
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        };
        return date.toLocaleDateString('en-US', options);
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <Sidebar />
            <div className="header">
                <h1 className="title">Time Table</h1>
                <p className="date">{formatDate(currentDate)}</p>
            </div>

            <div className="day-selector">
                {Object.keys(timetable).map(day => (
                    <button
                        key={day}
                        className={`day-button ${selectedDay === day ? 'active' : ''}`}
                        onClick={() => setSelectedDay(day)}
                    >
                        {day.substring(0, 3)}
                    </button>
                ))}
            </div>

            {selectedDay ? (
                <div className="timetable-container">
                    {timetable[selectedDay]?.slots?.length > 0 ? (
                        timetable[selectedDay].slots.map((slot, index) => {
                            const color = slot.course?.code
                                ? courseColors[slot.course.code]
                                : COLOR_PALETTE[
                                Math.floor(Math.random() * COLOR_PALETTE.length)
                                ];

                            return (
                                <div
                                    key={index}
                                    className="timetable-item"
                                    style={{ backgroundColor: color }}
                                >
                                    <div className="time-container">
                                        <p className="time-text">
                                            {slot.start_time || '--:--'} - {slot.end_time || '--:--'}
                                        </p>
                                    </div>
                                    <div className="details-container">
                                        <h3 className="course-title">
                                            {slot.course?.title || 'No Course'}
                                        </h3>
                                        <p className="course-code">
                                            {slot.course?._id || '---'}
                                        </p>
                                        <p className="instructor">
                                            {slot.instructors || 'Instructor not specified'}
                                        </p>
                                        <p className="venue">
                                            {slot.venue || 'Venue not specified'}
                                        </p>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="empty-day">
                            <p className="empty-text">
                                No classes scheduled for {selectedDay}
                            </p>
                        </div>
                    )}
                </div>
            ) : (
                <div className="empty-state">
                    <p className="empty-text">Select a day to view timetable</p>
                </div>
            )}
        </div>
    );
};

// CSS styles (can be placed in a separate CSS file)
const styles = `
  .container {
    background-color: #fff;
    min-height: 100vh;
  }
  
  .loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }
  
  .header {
    padding: 1rem;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .title {
    font-size: 1.5rem;
    font-weight: bold;
    color: #1f2937;
    margin: 0;
  }
  
  .date {
    font-size: 1rem;
    color: #6b7280;
    margin-top: 0.25rem;
    margin-bottom: 0;
  }
  
  .day-selector {
    display: flex;
    overflow-x: auto;
    max-height: 60px;
    background-color: #f8fafc;
    border-bottom: 1px solid #e5e7eb;
    padding: 0 0.5rem;
    align-items: center;
  }
  
  .day-button {
    padding: 0.75rem 1rem;
    margin: 0 0.25rem;
    border-radius: 0.5rem;
    border: none;
    background: transparent;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 500;
    color: #64748b;
    white-space: nowrap;
  }
  
  .day-button.active {
    background-color: green;
    color: white;
  }
  
  .timetable-container {
    padding: 1rem;
    flex: 1;
  }
  
  .timetable-item {
    border-radius: 0.75rem;
    padding: 1rem;
    margin-bottom: 0.75rem;
    display: flex;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .time-container {
    width: 80px;
    display: flex;
    align-items: center;
    margin-right: 1rem;
  }
  
  .time-text {
    font-size: 0.875rem;
    font-weight: 600;
    color: #1e293b;
    margin: 0;
  }
  
  .details-container {
    flex: 1;
  }
  
  .course-title {
    font-size: 0.750rem;
    font-weight: bold;
    color: #1e293b;
    margin: 0 0 0.25rem 0;
  }
  
  .course-code {
    font-size: 0.875rem;
    color: #334155;
    margin: 0 0 0.25rem 0;
  }
  
  .instructor {
    font-size: 0.8125rem;
    color: #475569;
    font-style: italic;
    margin: 0 0 0.25rem 0;
  }
  
  .venue {
    font-size: 0.8125rem;
    color: #475569;
    margin: 0;
  }
  
  .empty-day,
  .empty-state {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 2rem;
  }
  
  .empty-text {
    font-size: 1rem;
    color: #64748b;
    text-align: center;
    margin: 0;
  }
`;

// Add styles to the document head
const styleElement = document.createElement('style');
styleElement.innerHTML = styles;
document.head.appendChild(styleElement);

export default TimetableScreen;