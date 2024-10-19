import { HandlerContext } from "@xmtp/message-kit";
import { userData } from "../index.js";
import { UserData } from "../types/UserData.js";

export async function handler(context: HandlerContext) {
  const {
    message: { content, sender },
  } = context;

  const args = content.content.slice(1).split(/ +/);
  const amount = parseInt(args[1]);

  if (!amount || isNaN(amount)) {
    return context.send("Please specify a valid amount of coins to gamble.");
  }

  if (!userData.has(sender.address.toLowerCase())) {
    userData.set(sender.address.toLowerCase(), {
      balance: 0,
      address: sender.address.toLowerCase()
    });
    return context.send("You don't have enough money to gamble yet! Start earning some coins first.");
  }

  const user = userData.get(sender.address.toLowerCase()) as UserData;

  if (user.balance < amount) {
    return context.send("You don't have enough coins to gamble that amount.");
  }

  const randomChance = Math.random();

  if (randomChance < 0.4) {
    // Lose half
    const loss = Math.floor(amount / 2);
    user.balance -= loss;
    userData.set(sender.address.toLowerCase(), user);
    const frame_url = process.env.FRAMES_URL;
    return context.send(`${frame_url}/gamble?coins=${loss}&win=false`);
    // return context.send(`Bad luck! You lost ${loss} coins. Your new balance is ${user.balance} ❖.`);
  } else if (randomChance < 0.75) {
    // Win double
    user.balance += amount;
    userData.set(sender.address.toLowerCase(), user);
    const frame_url = process.env.FRAMES_URL;
    return context.send(`${frame_url}/gamble?coins=${amount}&win=true`);
    // return context.send(`Congrats! You won and doubled your coins. Your new balance is ${user.balance} ❖.`);
  } else if (randomChance < 0.95) {
    // Win half
    const win = Math.floor(amount / 2);
    user.balance += win;
    userData.set(sender.address.toLowerCase(), user);
    const frame_url = process.env.FRAMES_URL;
    return context.send(`${frame_url}/gamble?coins=${win}&win=true`);
    // return context.send(`Not bad! You won ${win} coins. Your new balance is ${user.balance} ❖.`);
  } else {
    // Lose all
    user.balance -= amount;
    userData.set(sender.address.toLowerCase(), user);
    const frame_url = process.env.FRAMES_URL;
    return context.send(`${frame_url}/gamble?coins=${amount}&win=false`);
    return context.send(`Oh no! You lost everything. Your new balance is ${user.balance} ❖.`);
  }
}