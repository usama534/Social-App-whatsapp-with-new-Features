// import cors from "cors";
// import express from "express";
// import pkg from "body-parser";
// import morgan from "morgan";
// import { createServer } from "http";
// import { Server } from "socket.io";
// import { connectDB } from "./database/db.js";
// const { json, urlencoded } = pkg;

// // Scheduler
// import { startMessageScheduler } from "./scheduler.js";

// // Routes
// import userRoutes from "./routes/userRoutes.js";
// import postsRoute from "./routes/postsRoute.js";
// import studentsRoute from "./routes/studentRoute.js";
// import postGroupRoute from "./routes/postGroupRoute.js";
// import chatGroupRoute from "./routes/chatGroupRoute.js";
// import communityRoute from "./routes/communityRoute.js";
// import chatRoute from "./routes/chatRoute.js";
// import feedRouter from "./routes/feedRoute.js";
// import notificationRouter from "./routes/notificationRoute.js";

// //
// import {
//   getAutoReply,
//   isGroupChat,
//   vipMessageHandling,
// } from "./utils/utils.js";
// import { ScheduledMessages } from "./database/models/models.js";
// // import path from "path";
// import path from "path";
// import { fileURLToPath } from "url";
// import { dirname } from "path";

// ////////////////////////////////////////////////////////////////////////

// const app = express();

// // Middleware
// // app.use(json());
// app.use(express.json())

// app.use(
//   urlencoded({
//     extended: true,
//   })
// );

// app.use(cors());
// app.use(morgan("tiny"));

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// // app.use("/static", express.static("static"));
// app.use("/static", express.static(path.join(__dirname, "static")));

// const httpServer = createServer(app);
// const io = new Server(httpServer, {
//   cors: {
//     origin: "*",
//   },
// });

// // After auto-reply
// // Listen
// io.on("connection", (socket) => {
//   console.log("CONNECTED");

//   // socket.on("test", text => {
//   //   console.log("test" + text);
//   // })

//   socket.on("sendMessage", async ({ chatId, messageId, senderId }) => {
//     console.log("SENDING MESSAGE .ON ", { chatId, messageId, senderId });

//     io.emit(`receiveMessage_${chatId}`, messageId); // Emit the current message
//     io.emit(`updateAllChatsView`, chatId, messageId);

//     if (!(await isGroupChat(chatId))) {
//       //"Not Group Chat"
//       console.log(`chatId: ${chatId}, senderId: ${senderId}, messageId: ${messageId}`)
//       let autoReplyId = await getAutoReply(chatId, senderId, messageId);

//       if (autoReplyId) {
//         console.log("Auto Reply Found " + autoReplyId);
//         io.emit(`receiveMessage_${chatId}`, autoReplyId); // Emit the autoReply message
//         io.emit("updateAllChatsView", chatId, autoReplyId); // Update all chats view
//       }
//     }
//     // Vip messages Filter
//     else {
//       let vipMessages = await vipMessageHandling(senderId, messageId, chatId);
//       if (vipMessages) {
//         vipMessages.forEach((e) => {
//           console.log(
//             `Emitting: receiveMessage_${e} | ${messageId} FOR VIPCOLLECTION`
//           );
//           io.emit(`receiveMessage_${e}`, messageId); // Emit the Vip message
//         });
//       }
//     }
//   });

//   socket.on("disconnect", () => {
//     console.log("DISCONNECTED");
//   });
// });

// ////////////////////////////////////////////////////////////////////////

// app.get("/", (req, res) => {
//   res.send("Wow Apple!");
// });

// app.get("/download", (req, res) => {
//   let file = path.join(__dirname, req.body.path);
//   return res.download(file);
// });

// // Route Handler

// app.use("/api/user", userRoutes);
// app.use("/api/posts", postsRoute);
// app.use("/api/student", studentsRoute);
// app.use("/api/postgroup", postGroupRoute);
// app.use("/api/chatgroup", chatGroupRoute);
// app.use("/api/community", communityRoute);
// app.use("/api/chat", chatRoute);
// app.use("/api/feed", feedRouter);
// app.use("/api/notifications", notificationRouter);

// (async () => {
//   await connectDB();
//   httpServer.listen(3001, () => {
//     console.log("Listening On ws://localhost:3001\nhttp://localhost:3001");
//   });
//   startMessageScheduler();
// })();

// // startServer();
import cors from "cors";
import express from "express";
import pkg from "body-parser";
import morgan from "morgan";
import { createServer } from "http";
import {
  setupSocket,
  getIO,
  getOnlineUsers,
  notifyUser,
} from './socket.js';
import "./confirmation_prompt.js"; // TODO: Enable Prompting
import { connectDB } from "./database/db.js";


const { json, urlencoded } = pkg;

// Scheduler
import { startMessageScheduler } from "./scheduler.js";

// Routers
import userRoutes from "./routes/userRoutes.js";
import postsRoute from "./routes/postsRoute.js";
import studentsRoute from "./routes/studentRoute.js";
import postGroupRoute from "./routes/postGroupRoute.js";
import chatGroupRoute from "./routes/chatGroupRoute.js";
import communityRoute from "./routes/communityRoute.js";
import chatRoute from "./routes/chatRoute.js";
import feedRouter from "./routes/feedRoute.js";
import notificationRouter from "./routes/notificationRoute.js";
import datacellRouter from "./routes/datacellRoute.js";

import path from "path";
// import { initMessageFilter } from "./test/comp.js";

////////////////////////////////////////////////////////////////////////


// initMessageFilter()
const app = express();

// Middleware
app.use(express.json());

app.use(
  urlencoded({
    extended: true,
  })
);

app.use(cors());
app.use(morgan("tiny"));

app.use("/static", express.static("static"));

const httpServer = createServer(app);
setupSocket(httpServer);

app.get("/", (req, res) => {
  res.send("Wow Apple!");
});

app.get("/t", (req, res) => {
  notifyUser("6754a9268db89992d5b8221e", 10);
  return res.json([
  ])
});

app.get("/download", (req, res) => {
  let file = path.join(__dirname, req.body.path);
  return res.download(file);
});

// Route Handler
app.use("/api/user", userRoutes);
app.use("/api/posts", postsRoute);
app.use("/api/student", studentsRoute);
app.use("/api/postgroup", postGroupRoute);
app.use("/api/chatgroup", chatGroupRoute);
app.use("/api/community", communityRoute);
app.use("/api/chat", chatRoute);
app.use("/api/notifications", notificationRouter);
app.use("/api/datacell", datacellRouter);
app.use("/api/feed", feedRouter);

(async () => {
  await connectDB();
  httpServer.listen(3001, () => {
    console.log("Listening on ws://localhost:3001\nhttp://localhost:3001");
  });
  startMessageScheduler();
})();

// startServer();