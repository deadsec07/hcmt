require("@nomicfoundation/hardhat-toolbox");
require("@typechain/hardhat"); // Only include if using TypeChain

module.exports = {
  solidity: {
    version: "0.8.19", // Use a version compatible with your contracts (e.g., 0.8.7, 0.8.19)
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  // ... rest of your config
};