import React, { useState, useEffect } from "react";
import {
  saveAutoReply,
  fetchAutoReplies,
  deleteAutoReply,
  updateAutoReplyToggle,
} from "../../API/autoreply";
import "./Messages.css";

function AutoReply({ onClose, userId, chatId }) {
  const [isAutoReplyEnabled, setIsAutoReplyEnabled] = useState(false);
  const [triggerMessage, setTriggerMessage] = useState("");
  const [replyMessage, setReplyMessage] = useState("");
  const [autoReplies, setAutoReplies] = useState([]);
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  useEffect(() => {
    const fetchReplies = async () => {
      try {
        const response = await fetchAutoReplies(userId, chatId);
        console.log("✅ Auto Replies Fetched:", response);

        if (typeof response.isEnabled === "boolean") {
          setIsAutoReplyEnabled(response.isEnabled);
        }
        if (Array.isArray(response.autoReplies)) {
          setAutoReplies(response.autoReplies);
        } else {
          setAutoReplies([]);
        }

        setInitialLoadDone(true); // mark initial load done
      } catch (error) {
        console.error("❌ Error fetching auto-replies:", error);
      }
    };

    if (userId && chatId) {
      fetchReplies();
    }
  }, [userId, chatId]);

  const handleToggle = async () => {
    const newState = !isAutoReplyEnabled;
    setIsAutoReplyEnabled(newState);

    if (!initialLoadDone) return; // skip first render toggle

    try {
      const res = await updateAutoReplyToggle(userId, chatId, newState);
      console.log("✅ Toggle updated:", res);
    } catch (error) {
      console.error("❌ Error updating toggle:", error);
    }
  };

  const handleAddReply = async () => {
    if (!triggerMessage.trim() || !replyMessage.trim()) return;

    try {
      const newReply = await saveAutoReply(userId, chatId, triggerMessage, replyMessage);
      console.log("✅ New Auto Reply Response:", newReply);

      if (newReply?.autoReply) {
        const newAutoReply = newReply.autoReply;
        setAutoReplies((prev) => [
          ...prev,
          {
            trigger: newAutoReply.trigger || newAutoReply.message,
            reply: newAutoReply.reply,
            _id: newAutoReply._id,
          },
        ]);
      }

      setTriggerMessage("");
      setReplyMessage("");
    } catch (error) {
      console.error("❌ Error adding auto-reply:", error);
    }
  };

  const handleDeleteReply = async (id) => {
    try {
      // Call the deleteAutoReply function which now uses PUT
      await deleteAutoReply(id);

      // After successful deletion, update the UI
      setAutoReplies((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      console.error("❌ Error deleting auto-reply:", error);
    }
  };


  return (
    <div className="auto-reply-container">
      <div className="auto-reply-header">
        <h2>Auto Reply</h2>
        <button className="close-btn" onClick={onClose}>X</button>
      </div>

      <div className="toggle-section">
        <label>Enable Auto Reply</label>
        <input
          type="checkbox"
          checked={isAutoReplyEnabled}
          onChange={handleToggle}
        />
      </div>

      {isAutoReplyEnabled && (
        <div className="auto-reply-form">
          <input
            type="text"
            placeholder="Trigger Message (e.g. Hello)"
            value={triggerMessage}
            onChange={(e) => setTriggerMessage(e.target.value)}
          />
          <input
            type="text"
            placeholder="Auto Reply Message"
            value={replyMessage}
            onChange={(e) => setReplyMessage(e.target.value)}
          />
          <button onClick={handleAddReply}>Add</button>
        </div>
      )}

      <div className="auto-reply-list">
        <h3>Auto Replies</h3>
        {autoReplies.length > 0 ? (
          autoReplies.map((item) => (
            <div key={item._id || `${item.trigger}-${item.reply}`} className="auto-reply-item">
              <p>
                <strong>{item.trigger || item.message}:</strong> {item.reply}
              </p>
              <button
                className="delete-btn"
                onClick={() => handleDeleteReply(item._id)}
              >
                🗑
              </button>
            </div>
          ))
        ) : (
          <p>No auto replies set</p>
        )}
      </div>
    </div>
  );
}

export default AutoReply;
