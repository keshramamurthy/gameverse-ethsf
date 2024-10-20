// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AuctionDataOnly {
    address public admin = address(0x545A17dcd18a16e1418a626f97FA9D1060241C0D);
    address public owner;         // Auction owner
    string public item;           // Item being auctioned
    uint256 public endTime;       // Auction end time (block timestamp)
    uint256 public startingBid;   // Starting bid amount
    uint256 public minBidIncrement;// Minimum increment between bids
    address public highestBidder; // Address of the highest bidder
    uint256 public highestBid;    // Amount of the highest bid
    bool public auctionEnded;     // Flag for auction end state

    event AuctionStarted(string item, uint256 startingBid, uint256 endTime);
    event NewBid(address indexed bidder, uint256 amount);
    event AuctionEnded(address winner, uint256 amount);
    event AuctionCancelled();

    modifier onlyOwner() {
        require(msg.sender == admin, "Only admin can call this");
        _;
    }

    modifier auctionActive() {
        require(block.timestamp < endTime, "Auction has already ended");
        _;
    }

    modifier auctionEndedModifier() {
        require(block.timestamp >= endTime, "Auction is still active");
        _;
    }

    constructor(
        string memory _item,
        uint256 _startingBid,
        uint256 _minBidIncrement,
        uint256 _durationInHours
    ) {
        owner = msg.sender;
        item = _item;
        startingBid = _startingBid;
        minBidIncrement = _minBidIncrement;
        endTime = block.timestamp + (_durationInHours * 1 hours);
        emit AuctionStarted(item, startingBid, endTime);
    }

    // Function to place a bid (no token transfer, just updates the highest bid data)
    function placeBid(uint256 amount, address bidder) external auctionActive {
        require(amount >= startingBid, "Bid must be higher than the starting bid");
        require(amount >= highestBid + minBidIncrement, "Bid must be higher than the current highest bid");

        // Update new highest bid
        highestBidder = bidder;
        highestBid = amount;

        emit NewBid(msg.sender, amount);
    }

    // Function to finalize auction (just marks it as ended)
    function finalizeAuction() external onlyOwner auctionEndedModifier {
        require(!auctionEnded, "Auction already finalized");
        auctionEnded = true;

        emit AuctionEnded(highestBidder, highestBid);
    }

    // Function to cancel auction (just marks it as ended, with no winner)
    function cancelAuction() external onlyOwner auctionEndedModifier {
        require(!auctionEnded, "Auction already finalized");
        auctionEnded = true;
        highestBidder = address(0); // Reset highest bidder

        emit AuctionCancelled();
    }
}