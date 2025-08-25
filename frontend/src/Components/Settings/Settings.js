// import {
//   Settings,
//   Users,
//   UserPlus,
//   Group,
//   Building2,
//   Calendar,
//   FileText,
//   // Compass,
//   ChevronRight,
//   ClipboardCheck,
//   UploadCloud,
//   LogOut,
// } from "lucide-react";
// import Sidebar from "../Sidebar/Sidebar";
// import "./Settings.css";
// import { useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import API_URL from "../../Config";

// function Setting() {
//   const navigate = useNavigate();
//   const [userName, setUserName] = useState("User"); // Default
//   const [userIMG, setUserIMG] = useState(""); // Default
//   const [userRole, setUserRole] = useState("");



//   useEffect(() => {
//     const userData = JSON.parse(localStorage.getItem("user"));
//     console.log("user DATA", userData);
//     // const userData = ;
//     console.log("useR DATA", JSON.parse(localStorage.getItem("user")));
//     const storedUser = JSON.parse(localStorage.getItem("user")).name;
//     const storedUserIMG = JSON.parse(localStorage.getItem("user")).avatarURL;
//     if (storedUser && storedUserIMG) {
//       setUserName(storedUser);
//       const fullURL = `${API_URL.replace(/\/$/, "")}${storedUserIMG}`;
//       setUserIMG(fullURL);
//       setUserRole(userData.role);
//     }

//   }, []);

//   const menuSections = {
//     PERSONAL: [
//       { icon: <Settings size={20} />, title: "Profile Settings", path: "/settings/ProfileSettings" },
//       { icon: <Users size={20} />, title: "Friends", path: "/settings/Friends" },
//       { icon: <UserPlus size={20} />, title: "Friend Requests", path: "/settings/FriendRequests" },
//       { icon: <Group size={20} />, title: "Groups", path: "/settings/GroupsList" },
//       { icon: <Building2 size={20} />, title: "Communities", path: "/settings/Communities" },
//     ],
//     UNIVERSITY: [
//       { icon: <Calendar size={20} />, title: "Timetable", path: "/settings/Timetable" },
//       { icon: <FileText size={20} />, title: "Date Sheet", path: "/settings/DateSheet" },
//       (userRole === 'student' || !userRole ? [
//         { icon: <ClipboardCheck size={20} />, title: "Attendance", path: "/student-attendance" }
//       ] : [
//         { icon: <UploadCloud size={20} />, title: "Upload Attendance", path: "/upload-attendance" }
//       ])
//     ],

//   };

//   const handleNavigation = (path) => {
//     if (path) {
//       navigate(path);
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("isAuthenticated");
//     localStorage.removeItem("user");
//     navigate("/login");
//   };

//   return (
//     <div className="settings-container">
//       <Sidebar />
//       <div className="settings-header">
//         <div className="setting-header">
//           <h1>Settings</h1>

//         </div>

//         <button className="logout-button" onClick={handleLogout}>
//           <LogOut size={18} />
//           <span>Logout</span>
//         </button>
//       </div>
//       <div className="settings-content">
//         <div className="profile-section">
//           <div className="profile-info">
//             <img src={userIMG} alt="Profile" className="profile-avatar" />
//             <div className="profile-text">
//               <h2>{userName}</h2>
//               <button
//                 className="view-profile-button"
//                 onClick={() => navigate("/settings/UserProfile")}
//               >
//                 View Profile
//                 <ChevronRight size={16} />
//               </button>

//             </div>
//           </div>
//         </div>

//         <div className="settings-sections">
//           {Object.entries(menuSections).map(([section, items]) => (
//             <div key={section} className="settings-section">
//               <h3 className="section-title">{section}</h3>
//               <div className="section-items">
//                 {items.map((item, index) => (
//                   <button
//                     key={index}
//                     className="settings-item"
//                     onClick={() => handleNavigation(item.path)}
//                   >
//                     <div className="item-left">
//                       <span className="item-icon">{item.icon}</span>
//                       <span className="item-title">{item.title}</span>
//                     </div>
//                     <div className="item-right">
//                       {item.notifications && <span className="notification-badge">{item.notifications}</span>}
//                       <ChevronRight size={16} className="chevron-icon" />
//                     </div>
//                   </button>
//                 ))}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Setting;

