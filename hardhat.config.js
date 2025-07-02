require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");

const {
  SKALE_ENDPOINT,
  SKALE_PRIVATE_KEY
} = process.env;

module.exports = {
  solidity: {
    version: "0.8.19",
    settings: { optimizer: { enabled: true, runs: 200 } }
  },
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545"
    },
    // Testnet (if .env has SKALE_TESTNET_* variables)
    ...(process.env.SKALE_TESTNET_ENDPOINT && process.env.SKALE_TESTNET_PRIVATE_KEY
      ? {
          skaleTestnet: {
            url: process.env.SKALE_TESTNET_ENDPOINT,
            accounts: [process.env.SKALE_TESTNET_PRIVATE_KEY]
          }
        }
      : {}),
    // Main SKALE
    ...(SKALE_ENDPOINT && SKALE_PRIVATE_KEY
      ? {
          skale: {
            url: SKALE_ENDPOINT,
            accounts: [SKALE_PRIVATE_KEY],
            chainId: 1444673419
          }
        }
      : {})
  }
};
