import { connectDB } from "./database/db.js";
import {
  Courses,
  Datesheet,
  Enrollment,
  Posts,
  Sessions,
  Students,
  Teachers,
  TimeTable,
  Users,
  PostGroups,
  GroupMembers,
  Chats,
  Communities,
  Messages,
  Sections,
  Administrators,
  AutoReply,
  VipCollections,
  Friends,
  CourseMap,
  ChatSettings,
} from "./database/models/models.js";
import postgroupController from "./controllers/postgroupController.js";
import { Types } from "mongoose";
import {
  getCurrentSession,
  getStudentSections,
  isGroupChat,
  getOtherParticipant,
  getAutoReply,
  vipMessageHandling,
  getFriendsIds,
} from "./utils/utils.js";

import { writeFile } from "fs";
import postController from "./controllers/postController.js";
import chatController from "./controllers/chatController.js";

import { getNewMessageCount, getMessageContent } from "./utils/utils.js";
import { parseTimetable } from "./xlparser.js";
import { model, Schema } from "mongoose";
import { effect } from "zod";

let db = await connectDB();

let myId = "6754a9268db89992d5b8221e";
let id2 = "6754a9268db89992d5b8221f";

let chatId = "675c95af52ec11f80a0b8a0c";
let currSession = (await getCurrentSession())._id;
// await Courses.insertMany([
//   { code: "CAI261", title: "PROGRAMMING FOR AI" },
//   { code: "CAI262", title: "MACHINE LEARNING" },
//   {
//     code: "CAI361",
//     title: "ARTIFICIAL NEURAL NETWORKS & DEEP LEARNING",
//   },
//   { code: "CAI364", title: "NATURAL LANGUAGE PROCESSING" },
//   {
//     code: "CS300",
//     title: "INTRODUCTION TO INFORMATION & COMMUNICATION TECHNOLOGIES",
//   },
//   { code: "CS323", title: "PROGRAMMING FUNDAMENTALS" },
//   { code: "CS335", title: "DISCRETE STRUCTURES" },
//   { code: "CS400", title: "DATABASE SYSTEMS" },
//   { code: "CS402", title: "PROGRAMMING IN AI" },
//   { code: "CS403", title: "PROGRAMMING IN AI" },
//   { code: "CS404", title: "MACHINE LEARNING" },
//   { code: "CS405", title: "ARTIFICIAL NEURAL NETWORKS" },
//   { code: "CS406", title: "KNOWLEDGE REPRESENTATION AND REASONING" },
//   { code: "CS408", title: "DEEP LEARNING" },
//   { code: "CS423", title: "OBJECT ORIENTED PROGRAMMING" },
//   { code: "CS430", title: "DIGITAL LOGIC DESIGN" },
//   { code: "CS443", title: "DATA STRUCTURES AND ALGORITHMS" },
//   { code: "CS453", title: "SOFTWARE ENGINEERING" },
//   { code: "CS497", title: "INFORMATION SECURITY" },
//   { code: "CS515", title: "COMPUTING VISION" },
//   { code: "CS516", title: "NATURAL LANGUAGE PROCESSING" },
//   {
//     code: "CS530",
//     title: "COMPUTER ORGANIZATION AND ASSEMBLY LANGUAGE",
//   },
//   { code: "CS536", title: "THEORY OF AUTOMATA AND FORMAL LANGUAGES" },
//   { code: "CS542", title: "ANALYSIS OF ALGORITHMS" },
//   { code: "CS566", title: "WEB TECHNOLOGIES" },
//   { code: "CS572", title: "NUMERICAL ANALYSIS" },
//   { code: "CS577", title: "COMPUTER NETWORKS" },
//   { code: "CS583", title: "OPERATING SYSTEM" },
//   { code: "CS601", title: "DATABASE ADMINISTRATION AND MANAGEMENT" },
//   { code: "CS632", title: "ARTIFICIAL INTELLIGENCE" },
//   { code: "CS636", title: "COMPILER CONSTRUCTION" },
//   { code: "CS666", title: "WEB ENGINEERING" },
//   { code: "CS687", title: "PARALLEL & DISTRIBUTED COMPUTING" },
// { code: "CSC314", title: "PARALLEL & DISTRIBUTED COMPUTING" },
//   { code: "CS692", title: "VISUAL PROGRAMMING" },
//   { code: "CS693", title: "MOBILE APPLICATION DEVELOPMENT" },
//   { code: "CS698", title: "FINAL YEAR PROJECT-I" },
//   {
//     code: "CSC100",
//     title: "APPLICATION OF INFORMATION & COMMUNICATION TECHNOLOGIES",
//   },
//   { code: "CSC101", title: "PROGRAMMING FUNDAMENTALS" },
//   { code: "CSC102", title: "OBJECT ORIENTED PROGRAMMING" },
//   { code: "CSC103", title: "DATABASE SYSTEMS" },
//   { code: "CSC110", title: "DISCRETE STRUCTURES" },
//   { code: "CSC111", title: "DIGITAL LOGIC DESIGN" },
//   { code: "CSC201", title: "DATA STRUCTURES" },
//   { code: "CSC202", title: "INFORMATION SECURITY" },
//   { code: "CSC203", title: "ARTIFICIAL INTELLIGENCE" },
//   { code: "CSC204", title: "COMPUTER NETWORKS" },
//   { code: "CSC205", title: "SOFTWARE ENGINEERING" },
//   {
//     code: "CSC211",
//     title: "COMPUTER ORGANIZATION AND ASSEMBLY LANGUAGE",
//   },
//   { code: "CSC251", title: "WEB TECHNOLOGIES" },
//   { code: "CSC252", title: "ADVANCED PROGRAMMING" },
//   { code: "CSC301", title: "OPERATING SYSTEMS" },
//   { code: "CSC302", title: "THEORY OF AUTOMATA" },
//   { code: "CSC303", title: "ADVANCE DATABASE MANAGEMENT SYSTEMS" },
//   { code: "CSC311", title: "COMPUTER ARCHITECTURE" },
//   { code: "CSC313", title: "HCI & COMPUTER GRAPHICS" },
//   { code: "CSE320", title: "SOFTWARE DESIGN & ARCHITECTURE" },
//   { code: "CSE324", title: "SOFTWARE REQUIREMENT ENGINEERING" },
//   { code: "ELE401", title: "BASIC ELECTRONICS" },
//   { code: "ENG101", title: "ENGLISH COMPOSITION & COMPREHENSION" },
//   { code: "ENG102", title: "FUNCTIONAL ENGLISH" },
//   { code: "ENG201", title: "EXPOSITORY WRITING" },
//   { code: "ENG305", title: "ENGLISH COMPREHENSION" },
//   { code: "ENG315", title: "TECHNICAL AND BUSINESS WRITING" },
//   { code: "ENG325", title: "COMMUNICATION AND PRESENTATION SKILLS" },
//   { code: "IS201", title: "ISLAMIC STUDIES" },
//   { code: "IS302", title: "ISLAMIC STUDIES" },
//   { code: "MGT322", title: "FINANCIAL ACCOUNTING" },
//   { code: "MGT351", title: "INTRODUCTION TO MARKETING" },
//   { code: "MGT411", title: "INTRODUCTION TO MANAGEMENT" },
//   {
//     code: "MGT515",
//     title: "INTRODUCTION TO HUMAN RESOURCE MANAGEMENT",
//   },
//   { code: "MTH001", title: "PRE-CALCULUS I" },
//   { code: "MTH002", title: "PRE-CALCULUS II" },
//   { code: "MTH101", title: "CALCULUS AND ANALYTIC GEOMETRY" },
//   { code: "MTH102", title: "MULTIVARIABLE CALCULUS" },
//   { code: "MTH103", title: "LINEAR ALGEBRA" },
//   { code: "MTH201", title: "PRE-CALCULUS-I" },
//   { code: "MTH202", title: "PRE CALCULUS-II" },
//   { code: "MTH310", title: "CALCULUS AND ANALYTIC GEOMETRY" },
//   { code: "MTH315", title: "MULTIVARIABLE CALCULUS" },
//   { code: "MTH335", title: "MULTIVARIABLE CALCULUS" },
//   { code: "MTH415", title: "DIFFERENTIAL EQUATIONS" },
//   { code: "MTH435", title: "LINEAR ALGEBRA" },
//   { code: "PHY101", title: "APPLIED PHYSICS" },
//   { code: "SSH302", title: "PAKISTAN STUDIES" },
//   { code: "SSH307", title: "PROFESSIONAL PRACTICES" },
//   { code: "STT101", title: "PROBABILITY & STATISTICS" },
//   { code: "STT500", title: "STATISTICS AND PROBABILITY" },
//   { code: "TOQ101", title: "TRANSLATION OF QURAN-I" },
//   { code: "TOQ102", title: "TRANSLATION OF QURAN II" },
//   { code: "TOQ301", title: "TRANSLATION OF QURAN" },
//   { code: "TOQ401", title: "TRANSLATION OF QURAN" },
//   { code: "TOQ402", title: "TRANSLATION OF QURAN-II" },
//   { code: "TOQ501", title: "TRANSLATION OF QURAN" },
//   { code: "TQA301", title: "TRANSLATION OF QURAN" },
// ]);

