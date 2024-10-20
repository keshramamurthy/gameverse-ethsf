// triviaUtils.js
export const web3Trivia: TriviaQuestion[] = [
    {
        question: "What is the native cryptocurrency of Ethereum?",
        options: {
            A: "Bitcoin",
            B: "Ether",
            C: "Ripple",
            D: "Cardano"
        },
        correctAnswer: "B"
    },
    {
        question: "Which consensus mechanism does Bitcoin use?",
        options: {
            A: "Proof of Stake",
            B: "Proof of Work",
            C: "Delegated Proof of Stake",
            D: "Proof of Authority"
        },
        correctAnswer: "B"
    },
    {
        question: "Who is the creator of Bitcoin?",
        options: {
            A: "Vitalik Buterin",
            B: "Elon Musk",
            C: "Satoshi Nakamoto",
            D: "Charles Hoskinson"
        },
        correctAnswer: "C"
    },
    {
        question: "Which of the following is a Layer 2 scaling solution for Ethereum?",
        options: {
            A: "Optimism",
            B: "Avalanche",
            C: "Polkadot",
            D: "Cardano"
        },
        correctAnswer: "A"
    },
    {
        question: "What is a 'smart contract'?",
        options: {
            A: "A traditional legal contract",
            B: "Self-executing contract with code",
            C: "Blockchain wallet address",
            D: "A transaction"
        },
        correctAnswer: "B"
    },
    {
        question: "Which of these networks supports decentralized applications (dApps)?",
        options: {
            A: "Ethereum",
            B: "Litecoin",
            C: "Dogecoin",
            D: "XRP"
        },
        correctAnswer: "A"
    },
    {
        question: "What does DeFi stand for?",
        options: {
            A: "Decentralized Finance",
            B: "Delegated Finance",
            C: "Distributed Finance",
            D: "Digital Finance"
        },
        correctAnswer: "A"
    },
    {
        question: "Which of the following is a stablecoin?",
        options: {
            A: "Bitcoin",
            B: "Ether",
            C: "Tether",
            D: "Dogecoin"
        },
        correctAnswer: "C"
    },
    {
        question: "What is the maximum supply of Bitcoin?",
        options: {
            A: "21 million",
            B: "50 million",
            C: "100 million",
            D: "Unlimited"
        },
        correctAnswer: "A"
    },
    {
        question: "Which network uses SOL as its native cryptocurrency?",
        options: {
            A: "Avalanche",
            B: "Solana",
            C: "Polkadot",
            D: "Cardano"
        },
        correctAnswer: "B"
    },
    {
        question: "Which layer-1 blockchain is known for fast transaction speeds and low fees?",
        options: {
            A: "Ethereum",
            B: "Solana",
            C: "Bitcoin",
            D: "Litecoin"
        },
        correctAnswer: "B"
    },
    {
        question: "What is the term for dividing a cryptocurrency into smaller parts?",
        options: {
            A: "Splitting",
            B: "Forking",
            C: "Fractionalization",
            D: "Sharding"
        },
        correctAnswer: "C"
    },
    {
        question: "Which of the following is an NFT marketplace?",
        options: {
            A: "Uniswap",
            B: "OpenSea",
            C: "Aave",
            D: "Curve"
        },
        correctAnswer: "B"
    },
    {
        question: "What year was Bitcoin created?",
        options: {
            A: "2008",
            B: "2009",
            C: "2010",
            D: "2011"
        },
        correctAnswer: "B"
    },
    {
        question: "Which of the following is a popular hardware wallet?",
        options: {
            A: "Coinbase",
            B: "Ledger",
            C: "Trust Wallet",
            D: "MetaMask"
        },
        correctAnswer: "B"
    },
    {
        question: "What is the purpose of a blockchain?",
        options: {
            A: "To store public keys",
            B: "To verify transactions",
            C: "To regulate transactions",
            D: "To create tokens"
        },
        correctAnswer: "B"
    },
    {
        question: "Which platform is known for decentralized finance (DeFi) apps?",
        options: {
            A: "Ethereum",
            B: "Bitcoin",
            C: "Litecoin",
            D: "Monero"
        },
        correctAnswer: "A"
    },
    {
        question: "What does a 'block' in the blockchain contain?",
        options: {
            A: "User profiles",
            B: "Smart contracts",
            C: "Transaction data",
            D: "Mining rewards"
        },
        correctAnswer: "C"
    },
    {
        question: "What is 'gas' in Ethereum?",
        options: {
            A: "Transaction fee",
            B: "Smart contract execution cost",
            C: "Mining reward",
            D: "Token issuance"
        },
        correctAnswer: "B"
    },
    {
        question: "Which term refers to a major change in a blockchain protocol?",
        options: {
            A: "Soft fork",
            B: "Hard fork",
            C: "Rebase",
            D: "Minting"
        },
        correctAnswer: "B"
    },
    // Add more questions to reach a total of 50
    // Follow similar structure
    // ...
];

export interface TriviaQuestion {
    question: string;
    options: {
        A: string;
        B: string;
        C: string;
        D: string;
    };
    correctAnswer: 'A' | 'B' | 'C' | 'D';
}