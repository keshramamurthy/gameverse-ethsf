import { HandlerContext } from "@xmtp/message-kit";
import { auctions } from "../index.js";
import { Auction } from "../types/Auction.js";

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
    context.send(`${sender.address} has bid ${bidAmount} on ${auction.item}.`);
  }