// await Slots.insertMany([
//   // 7C
//   // monday
//   {
//     cousre: tbw,
//     instructors: ["67573f6611a71256e4e32d5f"],
//     venue: "LAB-11",
//     start_time: "8:30AM",
//     end_time: "9:30AM",
//   },
//   {
//     cousre: cc,
//     instructors: ["67573f6611a71256e4e32d60"],
//     venue: "LT-2",
//     start_time: "2:00PM",
//     end_time: "3:00PM",
//   },
//   {
//     cousre: cc,
//     instructors: ["67573f6611a71256e4e32d60"],
//     venue: "LAB-7",
//     start_time: "4:00PM",
//     end_time: "5:00PM",
//   },

//   // wednesday
//   {
//     cousre: tbw,
//     instructors: ["67573f6611a71256e4e32d5f"],
//     venue: "LT-2",
//     start_time: "9:30AM",
//     end_time: "10:30AM",
//   },

//   // Thursday
//   {
//     cousre: tbw,
//     instructors: ["67573f6611a71256e4e32d5f"],
//     venue: "LAB-11",
//     start_time: "8:30AM",
//     end_time: "9:30AM",
//   },
//   {
//     cousre: cc,
//     instructors: ["67574c458542cc4835b614cf"],
//     venue: "LAB-9",
//     start_time: "8:30AM",
//     end_time: "9:30AM",
//   },
//   {
//     cousre: toq3,
//     instructors: ["67573f6611a71256e4e32d61"],
//     venue: "LT-12",
//     start_time: "8:30AM",
//     end_time: "9:30AM",
//   },
//   // Friday

