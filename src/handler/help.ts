import { HandlerContext } from "@xmtp/message-kit";
import { commands } from "../commands.js";

export async function handler(context: HandlerContext) {
    const args = context.message.content.content.slice(1).split(/ +/);
    args.shift(); // Remove the /help part of the command
  
    if (args.length === 0) {
      // If no specific command is requested, send an overview of all commands
      const overview = commands.map(command => {
        const firstTrigger = command.triggers[0]; // Get the first trigger as the main one
        return `${command.name} - ${firstTrigger} - ${command.description}`;
      }).join("\n");
  
      return context.send(`Here are the available commands:\n\n${overview}`);
    } else {
      // If a specific command is requested, find it and provide detailed info
      const commandName = args[0].toLowerCase();
      const command = commands.find(cmd => cmd.triggers.some(trigger => trigger.toLowerCase() === `/${commandName}`));
  
      if (!command) {
        return context.send("Command not found. Use /help to see all available commands.");
      }
  
      const usage = command.commands[0].command; // Get example usage from the command object
      const cooldown = command.cooldown || 3; // Use a default cooldown if none is specified
  
      return context.send(`Command: ${command.name}\nDescription: ${command.description}\nUsage: ${usage}\nCooldown: ${cooldown} seconds`);
    }
  }