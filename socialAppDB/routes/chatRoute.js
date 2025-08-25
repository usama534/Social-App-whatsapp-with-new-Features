import { Router } from "express";
import mongoose from "mongoose";  // ES Module import
import chatController from "../controllers/chatController.js";
import path from "path";
import multer from "multer";
import { diskStorage } from "multer";
import userController from "../controllers/userController.js";

const router = Router();
const { Types: { ObjectId } } = mongoose; // Destructure ObjectId

const destination = "/static/messages";
const storage = diskStorage({
  destination: `.${destination}`,
  filename: function (req, file, cb) {
    const uniqueSuffix = `${Date.now()}_${Math.round(Math.random() * 1e9)}`;
    cb(
      null,
      `${file.fieldname}_${uniqueSuffix}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({ storage });

const messageAttchments = multer({ storage });
router.put("/addReaction/:uid/:mid/:reaction", async (req, res) => {
  await chatController.addReaction(
    req.params.mid,
    req.params.uid,
    req.params.reaction
  );
  return res.json({ message: "success" });
});

router.put("/removeReaction/:mid/:rId", async (req, res) => {
  await chatController.removeReaction(req.params.mid, req.params.rId);
  return res.json({ message: "success" });
});

router.get("/", (req, res) => {
  return res.send({ message: "Test" });
});

router.get("/", (req, res) => {
  return res.send({ message: "Test" });
});

// ✅
router.post("/initiateChat/:sender/:receiver", async (req, res) => {
  return res.json({
    message: "success",
    id: await chatController.initiateChat(
      req.params.sender,
      req.params.receiver
    ),
  });
});

// ✅
router.get("/getChat/:cid/:uid/:messageCount", async (req, res) => {
  const data = await chatController.getChat(
    req.params.cid,
    req.params.uid,
    parseInt(req.params.messageCount)
  );
  console.log(data);
  return res.json(data);
});

router.get("/getChats_short/:uid", async (req, res) => {
  return res.json(await chatController.getAllChats_short(req.params.uid));
});
router.get("/getPendingConfirmation/:uid", async (req, res) => {
  return res.json(await userController.getPendingConfirmations(req.params.uid));
});
// ✅
router.get("/getChatSettings/:chat/:uid", async (req, res) => {
  return res.json(
    await chatController.getChatSettings(req.params.chat, req.params.uid)
  );
});
router.put("/confirmScheduledMessage/:mid", async (req, res) => {
  await chatController.confirmScheduledMessage(req.params.mid);
  return res.json({ message: "success" });
});
// router.post(
//   "/updateScheduledMessage/:id",
//   messageAttchments.array("messageAttchments"),
//   async (req, res) => {
//     let { chats, existingAttachments, messageContent, pushTime, confirmed, isConfirmationMode } =
//       req.body;

//     if (!existingAttachments) existingAttachments = [];

//     console.log(req.body);
//     const newAttachments = req.files?.map(
//       (e) => `${destination}/${e.filename}`
//     );

//     const id = await chatController.updateScheduledMessage(
//       req.params.id,
//       chats,
//       messageContent,
//       [...newAttachments, ...existingAttachments],
//       pushTime,
//       confirmed,
//       isConfirmationMode
//     );

//     return res.json({ id });
//   }
// );
router.post(
  "/updateScheduledMessage/:id",
  upload.array("messageAttachments"),
  async (req, res) => {
    try {
      // Parse chats array
      let chats = [];
      if (req.body.chats) {
        if (Array.isArray(req.body.chats)) {
          chats = req.body.chats;
        } else if (typeof req.body.chats === 'string') {
          try {
            chats = JSON.parse(req.body.chats);
          } catch (e) {
            chats = [req.body.chats];
          }
        }
      }

      // Convert string IDs to ObjectIds
      chats = chats.map(id => new ObjectId(id));

      const { messageContent, pushTime, confirmed } = req.body;

      // Handle existingAttachments
      let existingAttachments = [];
      if (req.body.existingAttachments) {
        existingAttachments = Array.isArray(req.body.existingAttachments)
          ? req.body.existingAttachments
          : [req.body.existingAttachments];
      }

      const newAttachments = req.files?.map(
        (e) => `${destination}/${e.filename}`
      ) || [];

      const id = await chatController.updateScheduledMessage(
        req.params.id,
        chats,
        messageContent,
        [...existingAttachments, ...newAttachments],
        pushTime,
        confirmed,
        false // isConfirmationMode
      );

      return res.json({ success: true, id });
    } catch (error) {
      console.error('Error in updateScheduledMessage:', error);
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
);
// ✅
router.get("/getAllChats/:uid", async (req, res) => {
  return res.json(await chatController.getAllChats(req.params.uid));
});

// ✅
router.get("/getMessage/:mid/:uid", async (req, res) => {
  return res.json(
    await chatController.getMessage(req.params.mid, req.params.uid)
  );
});

// ✅
router.post(
  "/sendMessage/:cid",
  messageAttchments.array("attachments"),
  async (req, res) => {
    console.log(req.files);

    let message_id = await chatController.sendMessage(
      req.params.cid,
      req.body.senderId,
      req.body.content,
      req.files?.map((e) => `${destination}/${e.filename}`),
      req.body.isReply,
      req.body.replyId
    );
    return res.json({ message: "success", message_id });
  }
);

// cid -> chatId
// ✅
router.delete("/deleteMessage/:mid/:cid", async (req, res) => {
  await chatController.deleteMessage(req.params.mid, req.params.cid);
  return res.json({ message: "success" });
});

// Auto-Reply
// uid -> userId, cid -> ChatId
// ✅
router.get("/getAutoReplies/:uid/:cid", async (req, res) => {
  return res.json(
    await chatController.getAutoReplies(req.params.uid, req.params.cid)
  );
});

// ✅
router.post("/addAutoReply/:uid/:cid", async (req, res) => {
  let autoReply = await chatController.addAutoReply(
    req.params.uid,
    req.params.cid,
    req.body
  );

  return res.json({ autoReply, message: "success" });
});

// ✅
router.put("/editAutoReply/:rid", async (req, res) => {
  let autoReply = await chatController.editAutoReply(
    req.params.rid,
    req.body.message,
    req.body.reply
  );

  return res.json({ autoReply, message: "success" });
});

// ✅
router.put("/removeAutoReply/:id", async (req, res) => {
  await chatController.removeAutoReply(req.params.id);
  return res.json({ message: "success" });
});

router.put("/modifyAutoReplies/", async (req, res) => {
  await chatController.modifyAutoReplies(req.body);
  return res.json({ message: "success" });
});

// Auto-Download
// ✅
router.put("/toggleAutoDownload/:sid", async (req, res) => {
  let value = await chatController.toggleAutoDownload(req.params.sid);
  return res.json({ message: "success", value });
});

// ✅
router.put("/updateDownloadDirectory/:sid", async (req, res) => {
  await chatController.updateDownloadDirectory(req.params.sid, req.body.dir);
  return res.json({ message: "success" });
});

// Message Scheduling
router.post(
  "/scheduleMessage",
  messageAttchments.array("messageAttchments"),
  async (req, res) => {
    let { chats, messageContent, senderId, pushTime } = req.body;
    console.log(req.body);

    let id = await chatController.scheduleMessages(
      chats,
      messageContent,
      req.files?.map((e) => `${destination}/${e.filename}`),
      senderId,
      pushTime
    );

    return res.json({ message: "success", id });
  }
);

router.get("/getAutoDownloadSettings/:uid/:cid", async (req, res) => {
  return res.json(
    await chatController.getAutoDownloadSettings(req.params.uid, req.params.cid)
  );
});

router.post("/updateDownloadSettings/", async (req, res) => {
  return res.json(
    await chatController.updateDownloadSettings(
      req.body._id,
      req.body.autoDownload,
      req.body.autoDownloadDirectory
    )
  );
});
router.get("/getScheduledMessages/:uid", async (req, res) => {
  const m = await chatController.getScheduledMessage({
    sender: req.params.uid,
  });
  console.log("RET => ", m);
  return res.json(m);
});
router.delete("/deleteScheduledMessage/:mid", async (req, res) => {
  await chatController.deleteScheduledMessage(req.params.mid);
  return res.json({ message: "success" });
});

export default router;