//   {
//     cousre: cc,
//     instructors: ["67573f6611a71256e4e32d60"],
//     venue: "LT-7",
//     start_time: "9:30AM",
//     end_time: "10:30AM",
//   },
//   {
//     cousre: cc,
//     instructors: ["67573f6611a71256e4e32d60", "67574c458542cc4835b614cf"],
//     venue: "LAB-8",
//     start_time: "10:30AM",
//     end_time: "11:30AM",
//   },
//   // IOS SECTION
//   // Monday
//   {
//     cousre: map,
//     instructors: ["67573f6611a71256e4e32d66"],
//     venue: "LAB-9",
//     start_time: "5:00PM",
//     end_time: "6:00PM",
//   },
//   // Wedensday
//   {
//     cousre: map,
//     instructors: ["6754a9268db89992d5b82224"],
//     venue: "LAB-3",
//     start_time: "4:00PM",
//     end_time: "5:00PM",
//   },
//   {
//     cousre: map,
//     instructors: ["6754a9268db89992d5b82224"],
//     venue: "LAB-3",
//     start_time: "5:00PM",
//     end_time: "6:00PM",
//   },

//   // Friday
//   {
//     cousre: map,
//     instructors: ["6754a9268db89992d5b82224"],
//     venue: "LAB-3",
//     start_time: "11:30AM",
//     end_time: "12:30PM",
//   },
//   {
//     cousre: map,
//     instructors: ["6754a9268db89992d5b82224", "67573f6611a71256e4e32d66"],
//     venue: "LAB-3",
//     start_time: "12:30PM",
//     end_time: "1:30PM",
//   },
// ]);

