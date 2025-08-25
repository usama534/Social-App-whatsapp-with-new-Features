// import { useEffect, useState, useRef } from "react";
// import { Search, MoreVertical } from "lucide-react";
// import { fetchChats } from "../../API/chat";
// import SchedulerMessage from "./SchedulerMessage"; // Import the SchedulerMessage screen
// import VIPCollection from "./VIPCollection"; // Import the VIPCollection component
// import MessageFilter from "./utils/MessageFilter";

// function ChatList({ onSelectChat }) {
//   const [chats, setChats] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showMenu, setShowMenu] = useState(false);
//   const [showScheduler, setShowScheduler] = useState(false); // New State
//   const [showVIPCollection, setShowVIPCollection] = useState(false); // New State
//   const [showVIP, setShowVIP] = useState(false);

//   const menuRef = useRef();
//   const userId = localStorage.getItem("userId");
//   useEffect(() => {
//     const getChats = async () => {
//       try {
//         if (!userId) throw new Error("User ID not found!");
//         const data = await fetchChats(userId);
//         console.log("🛠️ Chats API Response:", data);
//         setChats(data || []);
//       } catch (error) {
//         console.error("❌ Error Fetching Chats:", error);
//         setChats([]);
//       }
//       setLoading(false);
//     };
//     getChats();
//   }, []);

//   // Close menu if clicked outside
//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (menuRef.current && !menuRef.current.contains(e.target)) {
//         setShowMenu(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   return (
//     <div className="chat-list">
//       <div className="search-container" style={{ position: "relative", display: "flex", alignItems: "center" }}>
//         <Search className="search-icon" />
//         <input
//           type="text"
//           placeholder="Search here..."
//           className="search-inputchatlist"
//         />
//         <div style={{ marginLeft: "auto", position: "relative" }} ref={menuRef}>
//           <MoreVertical
//             className="menu-icon"
//             style={{ cursor: "pointer" }}
//             onClick={() => setShowMenu(!showMenu)}
//           />

//           {showMenu && (
//             <div className="dropdown-menu" style={{
//               position: "absolute",
//               top: "30px",
//               right: "0",
//               background: "#fff",
//               border: "1px solid #ddd",
//               borderRadius: "5px",
//               boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
//               zIndex: 10
//             }}>
//               <div
//                 className="dropdown-item"
//                 onClick={() => {
//                   setShowVIPCollection(true);
//                   setShowMenu(false);
//                 }}
//               >
//                 ⭐ VIP Collections
//               </div>


//               <div
//                 className="dropdown-item"
//                 onClick={() => {
//                   setShowScheduler(true);
//                   setShowMenu(false);
//                 }}
//               >
//                 🕒 Scheduler Message
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Move VIPCollection out of dropdown */}
//         {showVIP && <VIPCollection onClose={() => setShowVIP(false)} />}

//       </div>

//       {loading ? (
//         <p>Loading chats...</p>
//       ) : chats.length > 0 ? (
//         <div className="conversations">
//           {chats.map((chat, index) => {
//             const chatName =
//               chat.chatInfo?.name || (chat.isGroup ? "Group" : "Unknown");

//             return (
//               <div
//                 key={chat.id || index}
//                 className="conversation-item"
//                 onClick={() => onSelectChat(chat)}
//               >
//                 <div className="avatar">{chatName[0] || "?"}</div>
//                 <div className="conversation-details">
//                   <div className="conversation-name">{chatName}</div>
//                   <div className="conversation-message">
//                     <MessageFilter message={chat?.lastMessage?.content || "No messages yet"}>
//                       {(filteredContent) => filteredContent}
//                     </MessageFilter>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       ) : (
//         <p>No chats available.</p>
//       )}

//       {/* Scheduler Message Screen with background overlay */}
//       {showScheduler && (
//         <>
//           {/* Dark background overlay */}
//           <div
//             style={{
//               position: "fixed",
//               top: 0,
//               left: 0,
//               width: "100vw",
//               height: "100vh",
//               backgroundColor: "rgba(0, 0, 0, 0.5)",
//               zIndex: 999,
//             }}
//             onClick={() => setShowScheduler(false)}
//           ></div>

//           {/* SchedulerMessage modal */}
//           <div
//             style={{
//               position: "fixed",
//               top: "50%",
//               left: "50%",
//               transform: "translate(-50%, -50%)",
//               zIndex: 1000,
//             }}
//           >
//             <SchedulerMessage onClose={() => setShowScheduler(false)} userId={userId} />
//           </div>
//         </>
//       )}

//       {showVIPCollection && (
//         <>
//           <div
//             style={{
//               position: "fixed",
//               top: 0,
//               left: 0,
//               width: "100vw",
//               height: "100vh",
//               backgroundColor: "rgba(0, 0, 0, 0.5)",
//               zIndex: 999,
//             }}
//             onClick={() => setShowVIPCollection(false)}
//           ></div>

