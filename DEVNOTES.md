## Developer Notes

- The `awaitMessages` method defined in `src/types/BaseClient.ts` and the `MessageCollector` class defined in `src/types/MessageCollector.ts` allow for a simple way of collecting messages from the client, without having to manage step-by-step state handling in memory. A demonstration is available with the `/echo` command.

- The bot uses a custom command handler, inspired by similar chatbot frameworks on other apps such as Telegram and Discord, to enable cooldowns, moderation, admin-only commands and other extensible features that are very useful for development.

- The currency of the bot is an ERC-20 token deployed on SKALE Network, allowing it to be extended and potentially used in other apps for any purpose.

## Developer Feedback

### Converse, MessageKit
- The dev documentation was very helpful, though more info on how Frames can be integrated with the bot (as well as more examples) could be very helpful, as during the implementation of the custom Frames, I ran into some issues with URL parsing & specifically getting frames to display in Converse.

- Frame rendering is buggy on Converse, sometimes it loads, sometimes it minimizes and doesn't load.

- Sometimes bots and users cannot read messages in groups, they need to be removed and re-added in order to do so.

- Bots being able to read group chat messages would be a feature that would enable several new utilities (i.e. transcripting of group chats to export to other apps/websites, summarizing a group chat using intents and AI)

- The examples provided were extremely helpful and greatly assisted the creation of this project.

- An in-built framework to extend the provided command framework could be very useful to implement features such as categories, cooldowns, admin-restrictions, group-only or one-on-one-only commands, and more.

- Transaction support in Frames for Converse would enable creating a completely new class of applications.

- Overall developing on the MessageKit framework was extremely simple with the documentation and support provided by the team.

### SKALE Network
- The gasless mechanism makes it very useful for bots such as mine, which deal with frequent microtransactions and batch transactions.

- The developer docs and testnet docs provided were extremely helpful. 

### AirDAO Testnet
- The faucet on the testnet was buggy at times, but otherwise the documentation to onboard onto AirDAO was very detailed and made it extremely simple to deploy the auction mechanism and storing of auction data on-chain.