import { HandlerContext } from "@xmtp/message-kit";
import { auctions } from "../index.js";
import { Auction } from "../types/Auction.js";

export async function handler(context: HandlerContext) {
    if (!context.isGroup) return;
    const auctionId = "auction_" + context.group.id;
    if (!auctions.has(auctionId)) {
      return context.send("No auction is currently running in this group.");
    }
  
    const auction = auctions.get(auctionId) as Auction;
    const timeLeft = (auction.startTime + auction.duration * 3600 * 1000) - Date.now();
  
    if (timeLeft > 0) {
      context.send(
        `Auction for ${auction.item} is running. Highest bid is ${auction.highestBid}. Time remaining: ${Math.round(
          timeLeft / (60 * 1000)
        )} minutes.`
      );
    } else {
      context.send("The auction has ended.");
    }
  }