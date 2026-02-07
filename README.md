🚗 Decentralized Car Rental DApp

A full-stack Web3 car rental platform that enables peer-to-peer vehicle rentals using Ethereum smart contracts on the Sepolia testnet.

Car owners can list vehicles, and renters can securely book them using Sepolia ETH, with all transactions enforced by blockchain logic.

🌐 Tech Stack
Layer	Technology
Blockchain	Solidity, Ethereum (Sepolia)
Smart Contract Framework	Hardhat
Frontend	React + Vite
Web3 Interaction	Ethers.js
Wallet	MetaMask
RPC Provider	Alchemy
✨ Features
👤 Car Owners

Register vehicles for rental

Set model, location, and price per day

Cars stored immutably on blockchain

🚘 Renters

Browse available cars

Filter by location

Rent using Sepolia ETH

Secure payments handled by smart contract

🔐 Web3 Security

Trustless rental process

No intermediaries

Smart contract enforces rules automatically

🚀 Full Setup & Deployment Guide
1️⃣ Prerequisites

Install the following:

Node.js (v18 or higher)

MetaMask browser extension

Git

Create Required Accounts
Service	Purpose
Alchemy	Provides Sepolia RPC endpoint
Sepolia Faucet	Get free test ETH
2️⃣ Get Your Sepolia RPC URL (Alchemy)

Go to https://www.alchemy.com/

Create a free account

Click Create App

Select:

Network: ethereum sepolia 

Copy the Endpoint URL

This will be your:

SEPOLIA_RPC_URL
also create a api key

3️⃣ Get Sepolia Test ETH

Visit https://sepoliafaucet.com/

Paste your MetaMask wallet address

Click Send Me ETH

🛠️ Project Installation
# Clone repository
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name

Install Backend (Hardhat)
cd backend
npm install

Install Frontend (React)
cd ../frontend
npm install

⚙️ Smart Contract Deployment (Backend)

Go to backend:

cd backend

Create .env file
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY
PRIVATE_KEY=your_wallet_private_key_without_0x
ETHERSCAN_API_KEY=your_etherscan_api_key


⚠️ Never share your private key publicly.

Compile Contract
npx hardhat compile

Deploy to Sepolia
npx hardhat run scripts/deploy.js --network sepolia


After deployment, copy the contract address printed in the terminal:

Contract deployed to: 0x....

🔗 Frontend Configuration (Connecting UI to Blockchain)

Go to frontend:

cd ../frontend

Create .env file
VITE_SEPOLIA_RPC=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY
VITE_CONTRACT_ADDRESS=PASTE_DEPLOYED_ADDRESS_HERE
VITE_SEPOLIA_CHAIN_ID=11155111

Sync Smart Contract ABI

Copy:

backend/artifacts/contracts/CarRental.sol/CarRental.json


Paste into:

frontend/src/abi/CarRental.json


(Overwrite existing file)

▶️ Run the DApp
npm run dev


Open in browser:

http://localhost:5173

🧑‍💻 Using the DApp
1️⃣ Connect Wallet

Click Connect Wallet

Approve MetaMask connection

2️⃣ Switch Network

Ensure MetaMask is set to:

Ethereum Sepolia Test Network

👤 Owner Flow

Go to Owner Dashboard

Add car:

Model

Location

Price per day

Confirm transaction in MetaMask

🚘 Renter Flow

Browse cars

Filter by location

Select car

Pay rental cost using Sepolia ETH

📂 Project Structure
car-rental-dapp/
│
├── backend/            # Hardhat project
│   ├── contracts/
│   ├── scripts/
│   └── artifacts/
│
├── frontend/           # React + Vite app
│   ├── src/
│   └── abi/
│
└── README.md

🔒 Security Notes

Do NOT upload .env files

Keep private keys secret

This project is for testnet learning purposes only

🎯 Learning Goals

This project demonstrates:

Smart contract development

Web3 frontend integration

Wallet connection

Blockchain-based payments

Full-stack DApp deployment