//           <div
//             style={{
//               position: "fixed",
//               top: "50%",
//               left: "50%",
//               transform: "translate(-50%, -50%)",
//               zIndex: 1000,
//             }}
//           >
//             <VIPCollection onClose={() => setShowVIPCollection(false)} />
//           </div>
//         </>
//       )}

//     </div>
//   );
// }

// export default ChatList;

import { useEffect, useState, useRef } from "react";
import { Search, MoreVertical } from "lucide-react";
import { fetchChats } from "../../API/chat";
import ViewScheduledMessages from "./ScheduledMessagesScreen";
import VIPCollection from "./VIPCollection";
import MessageFilter from "./utils/MessageFilter";
import CreateGroupChat from "./CreateGroupChat"; // Import the new component
import API_URL from "../../Config";

function ChatList({ onSelectChat }) {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [showScheduler, setShowScheduler] = useState(false);
  const [showVIPCollection, setShowVIPCollection] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showVIP, setShowVIP] = useState(false);

  const menuRef = useRef();
  const userId = localStorage.getItem("userId");

  const cleanUrl = (baseUrl, path) => {
    return `${baseUrl.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
  };



  useEffect(() => {
    const getChats = async () => {
      try {
        if (!userId) throw new Error("User ID not found!");
        const data = await fetchChats(userId);
        console.log("🛠️ Chats API Response:", data);
        setChats(data || []);
      } catch (error) {
        console.error("❌ Error Fetching Chats:", error);
        setChats([]);
      }
      setLoading(false);
    };
    getChats();
  }, []);

  // Close menu if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  return (
    <div className="chat-list">
      <div className="search-container" style={{ position: "relative", display: "flex", alignItems: "center" }}>
        <Search className="search-icon" />
        <input
          type="text"
          placeholder="Search here..."
          className="search-inputchatlist"
        />
        <div style={{ marginLeft: "auto", position: "relative" }} ref={menuRef}>
          <MoreVertical
            className="menu-icon"
            style={{ cursor: "pointer" }}
            onClick={() => setShowMenu(!showMenu)}
          />

          {showMenu && (
            <div className="dropdown-menu" style={{
              position: "absolute",
              top: "30px",
              right: "0",
              background: "#fff",
              border: "1px solid #ddd",
              borderRadius: "5px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
              zIndex: 10
            }}>
              <div
                className="dropdown-item"
                onClick={() => {
                  setShowVIPCollection(true);
                  setShowMenu(false);
                }}
              >
                ⭐ VIP Collections
              </div>

              <div
                className="dropdown-item"
                onClick={() => {
                  setShowScheduler(true);
                  setShowMenu(false);
                }}
              >
                🕒 Scheduler Message
              </div>

              {/* New Create Group Chat option */}
              <div
                className="dropdown-item"
                onClick={() => {
                  setShowCreateGroup(true);
                  setShowMenu(false);
                }}
              >
                👥 Create Group Chat
              </div>
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <p>Loading chats...</p>
      ) : chats.length > 0 ? (
        <div className="conversations">
          {chats.map((chat, index) => {
            const chatName =
              chat.chatInfo?.name || (chat.isGroup ? "Group" : "Unknown");

            return (
              <div
                key={chat.id || index}
                className="conversation-item"
                onClick={() => onSelectChat(chat)}
              >
                <div className="avatar">
                  {/* {chatName[0] || "?"} */}
                  <img
                    src={chat.chatInfo?.imgUrl
                      ? cleanUrl(API_URL, chat.chatInfo.imgUrl)
                      : chat.isGroup
                        ? '/default-group.png'
                        : '/default-user.png'}
                    alt={chatName}
                    className="user-avatar"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = chat.isGroup ? '/default-group.png' : '/default-user.png';
                    }}
                  />
                </div>
                <div className="conversation-details">
                  <div className="conversation-name">{chatName}</div>
                  <div className="conversation-message">
                    <MessageFilter message={chat?.lastMessage?.content || "No messages yet"}>
                      {(filteredContent) => filteredContent}
                    </MessageFilter>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p>No chats available.</p>
      )}

      {/* Scheduler Message Modal */}
      {showScheduler && (
        <>
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 999,
            }}
            onClick={() => setShowScheduler(false)}
          ></div>

          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 1000,
            }}
          >
            <ViewScheduledMessages onClose={() => setShowScheduler(false)} userId={userId} />
          </div>
        </>
      )}

      {/* VIP Collection Modal */}
      {showVIPCollection && (
        <>
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 999,
            }}
            onClick={() => setShowVIPCollection(false)}
          ></div>

          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 1000,
            }}
          >
            <VIPCollection onClose={() => setShowVIPCollection(false)} />
          </div>
        </>
      )}

      {/* Create Group Chat Modal */}
      {showCreateGroup && (
        <>
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 999,
            }}
            onClick={() => setShowCreateGroup(false)}
          ></div>

          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 1000,
            }}
          >
            <CreateGroupChat
              onClose={() => setShowCreateGroup(false)}
              userId={userId}
              onGroupCreated={(newGroup) => {
                setChats([newGroup, ...chats]);
                setShowCreateGroup(false);
              }}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default ChatList;