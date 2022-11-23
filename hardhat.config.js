require("@nomiclabs/hardhat-waffle")
require("@nomiclabs/hardhat-etherscan")
require("hardhat-deploy")
require("solidity-coverage")
require("hardhat-gas-reporter")
require("hardhat-contract-sizer")
require("dotenv").config()

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY
const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL
const PRIVATE_KEY = process.env.PRIVATE_KEY
const MAINNET_RPC_URL = process.env.MAINNET_RPC_URL

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [
      { version: "0.8.7"},
      { version: "0.6.6"},
      { version: "0.4.19"},
      { version: "0.6.12"}
    ]
  },
  defaultNetwork:"hardhat",
  networks:{
    hardhat:{
      chainId: 31337,
      forking: {
        url: MAINNET_RPC_URL,
      },
    },
    localhost: {
      chainId: 31337,
    },
    goerli:{
      url: GOERLI_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 5,
      blockConfirmations: 6,
    },
  },
  namedAccounts:{
    deployer:{
      default: 0, // here this will by default take the first account as deployer
      1: 0, // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
    }
  },
  gasReporter: {
    enabled: false,
    currency: "USD",
    outputFile: "gas-report.txt",
    noColors: true,
    // coinmarketcap: process.env.COINMARKETCAP_API_KEY,
  },
  mocha: {
    timeout: 500000, // 500 seconds max for running tests
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY
  },
};
