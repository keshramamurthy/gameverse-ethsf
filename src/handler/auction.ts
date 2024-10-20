import { HandlerContext, User } from "@xmtp/message-kit";
import { auctions } from "../index.js";
import { Auction } from "../types/Auction.js";

export async function handler(context: HandlerContext) {
  const {
    message: { content, sender },
  } = context;
  console.log(context.isGroup);
  if (!context.isGroup) return;

  const args = content.content.split(" ");
  const item = args[1];
  const duration = parseInt(args[2], 10);
  const startingBid = parseInt(args[3], 10);
  const minimumIncrement = parseInt(args[4], 10);

  if (args.length != 5 || !item || isNaN(duration) || isNaN(startingBid) || isNaN(minimumIncrement)) {
    return context.send(`Invalid usage! See /help to see how this command is run.`);
  }

  if (duration < 1 || duration > 24) {
    return context.send("Auction duration must be between 1 and 24 hours.");
  }

  const auctionId = "auction_" + context.group.id;
  if (auctions.has(auctionId)) {
    return context.send("There is already an auction running in this group.");
  }

  const auction: Auction = {
    item,
    duration,
    startTime: Date.now(),
    startingBid,
    minimumIncrement,
    highestBid: startingBid,
    highestBidder: "",
    owner: sender.address,
    id: auctionId,
    auctionComplete: false
  };

  auctions.set(auctionId, auction);
  context.send(
    `Auction created! Item: ${item}, Duration: ${duration} hours, Starting Bid: ${startingBid}, Minimum Increment: ${minimumIncrement}`
  );

  setTimeout(() => {
    const auction = auctions.get(auctionId) as Auction;
    if (!auction.auctionComplete) {
      auction.auctionComplete = true;
      auctions.set(auctionId, auction);

      if (auction.highestBidder) {
        // // Notify the highest bidder to complete payment via Frames.js
        // const paymentLink = `/auctionpay?address=${auction.highestBidder}&amount=${auction.highestBid}`;

        // await sendFrame(auction.highestBidder, {
        //   image: (
        //     <div>
        //     Congratulations, you won the auction for { auction.item }! Please complete the payment.
        //     </div>
        //   ),
        //   buttons: [
        //     {
        //       action: "tx",
        //       target: paymentLink,
        //       label: "Pay Now",
        //     },
        //   ],
        // });

        context.send(`${auction.highestBidder} wins with ${auction.highestBid}!`);

  // If the highest bidder doesn't pay within 1 hour, cancel the auction
  // setTimeout(async () => {
  //   const updatedAuction = auctions.get(auctionId);
  //   if (updatedAuction && !updatedAuction.auctionComplete) {
  //     await sendMessage(
  //       auction.owner,
  //       `The auction for ${auction.item} was cancelled because no payment was received.`
  //     );
  //     auctions.delete(auctionId);
  //   }
  // }, 3600 * 1000); // 1 hour payment window
} else {
  // Notify the auction owner that no bids were placed
  context.sendTo("No bids were placed on your auction, so it has been cancelled.", [sender.address]);
}
    }
  }, duration * 60);
}