// await TimeTable.insertMany([
//   {
//     section: "671fca9828d6e955a5ecdbb0", // 7C
//     slots: {
//       monday: [
//         "67574e9993bed7e59c4d9f4d",
//         "67574e9993bed7e59c4d9f4e",
//         "67574e9993bed7e59c4d9f4f",
//       ],
//       wednesday: ["67574e9993bed7e59c4d9f50"],
//       thursday: [
//         "67574e9993bed7e59c4d9f51",
//         "67574e9993bed7e59c4d9f52",
//         "67574e9993bed7e59c4d9f53",
//       ],
//       friday: ["67574e9993bed7e59c4d9f54", "67574e9993bed7e59c4d9f55"],
//     },
//   },
//   {
//     section: "671fca9828d6e955a5ecdbb4", // IOS
//     slots: {
//       monday: ["67574e9993bed7e59c4d9f56"],
//       wednesday: ["67574e9993bed7e59c4d9f57", "67574e9993bed7e59c4d9f58"],
//       friday: ["67574e9993bed7e59c4d9f59", "67574e9993bed7e59c4d9f5a"],
//     },
//   },
// ]);

// let enrollments = await Enrollment.find({session: ""})

// console.log(await getStudentSections("6754a9268db89992d5b8221e"))

// let group = await PostGroups.findById(gId);
// console.log(await postgroupController.getGroup('67589273249c63d277b41a53', '6754a9268db89992d5b82222'));

// let chats = await Users.findOne().populate('activeChats')

// console.log(await chats.activeChats[0].getChatHead(myId).populate('chatInfo'))

// let msg = new Messages({
//   senderId: myId,
//   content: "🤣",
// });
// await Chats.findByIdAndUpdate("675c95af52ec11f80a0b8a0c", {
//   $addToSet: { messages: msg },
// });

// let c = await Chats.findOne()
// c.messages.addToSet()

// console.log()

// console.log((await Messages.findOne()))

// let chat = await Chats.findById("675c95af52ec11f80a0b8a0c")
//   .select("messages")
//   .populate({
//     path: "messages",
//     select: "content attachment readBy senderId isRead",
//     options: { virtuals: true },
//   });

// console.log(chat);
// let uid = "6754a9268db89992d5b8221e";
// let userChats = await Users.findById(uid)
//   .select("activeChats groupChats")
//   .populate([
//     {
//       path: "activeChats",
//       select: "participants messages.0 totalParticipants",
//       options: { sort: { updatedAt: -1 } },
//       populate: [
//         {
//           path: "participants",
//           select: "name imgUrl",
//           match: { _id: { $ne: uid } }, // Gets the "other" user
//         },
//         {
//           path: "messages",
//           select: "content senderId createdAt -_id",
//           options: { $slice: -1 },
//         },
//       ],
//     },
//     {
//       path: "groupChats",
//       select: "name imgUrl chat",
//       populate: {
//         path: "chat",
//         select: "type",
//         populate: {
//           path: "messages",
//           select: "content senderId createdAt -_id",
//         },
//       },
//     },
//   ]);

// let c = await Chats.findById("675c95af52ec11f80a0b8a0c")
//   .select("messages")
//   .populate({
//     path: "messages",
//     options: { $slice: -1 },
//   });
// let userDetails = await Users.findById("6754a9268db89992d5b8221e")
//   .select("activeChats groupChats -_id")
//   .populate({
//     path: "groupChats",
//     select: "chat name imgUrl",
//   });

