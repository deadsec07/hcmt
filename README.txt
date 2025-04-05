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
