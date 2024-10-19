import type { CommandGroup } from "@xmtp/message-kit";
import { handler as balance } from "./handler/balance.js";
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
  }
];
