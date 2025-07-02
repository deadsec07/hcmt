# HCMT Smart Contract

## Setup
1. Copy `.env.example` to `.env` and fill in your TESTNET and PROD variables.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start a local Hardhat node for local testing:
   ```bash
   npx hardhat node
   ```

## Commands
- **Compile**: `npm run compile`
- **Test**: `npm run test`
- **Deploy locally**: `npm run deploy:local`
- **Deploy to Testnet**: `npm run deploy:testnet`
- **Deploy to Production**: `npm run deploy:prod`

//

How to Run Locally
Start the local server
Start the Hardhat local blockchain:
	npx hardhat node

Compile the contracts
Clean and compile your smart contracts:
	npx hardhat clean && npx hardhat compile

Deploy the smart contract
Deploy the smart contract to your local network:
	npx hardhat run scripts/deploy.js --network localhost

Check if the local development server is working
Verify that your local Hardhat network is running correctly by sending a POST request to get the latest block number:
	curl -X POST --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' -H "Content-Type: application/json" http://127.0.0.1:8545

Run tests
Run tests for your smart contracts:
	npx hardhat test

Interact with the contract in the Hardhat console
Open the Hardhat console to interact with the contract:
	npx hardhat console --network localhost

//
npx hardhat clean && npx hardhat compile && npx hardhat run scripts/deploy-local.js --network localhost && npx hardhat console --network localhost

AND

npx hardhat node

//

hcmt/                         ← project root
├── contracts/                
│   └── SimpleSupplyChain.sol  ← on-chain contract
├── scripts/
│   ├── deploy-local.js
│   ├── deploy-testnet.js
│   └── deploy-prod.js
├── test/
│   └── SimpleSupplyChain.test.js
├── backend/
│   ├── package.json
│   ├── .env.example
│   ├── src/
│   │   ├── index.js           ← Express / Lambda entry
│   │   ├── auth.js            ← subscription & role‐grant logic
│   │   ├── relay.js           ← gas-less transaction relay
│   │   └── config.js
│   └── test/
│       └── backend.test.js    ← integration tests
├── frontend/
│   ├── package.json
│   ├── src/
│   │   ├── App.jsx            ← main React UI
│   │   ├── components/        ← shadcn/ui & Tailwind components
│   │   ├── hooks/             ← Ethers.js hooks
│   │   └── utils/
│   │       └── api.js         ← REST + on-chain helpers
│   └── public/
│       └── index.html
├── subgraph/
│   ├── subgraph.yaml
│   └── mappings/
│       └── mapping.ts
├── hardhat.config.js
├── package.json               ← for contract & scripts
├── .env.example               ← SKALE & backend keys
└── README.md

