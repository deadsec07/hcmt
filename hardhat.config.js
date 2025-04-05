require("@nomicfoundation/hardhat-toolbox");
require("@typechain/hardhat"); // Only include if using TypeChain
require("dotenv").config();
require("@nomiclabs/hardhat-ethers");

module.exports = {
  solidity: {
    version: "0.8.19", // Use a version compatible with your contracts (e.g., 0.8.7, 0.8.19)
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },networks: {
    skale: {
      url: process.env.SKALE_ENDPOINT,
      accounts: [process.env.SKALE_PRIVATE_KEY],
      gasPrice: 100000,
      gas: 8000000,
      chainId: 1444673419,
      timeout: 60000
    },
    localhost: {
      url: "http://127.0.0.1:8545", // Local network (e.g., Hardhat network or Ganache)
    },
    // mainnet: {
    //   url: `https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID`,
    //   accounts: [`0x${process.env.PRIVATE_KEY}`], // Use an environment variable for private key
    // },
  },
  // ... rest of your config
};