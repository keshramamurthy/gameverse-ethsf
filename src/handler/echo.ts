import { HandlerContext } from "@xmtp/message-kit";
import { client } from "../index.js"; // Assuming client is exported from index.ts

export async function handler(context: HandlerContext) {
  // Prompt the user to type something
  await context.send("Please type something, and I will echo it back to you!");

  // Define a filter to capture the message from the same user who issued the command
  const filter = (msg: HandlerContext) => msg.message.sender.address.toLowerCase() === context.message.sender.address.toLowerCase();

  try {
    // Await the user's message using the awaitMessages method
    const collectedMessages = await client.awaitMessages(filter, { max: 1, time: 30000 }); // Waits for up to 30 seconds

    if (collectedMessages.length) {
      // Send the echoed message back to the user
      const userMessage = collectedMessages[0].message.content.content;
      await context.send(`You said: ${userMessage}`);
    } else {
      await context.send("You didn't say anything in time! Please try again.");
    }
  } catch (error) {
    console.error(error);
    await context.send("An error occurred while waiting for your message.");
  }
}