// let groupChats = userDetails.groupChats.map((e) => e.chat);
// // console.log(userDetails);
// let chats = await Chats.find(
//   { _id: [...groupChats, ...userDetails.activeChats] },
//   {
//     isGroup: 1,
//     totalParticipants: 1,
//     participants: {
//       $elemMatch: { $ne: "6754a9268db89992d5b8221e" },
//     },
//     messages: { $slice: -1 },
//   },
//   { sort: { updatedAt: -1 } }
// ).populate([
//   {
//     path: "messages",
//     select: "content senderId createdAt -_id",
//   },
//   {
//     path: "participants",
//     select: "name imgUrl",
//   },
// ]);

// let transformedChats = await Promise.all(
//   chats.map(async (e) => {
//     let chatInfo = {
//       _id: e.participants[0]._id,
//       name: e.participants[0].name,
//       imgUrl: e.participants[0].imgUrl,
//     };
//     if (e.isGroup) {
//       console.log("is group")
//       let chatGroupDetails = userDetails.groupChats.filter((i) => i.chat.toString() == e._id.toString())[0];
//       chatInfo = {
//         _id: chatGroupDetails._id,
//         name: chatGroupDetails.name,
//         imgUrl: chatGroupDetails.imgUrl,
//       };
//     }

//     return {
//       id: e._id,
//       chatInfo,
//       totalParticipants: e.totalParticipants,
//       isGroup: e.isGroup,
//       lastMessage: e.messages[0] ?? {
//         senderId: "",
//         content: "",
//         createdAt: "",
//       },
//       newMessageCount: await getNewMessageCount(
//         e.messages[0],
//         "6754a9268db89992d5b8221e",
//         e._id
//       ),
//     };
//   })
// );

// await VipCollections.insertMany([
//   {
//     creator: myId,
//     people: [id2],
//     collectName: "Collection 1",
//   },
// ]);

// let x = new Schema({
//   date: Date
// })

// let xModel = model("xm", x)

// let mod = new xModel({
//   date: Date.now()
// })

// console.log(mod)

// await Enrollment.insertMany([
//   {
//     student: myId,
//     session: currSession,
//     section: "671fca9828d6e955a5ecdbb0",
//     course: "679297d437b7de5dc9a4b1a0" // tbw
//   },
//   {
//     student: myId,
//     session: currSession,
//     section: "671fca9828d6e955a5ecdbb0",
//     course: "679298573c3423980afda7a6" // cc
//   },
//   {
//     student: myId,
//     session: currSession,
//     section: "671fca9828d6e955a5ecdbb0",
//     course: "679298c33c3423980afda7a7" // TOQ
//   },
//   {
//     student: myId,
//     session: currSession,
//     section: "671fca9828d6e955a5ecdbb4",
//     course: "679297d437b7de5dc9a4b15e" // map
//   }
// ])

// let userChats = await Users.findById(myId)
//   .select("activeChats groupChats -_id")
//   .populate({
//     path: "groupChats",
//     select: "chat name imgUrl",
//   });
// let groupChats = userChats.groupChats.map((e) => e.chat);
// let chats = await Chats.find(
//   { _id: [...groupChats, ...userChats.activeChats] },
//   {
//     isGroup: 1,
//     totalParticipants: 1,
//     participants: {
//       $elemMatch: { $ne: myId },
//     },
//     messages: { $slice: -1 },
//   },
//   { sort: { updatedAt: -1 } }
// ).populate([
//   {
//     path: "messages",

//     select: {
//       content: 1,
//       senderId: 1,
//       createdAt: 1,
//       _id: 0,
//       attachments: 1,
//     },
//   },
//   {
//     path: "participants",
//     select: "name imgUrl",
//   },
// ]);


