import { CronJob } from "cron";
import { findMessagesWithConfirmationDueSoon } from "./utils/utils.js";
import { isOnline, notifyUser } from "./socket.js";
import { PendingConfirmations } from "./database/models/models.js";

CronJob.from({
    cronTime: "* * * * *",
    onTick: async () => {
        const pendings = [];
        const userUpdates = {};
        const messages = await findMessagesWithConfirmationDueSoon();
        console.log("Messages => ", messages);
        if (messages.length < 0) return;

        for (let message of messages) {
            const userId = message.sender.toString();

            if (!userUpdates[userId]) userUpdates[userId] = 0;
            userUpdates[userId] += 1;

            const obj = {
                uid: userId,
                scheduledMessageId: message._id,
            };

            pendings.push({
                updateOne: {
                    filter: { uid: userId, scheduledMessageId: obj.scheduledMessageId },
                    update: { $setOnInsert: obj },
                    upsert: true,
                },
            });
        }
        console.log("Pendings = ", pendings);
        console.log("now count  = ", userUpdates);
        notifyUsers(userUpdates);
        await PendingConfirmations.bulkWrite(pendings, { ordered: false });
    },
}).start();

console.log("Confirmation JOBS Started");

const notifyUsers = (updates) => {
    Object.keys(updates).forEach((key) => {
        notifyUser(key, updates[key]);
    });
};