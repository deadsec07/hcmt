require('dotenv').config();
const { ethers } = require('ethers');
const path = require('path');

// Provider + signer
const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
const signer   = new ethers.Wallet(
  process.env.PRIVATE_KEY,
  provider
);

// Contract ABI & instance
const artifact = require(path.resolve(
  __dirname,
  '../../artifacts/contracts/SimpleSupplyChain.sol/SimpleSupplyChain.json'
));
const contractAddress = process.env.CONTRACT_ADDRESS;
const contract = new ethers.Contract(
  contractAddress,
  artifact.abi,
  signer
);

module.exports = { provider, signer, contract };
