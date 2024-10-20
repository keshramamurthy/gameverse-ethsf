# Gameverse

A chatbot built on XMTP’s Converse app, SKALE Network and AirDAO that integrates a currency-based game system as well as an auction mechanism for group chats.

## How to use:

Run `npm i` in this folder and then `npm run dev` to start the bot.

Make sure the necessary contracts are deployed on-chain.
The same addresses are used for Skale and AirDAO.
Populate `.env` with the fields:
KEY=
FRAMES_URL=
SKALE_PRIVATE_KEY=
SKALE_CONTRACT_ADDRESS=
SKALE_ENDPOINT=
SKALE_ADDRESS=
AIRDAO_ENDPOINT=

In `/frames-server`, run `npm i` and `npm run dev` to start the frames server.

CONTRACTS:
- AirDAO: Deployed from: `0x545a17dcd18a16e1418a626f97fa9d1060241c0d`
- SKALE: `0x3dd95Ca920b88EF30a7Ba0D6Be2c4DB38ef5425D`

Read DEVNOTES.MD for further notes on the bot, as well as developer feedback from the experience gained in developing this project.