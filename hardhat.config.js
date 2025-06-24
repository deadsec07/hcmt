require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");

const {
  TESTNET_ENDPOINT,
  TESTNET_PRIVATE_KEY,
  PROD_ENDPOINT,
  PROD_PRIVATE_KEY
} = process.env;

module.exports = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545"
    },
    ...(TESTNET_ENDPOINT && TESTNET_PRIVATE_KEY
      ? {
          skaleTestnet: {
            url: TESTNET_ENDPOINT,
            accounts: [TESTNET_PRIVATE_KEY]
          }
        }
      : {}),
    ...(PROD_ENDPOINT && PROD_PRIVATE_KEY
      ? {
          skale: {
            url: PROD_ENDPOINT,
            accounts: [PROD_PRIVATE_KEY],
            chainId: 1444673419
          }
        }
      : {})
  }
};
