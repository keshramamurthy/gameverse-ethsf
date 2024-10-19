// triviaCommand.js
import { Handler, HandlerContext } from "@xmtp/message-kit";
import { web3Trivia } from "../util/TriviaQs.js";
import { client, userData } from "../index.js"; // Import the user data system
import { UserData } from "../types/UserData.js";

export async function handler(context: HandlerContext) {
  const {
    message: { content, sender },
  } = context;

  // Pick a random trivia question
  const randomQuestion = web3Trivia[Math.floor(Math.random() * web3Trivia.length)];

  const questionText = `🧠 Web3 Trivia 🧠\n\n${randomQuestion.question}\nA) ${randomQuestion.options.A}\nB) ${randomQuestion.options.B}\nC) ${randomQuestion.options.C}\nD) ${randomQuestion.options.D}\n\nPlease answer with A, B, C, or D within 30 seconds!`;

  // Send the trivia question to the channel
  await context.send(questionText);

  // Await the user's response using awaitMessages (or MessageCollector)
  const filter = (message: HandlerContext) => ["A", "B", "C", "D"].includes(message.message.content.content.toUpperCase());

  const collectedMessages = await client.awaitMessages(filter, {
    max: 1, // We're waiting for one correct answer or time out
    time: 30000, // 30 seconds timeout
  });

  if (!collectedMessages || collectedMessages.length === 0) {
    await context.send("⏳ Time's up! Nobody answered correctly.");
    return;
  }

  const userAnswer = collectedMessages[0].message.content.content.toUpperCase();
  const responderAddress = collectedMessages[0].message.sender.address;

  // Check if the user's answer is correct
  if (userAnswer === randomQuestion.correctAnswer) {
    // Check if the user has an account
    if (!userData.has(responderAddress)) {
      userData.set(responderAddress, {
        balance: 0,
        address: responderAddress
      });
    }

    // Award the user with random coins (between 500-1000)
    const reward = Math.floor(Math.random() * 501) + 500; // Random amount between 500 and 1000
    const userAccount = userData.get(responderAddress) as UserData;
    userAccount.balance += reward;

    // Update the user's balance in the system
    userData.set(responderAddress, userAccount);

    // Announce the winner
    await context.send(`🎉 Congratulations! ${sender.address} answered correctly and won ${reward} coins! Your new balance is ${userAccount.balance} coins.`);
  } else {
    await context.send("❌ Incorrect answer. Better luck next time!");
  }
}
