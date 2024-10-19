import { HandlerContext } from "@xmtp/message-kit";
import { userData } from "../index.js";
import { UserData } from "../types/UserData.js";

export async function handler(context: HandlerContext) {
    const {
        message: { sender },
    } = context;

    const successMessages = [
        "You exploited some bugs in a smart contract and hacked your way into {amount} ❖.",
        "You mined a new block and earned {amount} ❖ as a reward.",
        "You discovered a hidden NFT airdrop and claimed {amount} ❖.",
        "You staked some ETH and generated {amount} ❖ in yield.",
        "You flipped some tokens on a DEX and made {amount} ❖.",
        "You found a rare ERC-721 token hidden in an old wallet, worth {amount} ❖.",
        "You participated in a liquidity pool and gained {amount} ❖ in fees.",
        "You farmed a DeFi protocol and harvested {amount} ❖.",
        "You created an unstoppable DAO and collected {amount} ❖ in funding.",
        "You arbitraged two DEXs and walked away with {amount} ❖.",
        "You launched a successful meme token and pocketed {amount} ❖ in profits.",
        "You found an exploit in a Layer-2 solution and secured {amount} ❖.",
        "You sniped a rare NFT auction and sold it for {amount} ❖.",
        "You contributed to a DeFi governance vote and earned {amount} ❖ in rewards.",
        "You deployed a smart contract on a testnet and miraculously earned {amount} ❖."
    ];

    const failureMessages = [
        "You tried to deploy a smart contract, but your laptop died. You didn't get any ❖.",
        "You found a rug-pull project and lost everything. No ❖ for you!",
        "You forgot to pay gas fees and the transaction failed. Better luck next time!",
        "Your private key got compromised and you lost all access. No ❖ earned.",
        "Your smart contract had a bug and got exploited. You earned 0 ❖."
    ];

    if (!userData.has(sender.address.toLowerCase())) {
        userData.set(sender.address.toLowerCase(), {
            balance: 0,
            address: sender.address.toLowerCase()
        });
    }

    const user = userData.get(sender.address.toLowerCase()) as UserData;

    const randomChance = Math.random();
    
    if (randomChance < 0.05) {
        const failureMessage = failureMessages[Math.floor(Math.random() * failureMessages.length)];
        return context.send(failureMessage);
    } else {
        const coinsEarned = Math.floor(Math.random() * (1000 - 500 + 1)) + 500;
        const successMessage = successMessages[Math.floor(Math.random() * successMessages.length)].replace('{amount}', coinsEarned.toString());

        user.balance += coinsEarned;
        userData.set(sender.address.toLowerCase(), user);

        return context.send(`${successMessage}\nYour new balance is ${user.balance} ❖.`);
    }
}