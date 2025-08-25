import { model, Types, Schema } from "mongoose";
import { writeFile } from "fs";
import { connectDB } from "./database/db.js";
import pkg from "xlsx";
const { readFile, utils } = pkg;
import {
  Chats,
  Courses,
  Enrollment,
  Messages,
  PostGroups,
  PostInteraction,
  Posts,
} from "./database/models/models.js";
import { getCoursesMapping, getCurrentSessionId } from "./utils/utils.js";
import chatController from "./controllers/chatController.js";

let myId = "6754a9268db89992d5b8221e";
let bitId = "6797ebcc37200dbcdec36ba9";
let db = await connectDB();

// let file = readFile("datesheet.xls"); // TODO: Add the dot.
// let session = await getCurrentSessionId();
// let sheetNames = file.SheetNames;
// for (let i = 0; i < sheetNames.length; i++) {
//     let currSheet = sheetNames[i];
//     let x = utils.sheet_to_json(file.Sheets[currSheet], { header: "A" });
// }
// const codeRegex = /\b[A-Z]{2,3}-?\d{3}\b/;
// let dateSheet = {};
// for (let i = 0; i < sheetNames.length; i++) {
//   let currSheet = sheetNames[i];
//   let x = utils.sheet_to_json(file.Sheets[currSheet], { header: "A" });
//   writeFile(currSheet + ".json", JSON.stringify(x, null, 2), (err) => { })
//   let examType = x[1]["A"].trim().split(" ")[0];
//   let time = x[2]["A"].trim();

//   // Datehseet starts from index 5

//   for (let j = 5; j < x.length; j++) {
//     let data = x[j];
//     let day = data["A"];
//     let date = data["B"];

//     let keys = Object.keys(data).filter((i) => i != "A" && i != "B");

//     await Promise.all(
//       keys.map(async (key) => {
//         const codeMatch = data[key].match(codeRegex);
//         if (codeMatch) {
//           let code = codeMatch[0].trim().split("-").join("");
//           console.log("Code = " + code);
//           // // dateSheet.push();
//           // if (!Object.keys(dateSheet).includes(code)) {
//           //   console.log(code + " Is not in")
//           //   dateSheet = {
//           //     ...dateSheet, [code]: {
//           //       session,
//           //       type: examType.toLowerCase(),
//           //       course_id: await getCoursesMapping(code),
//           //       day: day,
//           //       date: date,
//           //     }
//           //   }
//           // } else {
//           //   console.log(code + " Is already in ");
//           // }
//         }
//       })
//     );

//   }

// }

// await chatController.readMessages("6797d748a488f06816b02dc0", myId, 3);

let x = [
  new Types.ObjectId("6812a4d04aaa988f9e763a7f"),
  new Types.ObjectId("6813b4919d87458e9ff17b33"),
  new Types.ObjectId("6813b6ad9d87458e9ff17b37"),
];

console.log(await Messages.find({ _id: x }));
await db.disconnect();
