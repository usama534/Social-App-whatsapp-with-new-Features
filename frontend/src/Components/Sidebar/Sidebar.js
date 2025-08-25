import React, { useState, useEffect } from "react";
import {
  FaGraduationCap,
  FaClipboard,
  FaBell,
  FaPaperPlane,
  FaBars,
  FaHome,
  FaCog,
  FaChalkboardTeacher // 👈 Teacher Wall icon
} from "react-icons/fa";
import "./sidebar.css";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const [userName, setUserName] = useState("User");
  const [isOpen, setIsOpen] = useState(window.innerWidth > 768); // Desktop default open
  const [userType, setUserType] = useState(""); // 👈 User type from DB

  useEffect(() => {
    const handleResize = () => {
      setIsOpen(window.innerWidth > 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    console.log("useR DATA", JSON.parse(localStorage.getItem("user")));
    const storedUser = JSON.parse(localStorage.getItem("user")).name;
    if (storedUser) {
      setUserName(storedUser);
      setUserType(storedUser.type || "");
    }

  }, []);
  const formattedUserType = userType ?
    userType.charAt(0).toUpperCase() + userType.slice(1) :
    '';
  useEffect(() => {
    const type = localStorage.getItem("userType");
    setUserType(type);
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button className="menu-btn" onClick={toggleSidebar}>
        <FaBars />
      </button>

      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <h2 className="heading2">{userName}</h2>
        {userType && <h3 className="user-type">{formattedUserType}</h3>}
        <ul className="nav-list">
          <Link to="/home" className="nav-link">
            <li className="nav-item">
              <FaHome className="nav-icon" /> HOME
            </li>
          </Link>
          <Link to="/biit" className="nav-link">
            <li className="nav-item">
              <FaGraduationCap className="nav-icon" /> BIIT
            </li>
          </Link>
          <Link to="/class" className="nav-link">
            <li className="nav-item">
              <FaClipboard className="nav-icon" /> CLASS
            </li>
          </Link>
          <Link to="/notifications" className="nav-link">
            <li className="nav-item">
              <FaBell className="nav-icon" /> NOTIFICATIONS
            </li>
          </Link>
          <Link to="/chats" className="nav-link">
            <li className="nav-item">
              <FaPaperPlane className="nav-icon" /> Messages
            </li>
          </Link>

          {/* 👇 Only show if user is a teacher */}
          {userType === "teacher" && (
            <Link to="/teacherwall" className="nav-link">
              <li className="nav-item">
                <FaChalkboardTeacher className="nav-icon" /> TEACHER WALL
              </li>
            </Link>
          )}

          <Link to="/settings" className="nav-link">
            <li className="nav-item">
              <FaCog className="nav-icon" /> SETTINGS
            </li>
          </Link>
          <Link to="/Alerts" className="nav-link">
            <li className="nav-item">
              <FaBell className="nav-icon" />Todays Alerts
            </li>
          </Link>
        </ul>
      </div>

      {/* Overlay for Mobile */}
      {isOpen && window.innerWidth <= 768 && <div className="overlay" onClick={toggleSidebar}></div>}
    </>
  );
};

export default Sidebar;
