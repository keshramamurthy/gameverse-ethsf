export type Auction = {
    id: string;
    item: string;
    duration: number;
    startTime: number;
    startingBid: number;
    minimumIncrement: number;
    highestBid: number;
    highestBidder: string;
    owner: string;
    auctionComplete: boolean;
}

export const generateSessionId = (length: number = 16): string => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let sessionId = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        sessionId += characters[randomIndex];
    }
    return sessionId;
}