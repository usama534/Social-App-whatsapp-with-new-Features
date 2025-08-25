// socket.js
import { Server } from "socket.io";
import {
    getAutoReply,
    isGroupChat,
    vipMessageHandling,
} from "./utils/utils.js";

let io = null;
const onlineUsers = new Map();

function setupSocket(httpServer) {
    io = new Server(httpServer, {
        cors: {
            origin: "*",
        },
    });

    io.on("connection", (socket) => {
        console.log("CONNECTED:", socket.id);
        const uid = socket.handshake.query.uid;
        if (uid) {
            onlineUsers.set(uid, socket.id);
        }

        socket.on("sendMessage", async ({ chatId, messageId, senderId }) => {
            console.log("SENDING MESSAGE .ON ", { chatId, messageId, senderId });

            io.emit(`receiveMessage_${chatId}`, messageId);
            io.emit(`updateAllChatsView`, chatId, messageId);

            // if (!(await isGroupChat(chatId))) {
            //     let autoReplyId = await getAutoReply(chatId, senderId, messageId);
            //     if (autoReplyId) {
            //         console.log("Auto Reply Found " + autoReplyId);
            //         io.emit(`receiveMessage_${chatId}`, autoReplyId);
            //         io.emit("updateAllChatsView", chatId, autoReplyId);
            //     }
            // } else {
            //     let vipMessages = await vipMessageHandling(senderId, messageId, chatId);
            //     if (vipMessages) {
            //         vipMessages.forEach((e) => {
            //             console.log(
            //                 `Emitting: receiveMessage_${e} | ${messageId} FOR VIPCOLLECTION`
            //             );
            //             io.emit(`receiveMessage_${e}`, messageId);
            //         });
            //     }
            // }
        });

        socket.on("disconnect", () => {
            console.log("DISCONNECTED");
            if (uid) onlineUsers.delete(uid);
        });
    });
}

function getIO() {
    if (!io) throw new Error("Socket.io not initialized!");
    return io;
}

function getOnlineUsers() {
    return onlineUsers;
}

export const isOnline = (uid) => onlineUsers.has(uid);

export const notifyUser = (uid, data) => {
    let socketId = onlineUsers.get(uid);
    if (!socketId) return;
    io.to(socketId).emit("updates", data);
};

export { setupSocket, getIO, getOnlineUsers };