import {
  Settings,
  Users,
  UserPlus,
  Group,
  Building2,
  Calendar,
  FileText,
  ChevronRight,
  ClipboardCheck,
  UploadCloud,
  LogOut,
} from "lucide-react";
import Sidebar from "../Sidebar/Sidebar";
import "./Settings.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API_URL from "../../Config";

function Setting() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("User");
  const [userIMG, setUserIMG] = useState("");
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    console.log("User data:", userData);

    if (userData) {
      setUserName(userData.name || "User");

      if (userData.avatarURL) {
        const fullURL = `${API_URL.replace(/\/$/, "")}${userData.avatarURL}`;
        setUserIMG(fullURL);
      }

      // Changed from userData.role to userData.type
      const role = userData?.type?.toString().toLowerCase().trim() || 'student';
      console.log("Normalized role:", role);

      setUserRole(role);
    }

    setLoading(false);
  }, []);

  const getMenuSections = () => {
    const baseSections = {
      PERSONAL: [
        { icon: <Settings size={20} />, title: "Profile Settings", path: "/settings/ProfileSettings" },
        { icon: <Users size={20} />, title: "Friends", path: "/settings/Friends" },
        { icon: <UserPlus size={20} />, title: "Friend Requests", path: "/settings/FriendRequests" },
        { icon: <Group size={20} />, title: "Groups", path: "/settings/GroupsList" },
        { icon: <Building2 size={20} />, title: "Communities", path: "/settings/Communities" },
      ],
      UNIVERSITY: [
        { icon: <Calendar size={20} />, title: "Timetable", path: "/settings/Timetable" },
        { icon: <FileText size={20} />, title: "Date Sheet", path: "/settings/DateSheet" },
      ],
    };

    if (userRole) {
      // Case-insensitive check
      const normalizedUserRole = userRole.toLowerCase().trim();
      const isAdmin = ['administrator', 'admin', 'datacell'].includes(normalizedUserRole);
      console.log("Is admin after normalization:", isAdmin, "Role was:", userRole);

      baseSections.UNIVERSITY.push(
        isAdmin
          ? { icon: <UploadCloud size={20} />, title: "Upload Attendance", path: "/upload-attendance" }
          : { icon: <ClipboardCheck size={20} />, title: "Attendance", path: "/student-attendance" }
      );
    }

    return baseSections;
  };

  const handleNavigation = (path) => {
    if (path) {
      navigate(path);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (loading) {
    return <div className="settings-container">Loading...</div>;
  }

  const menuSections = getMenuSections();

  return (
    <div className="settings-container">
      <Sidebar />
      <div className="settings-header">
        <div className="setting-header">
          <h1>Settings</h1>
        </div>

        <button className="logout-button" onClick={handleLogout}>
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
      <div className="settings-content">
        <div className="profile-section">
          <div className="profile-info">
            <img
              src={userIMG || "/default-avatar.png"}
              alt="Profile"
              className="profile-avatar"
              onError={(e) => {
                e.target.src = "/default-avatar.png";
              }}
            />
            <div className="profile-text">
              <h2>{userName}</h2>
              <button
                className="view-profile-button"
                onClick={() => navigate("/settings/UserProfile")}
              >
                View Profile
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="settings-sections">
          {Object.entries(menuSections).map(([section, items]) => (
            <div key={section} className="settings-section">
              <h3 className="section-title">{section}</h3>
              <div className="section-items">
                {items.map((item, index) => (
                  <button
                    key={index}
                    className="settings-item"
                    onClick={() => handleNavigation(item.path)}
                  >
                    <div className="item-left">
                      <span className="item-icon">{item.icon}</span>
                      <span className="item-title">{item.title}</span>
                    </div>
                    <div className="item-right">
                      <ChevronRight size={16} className="chevron-icon" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Setting;