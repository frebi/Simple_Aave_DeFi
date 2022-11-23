const networkConfig = {
    31337: {
        name: "localhost",
        wethToken: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",

        lendingPoolAddressesProvider: "0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5",
        daiEthPriceFeed: "0x773616e4d11a78f511299002da57a0a94577f1f4",
        daiToken: "0x6b175474e89094c44da98b954eedeac495271d0f",
    },
    5: {
        name: "goerli",
        ethUsdPriceFeed: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e",
        wethToken: "0x8B7FB00ABb67ba04CE894B9E2769fe24A8409a6a",

        // This is the AaveV2 Lending Pool Addresses Provider
        lendingPoolAddressesProvider: "0x5E52dEc931FFb32f609681B8438A51c675cc232d",
        // This is LINK/ETH feed
        daiEthPriceFeed: "0xb4c4a493AB6356497713A78FFA6c60FB53517c63",
        // This is the LINK token
        daiToken: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
    }
}

const developmentChains = ["hardhat", "localhost"]

module.exports = {
    networkConfig,
    developmentChains,
}