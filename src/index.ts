import { run, HandlerContext, CommandGroup, CommandHandler } from "@xmtp/message-kit";
import { BaseClient, Command } from "./types/BaseClient.js";
import { commands } from "./commands.js";
import { Collection } from "@discordjs/collection";
import Enmap from "enmap";
import { UserData } from "./types/UserData.js";
import cron from "node-cron";
import express, { Request, Response } from 'express';
import { batchUpdateBalances } from "./util/UpdateBalances.js";


cron.schedule('0 * * * *', async () => {
  console.log('Running scheduled balance update...');
  await batchUpdateBalances();
});

const client = new BaseClient();

const userData = new Enmap<string, UserData>({
  name: "userData",
  fetchAll: true,
  autoFetch: true
});

client.on("message", context => {
  console.log(context.message.content.content);
})

client.registerCommands(commands);

// Main function to run the app
run(async (context: HandlerContext) => {
  const {
    message: { typeId },
  } = context;
  console.log(typeId);
  switch (typeId) {
    case "text":
      handleTextMessage(context);
      break;
  }
});

async function handleTextMessage(context: HandlerContext) {
  client.emit("message", context);
  const {
    content: { content: text },
  } = context.message;
  // if (text.includes("/help")) {
  //   await helpHandler(context);
  // } else {
    const args = text.slice(1).split(/ +/);
    const commandName: string = args.shift().toLowerCase();


    if (!client.commands.has(commandName) && !commands
      .some(r => r.triggers
        .some(alias => alias.toLowerCase() === `/${commandName}`))) return;


    const command = client.commands.get(commandName) || client.commands.find(r => r.triggers.some(alias => alias.toLowerCase() === `/${commandName}`)) as Command;

    if (!client.cooldowns.has(command.name)) {
      client.cooldowns.set(command.name, new Collection());
    }

    if (command.adminOnly && context.message.sender.address != "0x923d324BEdB1c339c9D77D55D4c9b0Ab1b1F846A") {
      return;
    }

    const now = Date.now();
    const timestamps = client.cooldowns.get(command.name) as Collection<string, number>;
    const cooldownAmount = (command.cooldown || 3) * 1000;
    if (timestamps?.has(context.message.sender.address)) {
      const lastUse = timestamps.get(context.message.sender.address) as number;
      const expirationTime = lastUse + cooldownAmount;
      if (now < expirationTime) {
        const timeLeft = (expirationTime - now) / 1000;
        return context.send(`❌ You cannot use that command for ${timeLeft.toFixed(1)} more seconds.`);
      }
    }
    timestamps.set(context.message.sender.address, now);
    setTimeout(() => timestamps.delete(context.message.sender.address), cooldownAmount);

    try {
      const func = command?.commands[0].handler as CommandHandler;
      func(context);
    } catch (e) {
      console.error(e);
    }
  // }
}

async function helpHandler(context: HandlerContext) {
  const { commands = [] } = context;
  const intro =
    "Available experiences:\n" +
    commands
      .flatMap((app) => app.commands)
      .map((command) => `${command.command} - ${command.description}`)
      .join("\n") +
    "\nUse these commands to interact with specific apps.";
  context.send(intro);
}

const app = express();
const port = 4000;

app.use(express.json());

app.get('/user/:address', (req: Request, res: Response) => {
  const address = req.params.address;
  
  if (userData.has(address)) {
    const user: UserData = userData.get(address) as UserData;
    res.json(user);
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

app.post('/user/:address/update', (req: Request, res: Response) => {
  const address = req.params.address;
  const { balance }: { balance: number } = req.body;

  if (userData.has(address)) {
    const user: UserData = userData.get(address) as UserData;
    user.balance = balance;
    userData.set(address, user);
    res.json({ success: true, balance });
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

app.listen(port, () => {
  console.log(`Chatbot API is running on http://localhost:${port}`);
});

export { client, userData }