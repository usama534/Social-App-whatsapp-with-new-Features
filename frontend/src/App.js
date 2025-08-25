import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Homepage from "./Components/HomePage/Homepage";
import BIIT from "./Components/BIIT/BIIT";
import Messages from "./Components/Messages/Messages";
import Notifications from "./Components/Notifications/Notifications";
import Class from "./Components/Class/Class";
import Setting from "./Components/Settings/Settings";
import Login from "./Components/Login/Login";
import Friends from "./Components/Settings/Friends";
import FriendRequests from "./Components/Settings/FriendRequests";
import ProfileScreen from "./Components/Settings/ProfileScreen";
import Timetable from "./Components/Settings/Timetable";
import GroupsList from "./Components/Settings/GroupsList";
import ProfileSettings from "./Components/Settings/ProfileSettings";
import TeacherWall from "./Components/Teacher/Teacherwall";
import GroupDetailsAndPosts from "./Components/Settings/GroupDetailsAndPosts";
import VipCollectionChat from "./Components/Messages/VipCollectionChat";
import SearchGroups from "./Components/Settings/SearchGroups";
import GroupJoinRequests from "./Components/Settings/GroupJoinRequests";
import CreateGroup from "./Components/Settings/CreateGroup";
import DateSheet from "./Components/Settings/DateSheet";
import GroupChat from "./Components/Messages/GroupChat";
import Communities from "./Components/Settings/Communities";
import EditCommunity from "./Components/Settings/EditCommunity";
import CommunityView from "./Components/Settings/CommunityView";
import SearchUsersScreen from "./Components/Settings/SearchUsersScreen";
import SchedulerMessage from "./Components/Messages/SchedulerMessage";
import PendingConfirmationScreen from "./Components/Messages/PendingConfirmationScreen";
import ChatArea from "./Components/Messages/ChatArea";
import StudentAttendanceScreen from "./Components/Settings/StudentAttendanceScreen";
import AttendanceUploadScreen from "./Components/Settings/AttendanceUploadScreen";
import NotificationBell from './Components/NotificationBell';
import Alerts from "./Components/Notifications/Alerts";


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const authStatus = localStorage.getItem("isAuthenticated") === "true";
    setIsAuthenticated(authStatus);
  }, []);

  if (isAuthenticated === null) {
    return <p>Loading...</p>;
  }

  return (
    <Router>
      <Routes>

        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />

        {!isAuthenticated ? (
          <Route path="*" element={<Navigate to="/login" replace />} />
        ) : (
          <>
            <Route path="/login" element={<Navigate to="/home" replace />} />
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<Homepage />} />
            <Route path="/biit" element={<BIIT />} />
            <Route path="/class" element={<Class />} />
            <Route path="/teacherwall" element={<TeacherWall />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/Alerts" element={<Alerts />} />
            <Route path="/chats" element={<Messages />} />
            <Route path="/chat/:chatId" element={<Messages />} />
            <Route path="/SchedulerMessage" element={<SchedulerMessage />} />
            <Route path="/VipCollectionChat/:collectionId/:personId/:personName" element={<VipCollectionChat />} />
            <Route path="/group/:groupId" element={<GroupChat />} />
            <Route path="/ChatArea/:chatId" element={<ChatArea />} />
            <Route path="/SearchUsersScreen" element={< SearchUsersScreen />} />
            <Route path="/settings" element={<Setting />} />
            <Route path="/settings/UserProfile" element={<ProfileScreen />} />
            <Route path="/settings/ProfileSettings" element={<ProfileSettings />} />
            <Route path="/settings/friends" element={<Friends />} />
            <Route path="/settings/FriendRequests" element={<FriendRequests />} />
            <Route path="/settings/Communities" element={<Communities />} />
            <Route path="/edit-community/:id" element={<EditCommunity />} />
            <Route path="/PendingConfirmationScreen" element={<PendingConfirmationScreen />} />
            <Route path="/community/:communityId" element={<CommunityView />} />
            <Route path="/settings/GroupsList" element={<GroupsList />} />
            <Route path="/GroupJoinRequests" element={<GroupJoinRequests />} />
            <Route path="/group-detail" element={<GroupDetailsAndPosts />} />
            <Route path="/search-groups" element={<SearchGroups />} />
            <Route path="/create-group" element={<CreateGroup />} />
            <Route path="/settings/Timetable" element={<Timetable />} />
            <Route path="/settings/DateSheet" element={<DateSheet />} />
            <Route path="/student-attendance" element={<StudentAttendanceScreen />} />
            <Route path="/upload-attendance" element={<AttendanceUploadScreen />} />
          </>
        )}
      </Routes>
      {isAuthenticated && <NotificationBell />}
    </Router>

  );
}

export default App;
