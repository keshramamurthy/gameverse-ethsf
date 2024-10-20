import { HandlerContext } from "@xmtp/message-kit";
import { auctions } from "../index.js";
import { Auction } from "../types/Auction.js";
import AuctionABI from "../../AuctionABI.json";
import Web3 from "web3";
import fs from "fs";

export async function handler(context: HandlerContext) {
  const {
    message: { content, sender },
  } = context;
  if (!context.isGroup) return;

  const args = content.content.split(" ");
  const auctionId = "auction_" + context.group.id;
  const bidAmount = parseInt(args[1], 10);

  if (!bidAmount || isNaN(bidAmount)) {
    return context.send(`Invalid usage! See /help to see how this command is run.`);
  }

  if (!auctions.has(auctionId)) {
    return context.send("No auction is currently running in this group.");
  }

  const auction = auctions.get(auctionId) as Auction;

  if (Date.now() > auction.startTime + auction.duration * 3600 * 1000) {
    return context.send("The auction has ended.");
  }

  if (bidAmount <= auction.highestBid || bidAmount < auction.highestBid + auction.minimumIncrement) {
    return context.send(
      `Your bid must be higher than ${auction.highestBid} and meet the minimum increment of ${auction.minimumIncrement}.`
    );
  }

  auction.highestBid = bidAmount;
  auction.highestBidder = sender.address;

  auctions.set(auctionId, auction);
  const web3 = new Web3(new Web3.providers.HttpProvider(process.env.AIRDAO_ENDPOINT));
  const AuctionABI = JSON.parse(fs.readFileSync("AuctionABI.json", "utf-8"))

  const contract = new web3.eth.Contract(AuctionABI, auction.contractAddress);
  const ownerPrivateKey = process.env.OWNER_PRIVATE_KEY;
  const bidTx = contract.methods.placeBid(bidAmount, sender.address);

  const signedBidTx = await web3.eth.accounts.signTransaction(
    {
      to: auction.contractAddress,
      data: bidTx.encodeABI(),
      gas: 2000000,
    },
    ownerPrivateKey
  );

  await web3.eth.sendSignedTransaction(signedBidTx.rawTransaction || '');
  context.send(`${sender.address} has bid ${bidAmount} on ${auction.item}.`);
}