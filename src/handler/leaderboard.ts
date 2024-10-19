import { HandlerContext } from "@xmtp/message-kit";
import { userData } from "../index.js";

export async function handler(context: HandlerContext) {
  const users = Array.from(userData.entries()).map(([address, data]) => ({
    address,
    balance: data.balance
  }));

  const sortedUsers = users.sort((a, b) => b.balance - a.balance).slice(0, 10);

  const leaderboardMessage = sortedUsers
    .map((user, index) => `${index + 1}. ${user.address} - ${user.balance} ❖`)
    .join("\n");

  await context.send(`Leaderboard:\n\n${leaderboardMessage}`);
}