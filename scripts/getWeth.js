const { getNamedAccounts, ethers, network } = require("hardhat")
const { networkConfig } = require("../helper-hardhat-config")

const AMOUNT = ethers.utils.parseEther("0.02")

async function getWeth(){
    const { deployer } = await getNamedAccounts()
    // To get Weth contract you need abi (use Weth interface) and contract address!
    const iWeth = await ethers.getContractAt(/*IWeth abi*/"IWeth", networkConfig[network.config.chainId].wethToken, deployer)
    const tx = await iWeth.deposit({value: AMOUNT})
    await tx.wait(1)

    const wethBalance = await iWeth.balanceOf(deployer)
    console.log(`Got ${wethBalance.toString()} ETH`)
}


module.exports = { getWeth, AMOUNT }