// let transformedChats = await Promise.all(
//   chats.map(async (e) => {
//     console.log("CHECKING " + e._id)
//     let chatInfo = {
//       _id: e.participants[0]?._id ?? "",
//       name: e.participants[0]?.name ?? "",
//       imgUrl: e.participants[0]?.imgUrl ?? "",
//     };
//     if (e.isGroup) {
//       let chatGroupDetails = userChats.groupChats.filter(
//         (i) => i.chat.toString() == e._id.toString()
//       )[0];
//       chatInfo = {
//         _id: chatGroupDetails._id,
//         name: chatGroupDetails.name,
//         imgUrl: chatGroupDetails.imgUrl,
//       };
//     }

//     return {
//       id: e._id,
//       chatInfo,
//       totalParticipants: e.totalParticipants,
//       isGroup: e.isGroup,
//       lastMessage: e.messages[0] ?? {
//         senderId: "",
//         content: "",
//         createdAt: "",
//         attachments: [],
//       },
//       // newMessageCount: await getNewMessageCount(e.messages[0], uid, e._id),
//     };
//   })
// );



// let cCode = "CSC312";
// let tt = await TimeTable.find({
//   section: "671fca9828d6e955a5ecdbb0", $or: [
//     { "slots.monday.course": cCode }
//   ]
// })

// let enrol = await Enrollment.aggregate([
//   {
//     $match: { student: new Types.ObjectId(myId) },
//   },
//   {
//     $group: { _id: "$section", courses: { $addToSet: "$course" } }
//   }
// ])

let sectionKeys = {
  '671fca9828d6e955a5ecdbb0': ['TOQ201', 'ENG401', 'CS636'],
  '676de49c84c54a58fa7a78d4': ['CSC103'],
  '671fca9828d6e955a5ecdbb4': ['CS693']
}

let enrol = Object.keys(sectionKeys)
// enrol.map(e => (sectionKeys = { ...sectionKeys, [e._id]: e.courses }))
// console.log(sectionKeys)




// let tts = await TimeTable.aggregate([
//   {
//     $match: { section: new Types.ObjectId(section1._id) }
//   },
//   {
//     $lookup: {
//       from: "courses",
//       localField: "slots.monday.course",
//       foreignField: "_id",
//       as: "course"
//     }
//   }

//   // {
//   //   $project: {
//   //     _id: 1,
//   //     session: 1,
//   //     section: 1,
//   //     "slots.monday": {
//   //       $filter: {
//   //         input: "$slots.monday",
//   //         as: "slot",
//   //         cond: {
//   //           $anyElementTrue: {
//   //             $setIntersection: [section1.courses, "$$slot.courseMap"]
//   //           }
//   //         }
//   //       }
//   //     },
//   //     "slots.tuesday": {
//   //       $filter: {
//   //         input: "$slots.tuesday",
//   //         as: "slot",
//   //         cond: {
//   //           $anyElementTrue: {
//   //             $setIntersection: [section1.courses, "$$slot.courseMap"]
//   //           }
//   //         }
//   //       }
//   //     },
//   //     "slots.wednesday": {
//   //       $filter: {
//   //         input: "$slots.wednesday",
//   //         as: "slot",
//   //         cond: {
//   //           $anyElementTrue: {
//   //             $setIntersection: [section1.courses, "$$slot.courseMap"]
//   //           }
//   //         }
//   //       }
//   //     },
//   //     "slots.thursday": {
//   //       $filter: {
//   //         input: "$slots.thursday",
//   //         as: "slot",
//   //         cond: {
//   //           $anyElementTrue: {
//   //             $setIntersection: [section1.courses, "$$slot.courseMap"]
//   //           }
//   //         }
//   //       }
//   //     },
//   //     "slots.friday": {
//   //       $filter: {
//   //         input: "$slots.friday",
//   //         as: "slot",
//   //         cond: {
//   //           $anyElementTrue: {
//   //             $setIntersection: [section1.courses, "$$slot.courseMap"]
//   //           }
//   //         }
//   //       }
//   //     },
//   //   }
//   // }
// ])

