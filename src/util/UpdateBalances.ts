import dotenv from 'dotenv';
import Web3 from 'web3';
import cron from 'node-cron';
import fs from 'fs';
import { userData } from '..';

// Load environment variables from .env file
dotenv.config();

// Connect to the SKALE network
const web3 = new Web3(new Web3.providers.HttpProvider(process.env.SKALE_ENDPOINT || ''));

// Load contract ABI and address
const contractABI = JSON.parse(fs.readFileSync('GameTokenABI.json', 'utf8'));
const contractAddress = process.env.SKALE_CONTRACT_ADDRESS || '';
const contract = new web3.eth.Contract(contractABI, contractAddress);

// Get the owner's wallet address and private key
const ownerAddress = process.env.SKALE_ADDRESS || '';
const ownerPrivateKey = process.env.SKALE_PRIVATE_KEY || '';

// // Simulated userData (replace with your actual userData storage)
// const userData: Map<string, { balance: number }> = new Map([
//     ['0x123...', { balance: 1000 }],
//     ['0x456...', { balance: 500 }],
//     ['0x789...', { balance: 2500 }],  // Add more users as needed
// ]);

// Function to sign and send transactions
async function sendTransaction(txData: any): Promise<any> {
    try {
        const nonce = await web3.eth.getTransactionCount(ownerAddress, 'latest');
        const tx = {
            from: ownerAddress,
            to: contractAddress,
            gas: 2000000, // Set appropriate gas limit
            data: txData,
            nonce,
        };

        const signedTx = await web3.eth.accounts.signTransaction(tx, ownerPrivateKey);
        const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction || '');
        return receipt;
    } catch (error) {
        console.error('Error sending transaction:', error);
    }
}

// Function to batch update balances on-chain
export async function batchUpdateBalances(): Promise<void> {
    try {
        const users = Array.from(userData.keys());
        const balances = Array.from(userData.values()).map(data => data.balance);

        console.log(`Updating balances for ${users.length} users`);

        // Call the batchUpdateBalances function on the smart contract
        const txData = contract.methods.batchUpdateBalances(users, balances).encodeABI();
        const receipt = await sendTransaction(txData);

        console.log('Batch update successful:', receipt);
    } catch (error) {
        console.error('Error updating balances:', error);
    }
}

// Schedule the balance update every hour using node-cron
