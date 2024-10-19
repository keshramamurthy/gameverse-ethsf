import { HandlerContext, User } from "@xmtp/message-kit";
import { userData } from "../index.js";

export async function handler(context: HandlerContext) {
    const {
        members,
        getMessageById,
        message: { content, sender, typeId },
    } = context;

    const args = content.content.slice(1).split(/ +/);
    args.shift();

    console.log(sender.address.toLowerCase());

    if (!args[0]) {
        if (!userData.has(sender.address.toLowerCase())) {
            userData.set(sender.address.toLowerCase(), {
                balance: 0,
                address: sender.address.toLowerCase()
            });
        }
    
        const data = userData.get(sender.address.toLowerCase());
    
        return context.send(`You have ${data?.balance} ❖.`);
    } else {
        const data = userData.get(args[0]);

        if (!data) {
            return context.send("That user is not on Gameverse yet! You should send them a message and get them in!");
        } else {
            return context.send(`That user has ${data?.balance} ❖.`);
        }
    }
}