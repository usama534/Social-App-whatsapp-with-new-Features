import { Communities, CommunityMembers, Users, GroupMembers, ChatGroups } from "../database/models/models.js";
import { getRandomThree, selectPostGroups, selectGroupChats } from "../utils/utils.js";
import chatGroupController from "./chatGroupController.js";
import { difference, intersection } from "set-operations";
import { Types } from "mongoose";

export default {
  newCommunity: async function (createrId, title, imgUrl = "/static/avatars/default_community.png", aboutCommunity) {
    let annoucementGroup = await chatGroupController.newGroupChat(
      createrId,
      "Annoucements",
      "/static/avatars/annoucement_channel.png",
      "",
      false,
      true
    );



    let community = new Communities({
      communityAdmins: [createrId],
      title,
      imgUrl,
      annoucementGroup,
      aboutCommunity,
    });

    await community.save();
    await this.addMember(community._id, createrId);
    return community._id;
  },

  addAdmins: async function (cid, admins) {
    await Communities.findByIdAndUpdate(cid, {
      $addToSet: { communityAdmins: admins },
    });
  },

  removeAdmins: async function (cid, admins) {
    await Communities.findByIdAndUpdate(cid, {
      $pullAll: { communityAdmins: admins },
    });
  },

  /*
  @params => group_type [postgroup, chatgroup]!
  */
  addGroupToCommunity: async function (cid, group_type, group_id) {
    // await Communities.findByIdAndUpdate(cid, {
    //   $push: { groups: { gid: group_id, group_type } },
    // });
    await Communities.findByIdAndUpdate(cid, {
      $push: { [group_type]: group_id }
    })
  },

  addMember: async function (cid, uid) {
    await CommunityMembers.insertMany([
      {
        cid,
        uid,
      },
    ]);
  },


  getCommunityAdmins: async function (cid) {
    const community = await Communities.findById(cid)
      .populate({ path: "communityAdmins", select: "_id name imgUrl" })
      .select("communityAdmins");

    if (!community) throw new Error("Community not found");
    console.log("------------------------------>", community.communityAdmins);
    return community.communityAdmins;
  },

  getCommunityMembers: async function (cid) {
    const members = await CommunityMembers.find({ cid })
      .populate({ path: "uid", select: "_id name imgUrl" })
      .select("uid");

    return members.map((entry) => entry.uid);
  },
  removeGroupFromCommunity: async function (cid, groupType, groupId) {
    if (!["postgroup", "chatgroup"].includes(groupType)) {
      throw new Error("Invalid group type");
    }

    await Communities.findByIdAndUpdate(cid, {
      $pull: { [groupType]: groupId },
    });
  },
  editCommunity: async function (cid, updates = {}) {
    const updateData = {};
    if (updates.title) updateData.title = updates.title;
    if (updates.aboutCommunity)
      updateData.aboutCommunity = updates.aboutCommunity;
    if (updates.imgUrl) updateData.imgUrl = updates.imgUrl;

    await Communities.findByIdAndUpdate(cid, updateData, { new: true });
  },
  getCommunityGroups: async (cid) => {
    try {
      const community = await Communities.findById(cid)
        .populate({
          path: "chatgroup",
          select: "_id name imgUrl aboutGroup members",
        })
        .populate({
          path: "postgroup",
          select: "_id name imgUrl description admins",
        })
        .lean();

      if (!community) {
        throw new Error("Community not found");
      }

      return {
        success: true,
        chatGroups: community.chatgroup || [],
        postGroups: community.postgroup || [],
        totalGroups:
          (community.chatgroup?.length || 0) +
          (community.postgroup?.length || 0),
      };
    } catch (error) {
      console.error("Error fetching community groups:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  },
  getAllGroupChats: async function (uid) {
    // Get groups where the user is a participant (via User model)
    const user = await Users.findById(uid).select("groupChats");

    if (!user) throw new Error("User not found");

    // Get all the group chats the user is part of
    const groups = await ChatGroups.find({
      _id: { $in: user.groupChats },
    }).select("name imgUrl aboutGroup allowChatting admins chat");

    // Fetch all group chat info in parallel
    const result = await Promise.all(
      groups.map(async (group) => {
        const isAdmin = group.admins.some(
          (adminId) => adminId.toString() === uid.toString()
        );

        const chat = await chatController.getChat(group.chat);

        return {
          groupInfo: {
            _id: group._id,
            name: group.name,
            imgUrl: group.imgUrl,
            aboutGroup: group.aboutGroup,
            canChat: group.allowChatting || isAdmin,
            isAdmin,
          },
          chat,
        };
      })
    );

    return result;
  },
  // getCommunity: async function (cid, requesterId) {
  //   let community = await Communities.findById(cid).select("-__v");
  //   let isMember = await CommunityMembers.findOne({ cid, uid: requesterId });

  //   if (!isMember) {
  //     return {
  //       title: community.title,
  //       imgUrl: community.imgUrl,
  //       totalGroups: community.groups.length,
  //       isMember: false,
  //     };
  //   }

  //   let isAdmin = community.communityAdmins.includes(requesterId);
  //   let isCreator = community.communityAdmins[0] == requesterId;

  //   await community.populate([
  //     { path: "groups.gid", select: "name imgUrl" },
  //     { path: "annoucementGroup", select: "name imgUrl" },
  //   ]);

  //   return { community, isAdmin, isCreator };
  // },

  getCommunities: async function (uid) {
    let joinedCommunityIds = (await CommunityMembers.find({ uid }).select("-_id cid"))?.map(e => e.cid)
    if (joinedCommunityIds.length == 0) return []
    let communities = Communities.find({ _id: joinedCommunityIds }).select("title imgUrl aboutCommunity annoucementGroup")
    return communities;
  },
  getCommunity: async function (cid, requesterId) {
    let community = await Communities.findById(cid).select("-__v");
    let isMember = await CommunityMembers.findOne({ cid, uid: requesterId });


    if (!isMember) {
      return {
        title: community.title,
        imgUrl: community.imgUrl,
        totalGroups: community.postgroup.length + community.chatgroup.length,
        isMember: false,
      };
    }

    let usersChatsGroups = (await Users.findById(requesterId).select("-_id groupChats communityGroups"))
    usersChatsGroups = [...usersChatsGroups.communityGroups.map(String), ...usersChatsGroups.groupChats.map(String)]

    let userPostGroups = (await GroupMembers.find({ uid: requesterId }).select("-_id gid")).map(e => e.gid.toString())


    let communityGroupChats = community.chatgroup.map(String)
    let communityPostGroups = community.postgroup.map(String)

    let excludedChatGroupIds = difference(communityGroupChats, usersChatsGroups).splice(0, 3) // User exists in these chats
    let excludedPostGroupIds = difference(communityPostGroups, userPostGroups).splice(0, 3)

    let joinedGroupChatsIds = intersection(communityGroupChats, usersChatsGroups).splice(0, 3)
    let joinedPostGroupIds = intersection(communityPostGroups, userPostGroups).splice(0, 3)


    let [excludedChatGroup, joinedGroupChats] = await Promise.all([
      selectGroupChats(excludedChatGroupIds, "name imgUrl chat"),
      selectGroupChats(joinedGroupChatsIds, "name imgUrl chat")
    ])

    let [excludedPostGroup, joinedPostGroup] = await Promise.all([
      selectPostGroups(excludedPostGroupIds, "name imgUrl"),
      selectPostGroups(joinedPostGroupIds, "name imgUrl")
    ])

    let excludedGroups = getRandomThree([...excludedChatGroup, ...excludedPostGroup])
    let includedGroups = getRandomThree([...joinedGroupChats, ...joinedPostGroup])

    let isAdmin = community.communityAdmins.includes(requesterId);
    let isCreator = community.communityAdmins[0] == requesterId;

    let comms = (await Communities.aggregate([
      { $match: { _id: new Types.ObjectId(cid) } },
      {
        $lookup: {
          from: "chatgroups",
          localField: "annoucementGroup",
          foreignField: "_id",
          as: "annoucementGroup",
          pipeline: [
            {
              $lookup: {
                from: "chats",
                localField: "chat",
                foreignField: "_id",
                as: "chatData"
              }
            },
            { $unwind: { path: "$chatData", preserveNullAndEmptyArrays: true } },
            {
              $set: {
                lastMessage: { $last: "$chatData.messages" }
              }
            },
            {
              $lookup: {
                from: "messages",
                localField: "lastMessage",
                foreignField: "_id",
                as: "lastMessage"
              },
            },
            { $unwind: "$lastMessage" },
            {
              $lookup: {
                from: "users",
                localField: "lastMessage.senderId",
                foreignField: "_id",
                as: "lastMessage.senderId"
              },
            },
            { $unwind: "$lastMessage.senderId" },
            {
              $project: {
                _id: 0,
                "chat": 1,
                "lastMessage.senderId": "$lastMessage.senderId._id",
                "lastMessage.senderName": "$lastMessage.senderId.name",
                "lastMessage.content": 1,
                "lastMessage.attachments": 1,
                "lastMessage.createdAt": 1,
              }
            },
          ]
        },
      },
      { $unwind: { path: "$annoucementGroup", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          title: 1,
          imgUrl: 1,
          aboutCommunity: 1,
          "annoucementGroup": "$annoucementGroup.chat",
          lastMessage: "$annoucementGroup.lastMessage", // Move lastMessage to root,
        }
      }
    ]))[0];

    let memberCount = await CommunityMembers.countDocuments({ cid })

    if (!Object.keys(comms).includes("lastMessage")) {
      comms = { ...comms, lastMessage: null, annoucementGroup: (await ChatGroups.findById(community.annoucementGroup).select("chat")).chat }
    }

    return { ...comms, memberCount, excludedGroups, includedGroups, isAdmin, isCreator, isMember: true };
  },



  leaveCommunity: async function (cid, uid) {
    // Remove as admin if found
    await Communities.findByIdAndUpdate(cid, {
      $pull: { communityAdmins: uid },
    });
    await CommunityMembers.deleteOne({ cid, uid });
  },
};
