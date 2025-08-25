import mongoose from "mongoose";
import {
  Chats,
  ChatGroups,
  Users,
  GroupMembers,
} from "../database/models/models.js";

import chatController from "./chatController.js";

export default {
  getGroupChat: async function (gid, uid) {
    let group = await ChatGroups.findById(gid).select(
      "name imgUrl aboutGroup allowChatting admins chat"
    );

    let isAdmin = group.admins.includes(uid);

    let chat = await chatController.getChat(group.chat);

    return {
      groupInfo: {
        name: group.name,
        imgUrl: group.imgUrl,
        aboutGroup: group.aboutGroup,
        canChat: group.allowChatting || isAdmin,
        isAdmin,
      },
      chat,
    };
  },

  getParticipants: async function (gid) {
    let group = await ChatGroups.findById(gid).select("chat admins");

    let chatParticipants = await Chats.findById(group.chat)
      .select("participants")
      .populate("participants", "name imgUrl");

    return chatParticipants.participants.map((e) => ({
      id: e._id,
      name: e.name,
      imgUrl: e.imgUrl,
      isAdmin: group.admins.includes(e._id),
    }));
  },

  newGroupChat: async function (
    creator_id,
    name,
    imgUrl,
    aboutGroup,
    allowChatting,
    isAnnoucement = undefined,
    is_private = false,
    allowedReactions = []
  ) {
    let chat = new Chats({
      type: 1,
      participants: [creator_id],
      isGroup: true,
      allowedReactions,
    });
    let group = new ChatGroups({
      name,
      imgUrl: imgUrl,
      aboutGroup,
      allowChatting,
      admins: [creator_id],
      chat: chat._id,
      is_private,
      isAnnoucement,
    });
    if (!isAnnoucement)
      await Users.findByIdAndUpdate(creator_id, {
        $push: { groupChats: group._id },
      });

    await chat.save();
    await group.save();


    return group._id;
  },

  // Add user.
  addToGroupChat: async function (gid, uid) {
    let chatGroup = await ChatGroups.findById(gid).select("chat -_id");

    if (!chatGroup) return;

    await Users.findByIdAndUpdate(uid, {
      // Add in user's active group chats.
      $push: { groupChats: gid },
    });
    await Chats.findByIdAndUpdate(chatGroup.chat, {
      // Add participant
      $push: { participants: uid },
      $inc: { totalParticipants: 1 },
    });
  },

  // Admins

  getAdmins: async function (gid) {
    let group = await ChatGroups.findById(gid)
      .select("admins")
      .populate("admins", "name imgUrl");

    return group.admins;
  },

  addAdmins: async function (gid, admins) {
    let group = await ChatGroups.findById(gid);
    group.admins.addToSet(...admins);
    await group.save();
  },

  removeAdmin: async function (gid, admin) {
    await ChatGroups.findByIdAndUpdate(gid, { $pull: { admins: admin } });
  },

  // updateGroupSettings: async function (gid, settings) {
  //   await ChatGroups.findByIdAndUpdate(gid, settings);
  // },
  updateGroupSettings: async function (gid, settings, newImg) {
    const {
      name,
      imgUrl,
      aboutGroup,
      allowChatting,
      is_private,
      allowedReactions,
    } = settings;

    let chat = await ChatGroups.findByIdAndUpdate(gid, {
      name,
      imgUrl: newImg ?? imgUrl,
      is_private,
      allowChatting,
      aboutGroup,
    }).select("chat");

    await Chats.findByIdAndUpdate(chat.chat, {
      allowedReactions,
    });
  },

  removeMember: async function (gid, uid) {
    let chatid = await ChatGroups.findById(gid).select("chat");

    await Chats.findByIdAndUpdate(chatid.chat, {
      $pull: { participants: uid },
      $inc: { totalParticipants: -1 },
    });

    await Users.findByIdAndUpdate(uid, {
      $pull: { groupChats: chatid._id },
    }); // Remove from users
  },

  // getGroupByChatId: async function (chatId) {
  //   try {
  //     const group = await ChatGroups.findOne({ chat: chatId })
  //       .select("-__v") // Exclude version key
  //       .lean(); // Return plain JavaScript object

  //     if (!group) {
  //       return null;
  //     }

  //     // Convert MongoDB ObjectId and Date to strings for better client handling
  //     group._id = group._id.toString();
  //     group.chat = group.chat.toString();
  //     group.createdAt = group.createdAt.toISOString();
  //     group.updatedAt = group.updatedAt.toISOString();

  //     return group;
  //   } catch (error) {
  //     console.error("Error fetching group by chat ID:", error);
  //     throw error;
  //   }
  // },
  getGroupByChatId: async function (chatId) {
    try {
      // Convert string ID to ObjectId if needed
      const query = mongoose.Types.ObjectId.isValid(chatId)
        ? { chat: new mongoose.Types.ObjectId(chatId) }
        : { chat: chatId };

      const group = await ChatGroups.findOne(query)
        .select("-__v") // Exclude version key
        .populate('members', 'username avatar') // Example population
        .lean();

      if (!group) {
        console.log(`No group found for chatId: ${chatId}`);
        return null;
      }

      // Convert MongoDB special types to strings
      const transformGroup = (group) => {
        return {
          ...group,
          _id: group._id.toString(),
          chat: group.chat.toString(),
          createdAt: group.createdAt.toISOString(),
          updatedAt: group.updatedAt.toISOString(),
          members: group.members?.map(member => ({
            ...member,
            _id: member._id.toString()
          }))
        };
      };

      return transformGroup(group);
    } catch (error) {
      console.error("Error fetching group by chat ID:", {
        error: error.message,
        chatId,
        stack: error.stack
      });
      throw error;
    }
  },
  // Add this method to your existing chatGroupController
  getNonAdminMembers: async function (groupId) {
    try {
      // Get the group with admins
      const group = await ChatGroups.findById(groupId).select("admins chat");
      if (!group) {
        throw new Error("Group not found");
      }

      // Get all participants in the chat
      const chat = await Chats.findById(group.chat)
        .select("participants")
        .populate("participants", "name imgUrl type");

      // Filter out admins and return regular members
      const nonAdminMembers = chat.participants.filter(
        (participant) => !group.admins.includes(participant._id)
      );

      return nonAdminMembers.map((member) => ({
        _id: member._id,
        name: member.name,
        imgUrl: member.imgUrl,
        type: member.type,
      }));
    } catch (error) {
      console.error("Error in getNonAdminMembers:", error);
      throw error;
    }
  },
};
