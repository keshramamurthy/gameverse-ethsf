import { HandlerContext, User, xmtpClient } from "@xmtp/message-kit";
import { auctions } from "../index.js";
import { Auction } from "../types/Auction.js";
import fs from "fs";
import Web3 from "web3";

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
    if (!auctions.get(auctionId).auctionComplete) {
      return context.send("There is already an auction running in this group.");
    }
  }

  const web3 = new Web3(new Web3.providers.HttpProvider(process.env.AIRDAO_ENDPOINT));
  const AuctionABI = JSON.parse(fs.readFileSync("AuctionABI.json", "utf-8"))

  const ownerAddress = process.env.SKALE_ADDRESS;
  const ownerPrivateKey = process.env.SKALE_PRIVATE_KEY;
  const auctionContract = new web3.eth.Contract(AuctionABI);
  const deployTx = auctionContract.deploy({
    data: fs.readFileSync("AuctionBytecode.txt", "utf-8"), // Ensure you have the bytecode for the contract
    arguments: [item, startingBid, minimumIncrement, duration],
  });

  const nonce = await web3.eth.getTransactionCount(ownerAddress, 'latest');
  const signedTx = await web3.eth.accounts.signTransaction(
    {
      
      data: deployTx.encodeABI(),
      from: ownerAddress,
      gas: 3000000,
      gasPrice: await web3.eth.getGasPrice(),
      nonce
    },
    ownerPrivateKey
  );
  console.log(signedTx);

  const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction || '');
  const contractAddress = receipt.contractAddress;
  console.log(contractAddress);


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
    auctionComplete: false,
    auctionPaid: false,
    contractAddress
  };

  auctions.set(auctionId, auction);
  context.send(
    `Auction created! Item: ${item}, Duration: ${duration} hours, Starting Bid: ${startingBid}, Minimum Increment: ${minimumIncrement}`
  );

  setTimeout(async () => {
    const auctionGet = auctions.get(auctionId) as Auction;

    if (!auctionGet.auctionComplete) {
      auctionGet.auctionComplete = true;
      auctions.set(auctionId, auctionGet);

      const contract = new web3.eth.Contract(AuctionABI, auctionGet.contractAddress);
      const ownerPrivateKey = process.env.OWNER_PRIVATE_KEY;

      if (auctionGet.highestBidder) {
        try {
          const frame_url = process.env.FRAMES_URL;

          context.sendTo(
            `Congratulations! You won the auction for ${auctionGet.item}. You have 1 hour to pay your bid for the auction or end up losing your spot.`,
            [auctionGet.highestBidder]
          );
          context.sendTo(`https://7691-104-244-25-79.ngrok-free.app/`, [auctionGet.highestBidder]);

          context.send(`${frame_url}/auction?winnerAddress=${auctionGet.highestBidder}&item=${auctionGet.item}`);
          context.send(`${auctionGet.highestBidder} wins the auction for ${auctionGet.item} with ${auctionGet.highestBid}!`);

          setTimeout(async () => {
            const updatedAuction = auctions.get(auctionId);
            if (updatedAuction && !updatedAuction.auctionPaid) {
              await context.sendTo(
                `The auction for ${updatedAuction.item} was cancelled because no payment was received from ${updatedAuction.highestBidder}.`,
                [updatedAuction.owner]
              );

              auctions.delete(auctionId);

              const nonce = await web3.eth.getTransactionCount(ownerAddress, 'latest');
              const cancelTx = contract.methods.cancelAuction();
              const signedCancelTx = await web3.eth.accounts.signTransaction({
                to: auctionGet.contractAddress,
                data: cancelTx.encodeABI(),
                from: ownerAddress,
                gas: 3000000,
                gasPrice: await web3.eth.getGasPrice(),
                nonce
              }, ownerPrivateKey);

              await web3.eth.sendSignedTransaction(signedCancelTx.rawTransaction || '');
            }
          }, 3600 * 1000); // 1 hour payment window

        } catch (error) {
          console.error("Error finalizing auction:", error);
        }

      } else {
        // Notify the auction owner that no bids were placed
        context.sendTo("No bids were placed on your auction, so it has been cancelled.", [auctionGet.owner]);

        const nonce = await web3.eth.getTransactionCount(ownerAddress, 'latest');
        // Call cancelAuction on the smart contract
        const cancelTx = contract.methods.cancelAuction();
        const signedCancelTx = await web3.eth.accounts.signTransaction({
          to: auctionGet.contractAddress,
          data: cancelTx.encodeABI(),
          from: ownerAddress,
          gas: 3000000,
          gasPrice: await web3.eth.getGasPrice(),
          nonce
        }, ownerPrivateKey);

        await web3.eth.sendSignedTransaction(signedCancelTx.rawTransaction || '');
      }
    }
  }, duration * 1000);
}