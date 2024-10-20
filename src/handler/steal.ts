import { HandlerContext, User } from "@xmtp/message-kit";
import { userData } from "../index.js";
import { UserData } from "../types/UserData.js";

export async function handler(context: HandlerContext) {
  const {
    message: { content, sender },
  } = context;

  const args = content.content.slice(1).split(/ +/);
  const target = args[1].toLowerCase();

  if (!target) {
    return context.send("Please specify a user to steal from.");
  }

  if (!userData.has(sender.address.toLowerCase()) || userData.get(sender.address.toLowerCase())?.balance as number < 500) {
    userData.set(sender.address.toLowerCase(), {
      balance: 0,
      address: sender.address.toLowerCase()
    });
    return context.send("You need to have at least 500 coins before you try stealing from someone else!");
  }

  if (!userData.has(target)) {
    return context.send("The target user does not have an account.");
  }

  const thief = userData.get(sender.address.toLowerCase()) as UserData;
  const victim = userData.get(target) as UserData;

  const randomChance = Math.random();

  if (randomChance < 0.5) {
    const stolenAmount = Math.floor(victim.balance * 0.2);
    if (stolenAmount <= 0) {
      return context.send("The target user has no coins to steal.");
    }
    victim.balance -= stolenAmount;
    thief.balance += stolenAmount;

    userData.set(sender.address.toLowerCase(), thief);
    userData.set(target, victim);

    const frame_url = process.env.FRAMES_URL;
    return context.send(`${frame_url}/steal?coins=${stolenAmount}&success=true`);
    return context.send(`You successfully stole ${stolenAmount} ❖ from ${target}. Your new balance is ${thief.balance} ❖.`);
  } else {
    const lossAmount = Math.floor(thief.balance * 0.1);
    thief.balance -= lossAmount;
    userData.set(sender.address.toLowerCase(), thief);

    const frame_url = process.env.FRAMES_URL;
    return context.send(`${frame_url}/steal?coins=${lossAmount}&success=false`);
    return context.send(`You were caught and lost ${lossAmount} ❖. Your new balance is ${thief.balance} ❖.`);
  }
}