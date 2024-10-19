import type { CommandGroup } from "@xmtp/message-kit";
import { handler as balance } from "./handler/balance.js";
import { handler as transfer } from "./handler/transfer.js";
import { handler as search } from "./handler/search.js";
import { handler as echo } from "./handler/echo.js";
import { handler as help } from "./handler/help.js"
import { handler as steal } from "./handler/steal.js";
import { handler as gamble } from "./handler/gamble.js";
import { handler as leaderboard } from "./handler/leaderboard.js";
import { handler as trivia } from "./handler/trivia.js";
import { Command } from "./types/BaseClient.js";



export const commands: Command[] = [
  {
    name: "Tipping",
    description: "Tip tokens via emoji, replies or command.",
    triggers: ["/tip", "🎩", "@tip"],
    cooldown: 0,
    adminOnly: false,
    commands: [
      {
        command: "/tip [@users] [amount] [token]",
        description: "Tip users in a specified token.",
        handler: undefined,
        params: {
          username: {
            default: "",
            type: "username",
          },
          amount: {
            default: 10,
            type: "number",
          },
        },
      },
    ],
  },
  {
    name: "Balance",
    description: "Check your or another user's balance.",
    triggers: ["/bal", "/balance", "@bal", "@balance"],
    cooldown: 3,
    adminOnly: false,
    commands: [
      {
        command: "/bal [@useraddress]",
        description: "Check your or another user's balance.",
        handler: balance,
        params: {
          username: {
            default: "",
            type: "address"
          }
        }
      }
    ]
  },
  {
    name: "Transfer",
    description: "Transfer coins to another user.",
    triggers: ["/transfer", "@transfer"],
    cooldown: 5, // Slightly higher cooldown due to potential frequent use
    adminOnly: false,
    commands: [
      {
        command: "/transfer @useraddress amount",
        description: "Transfer a specified amount of coins to another user.",
        handler: transfer, // The handler function you created
        params: {
          useraddress: {
            default: "",
            type: "address" // Expected input is the address of the recipient
          },
          amount: {
            default: 0,
            type: "number" // Expected input is the number of coins to transfer
          }
        }
      }
    ]
  },
  {
    name: "Search",
    description: "Search for coins and potentially earn a random amount.",
    triggers: ["/search", "@search"],
    cooldown: 1800, // Longer cooldown as it's a reward command
    adminOnly: false,
    commands: [
      {
        command: "/search",
        description: "Search for coins and possibly find between 500-1000 coins, with a small chance to get nothing.",
        handler: search, // The handler function you created
        params: {}
      }
    ]
  },
  {
    name: "Echo",
    description: "Echo back whatever the user types after being prompted.",
    triggers: ["/echo", "@echo"],
    cooldown: 5, // Short cooldown since it's just a simple echo
    adminOnly: false,
    commands: [
      {
        command: "/echo",
        description: "Prompt the user to type something, then echo it back.",
        handler: echo, // The handler function
        params: {}
      }
    ]
  },
  {
    name: "Help",
    description: "Provides a list of all commands or detailed info about a specific command.",
    triggers: ["/help", "@help"],
    cooldown: 3, // Short cooldown as it's informational
    adminOnly: false,
    commands: [
      {
        command: "/help [command]",
        description: "Shows a list of all commands or detailed info about a specific command.",
        handler: help, // The handler function we just created
        params: {
          command: {
            default: "",
            type: "string" // Expected input is the command name to get more details
          }
        }
      }
    ]
  },
  {
    name: "Gamble",
    description: "Gamble your coins with a chance to win or lose.",
    triggers: ["/gamble", "@gamble"],
    cooldown: 5,
    adminOnly: false,
    commands: [
      {
        command: "/gamble <amount>",
        description: "Gamble your coins.",
        handler: gamble,
        params: {
          amount: {
            default: 0,
            type: "number"
          }
        }
      }
    ]
  },
  {
    name: "Steal",
    description: "Attempt to steal coins from another user.",
    triggers: ["/steal", "@steal"],
    cooldown: 10,
    adminOnly: false,
    commands: [
      {
        command: "/steal @useraddress",
        description: "Attempt to steal coins from the specified user.",
        handler: steal,
        params: {
          useraddress: {
            default: "",
            type: "address"
          }
        }
      }
    ]
  },
  {
    name: "Leaderboard",
    description: "Shows the top users by balance.",
    triggers: ["/leaderboard", "@leaderboard"],
    cooldown: 5,
    adminOnly: false,
    commands: [
      {
        command: "/leaderboard",
        description: "View the top users by balance.",
        handler: leaderboard,
        params: {}
      }
    ]
  },
  {
    name: "Trivia",
    description: "Participate in a Web3 trivia contest and win coins!",
    triggers: ["/trivia", "@trivia"],
    cooldown: 60, // 1-minute cooldown between trivia games
    adminOnly: false,
    commands: [
      {
        command: "/trivia",
        description: "Start a Web3 trivia contest. Answer A, B, C, or D.",
        handler: trivia, // reference to the trivia command handler
        params: {}
      }
    ]
  }
];
