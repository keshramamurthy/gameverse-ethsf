import { HandlerContext, User } from "@xmtp/message-kit";
import { userData } from "../index.js";
import { UserData } from "../types/UserData.js";

export async function handler(context: HandlerContext) {
    const {
        members,
        getMessageById,
        message: { content, sender, typeId },
    } = context;

    const args = content.content.slice(1).split(/ +/);
    const commandName = args.shift().toLowerCase();

    const recipient = args[0].toLowerCase();
    const amount = parseInt(args[1]);

    if (args.length < 2 || isNaN(amount)) {
        return context.send(`Invalid usage! Please provide a valid user and amount of tokens to transfer. Example: /transfer @user 100`);
    }
 
    if (!userData.has(sender.address.toLowerCase())) {
        userData.set(sender.address.toLowerCase(), {
            balance: 0,
            address: sender.address.toLowerCase()
        });
        return context.send(`You don't have an account yet! Your balance has been set to 0. Try earning some tokens first!`);
    }

    const senderData = userData.get(sender.address.toLowerCase()) as UserData;

    if (senderData.balance < amount) {
        return context.send(`You don't have enough tokens! Your balance is ${senderData.balance} ❖.`);
    }

    if (!userData.has(recipient)) {
        userData.set(recipient, {
            balance: 0,
            address: recipient
        });
    }

    const recipientData = userData.get(recipient) as UserData;

    senderData.balance -= amount;
    recipientData.balance += amount;

    userData.set(sender.address.toLowerCase(), senderData);
    userData.set(recipient, recipientData);

    const frame_url = process.env.FRAMES_URL;
    return context.send(`${frame_url}/transfer?coins=${amount}`);
    return context.send(`Successfully transferred ${amount} ❖ to ${recipient}. Your new balance is ${senderData.balance} ❖.`);
}