// let tts = await TimeTable.find({ section: enrol.map(e => e._id) }).populate({
//   path: "slots.monday slots.tuesday slots.wednesday slots.thursday slots.friday",
//   options: { sort: { start_time: 1 } },
//   populate: [{ path: "course", model: "course", select: "title" }],
// });


// let pipelines = enrol.map(e => ({
//   $and: [
//     { section: e._id },//.map(e => e._id),
//     {
//       $or: [
//         { "slots.monday.course": e.courses },
//         { "slots.tuesday.course": e.courses },
//         { "slots.wednesday.course": e.courses },
//         { "slots.thursday.course": e.courses },
//         { "slots.friday.course": e.courses },
//       ]
//     }
//   ],
// }))

// console.log(JSON.stringify(pipelines, null, 2))
// let tts = await TimeTable.find({
//   // $or: [
//   //   ...pipelines
//   // ]
//   section: enrol.map(e => e._id)
// }).populate({
//   path: "slots.monday slots.tuesday slots.wednesday slots.thursday slots.friday",
//   options: { sort: { start_time: 1 } },
//   populate: [{ path: "course", model: "course", select: "title" }],
// })

// let tts = await TimeTable.find({
//   section: enrol//enrol.map(e => e._id)
// }).populate({
//   path: "slots.monday slots.tuesday slots.wednesday slots.thursday slots.friday",
//   populate: [{ path: "course", model: "course", select: "title" }],
// }).lean()

// function intersection(arr1, arr2) {
//   return (arr1.filter(item => arr2.includes(item))).length > 0;
// }

// let timetablex = tts.map(e => {
//   return {
//     ...e, slots: {
//       monday: e.slots.monday.filter(s => intersection(s.courseMap, sectionKeys[e.section])),
//       tuesday: e.slots.tuesday.filter(s => intersection(s.courseMap, sectionKeys[e.section])),
//       wednesday: e.slots.wednesday.filter(s => intersection(s.courseMap, sectionKeys[e.section])),
//       thursday: e.slots.thursday.filter(s => intersection(s.courseMap, sectionKeys[e.section])),
//       friday: e.slots.friday.filter(s => intersection(s.courseMap, sectionKeys[e.section]))
//     }
//   }
// })

// const mergedSlots = {
//   monday: [],
//   tuesday: [],
//   wednesday: [],
//   thursday: [],
//   friday: [],
// };
// timetablex.forEach((table) => {
//   Object.keys(table.slots).forEach((day) => {
//     mergedSlots[day] = mergedSlots[day].concat(table.slots[day]);
//   });
// });
// console.log(mergedSlots.monday.map(e => (e.start_time)).sort((a, b) => a - b))
// console.log(JSON.stringify(timetablex, null, 2))

// writeFile("tt.json", JSON.stringify(mergedSlots, null, 2), (err) => { })


// await Users.updateMany({}, { $unset: { autoReply: "" } });
// console.log(await Users.updateMany({}, { $unset: { autoReply: "" } }, { strict: false }))

await Users.updateMany(
  { alertsOn: { $exists: false } },
  { $set: { alertsOn: false } }
);

await Users.updateMany(
  { favorites: { $exists: false } },
  { $set: { favorites: [] } }
);

await Users.updateMany(
  { birthdayReactions: { $exists: false } },
  { $set: { birthdayReactions: [] } }
);

await Users.updateMany(
  { aniversaryReactions: { $exists: false } },
  { $set: { aniversaryReactions: [] } }
);

const nowDate = new Date(Date.now());
const dateWithoutTime = new Date(
  `${nowDate.getDate()}-${nowDate.getMonth()}-${nowDate.getFullYear()}`
);

await Users.find({ dob: { $gte: dateWithoutTime } });
await Users.updateMany(
  { aniv_date: { $exists: false } },
  {
    $set: {
      aniv_date: 0,
      aniv_month: 0,
      aniv_year: 0
    }
  }
);

console.log(await ChatSettings.updateMany({}, { autoReply: true }))
db.disconnect();
