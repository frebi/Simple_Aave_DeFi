const { getNamedAccounts, ethers, network } = require("hardhat")
const { networkConfig } = require("../helper-hardhat-config")
const {getWeth, AMOUNT} = require("../scripts/getWeth")

async function main(){
    //the protocol treats eerything as an ERC20 token

    // Get Weth
    await getWeth()
    const { deployer } = await getNamedAccounts()

    // Get lendingPool
    const lendingPool = await getLendingPool(deployer)
    console.log(`LendingPool address ${lendingPool.address}`)

    // 1. Depositing
    const wethTokenAddress = networkConfig[network.config.chainId].wethToken
    /*--- before depositing we need to approve aave lending pool to use the amount of Weth that we want to deposit ---*/
    await approveErc20(wethTokenAddress, lendingPool.address, AMOUNT, deployer)
    console.log("Depositing...")
    await lendingPool.deposit(wethTokenAddress, AMOUNT, deployer, 0)
    console.log("Deposited!")

    // 2. Borrowing
    let {availableBorrowsETH, totalDebtETH} = await getBorrowUserData(lendingPool, deployer)
    const daiPrice = await getDaiPrice()
    const amountDaiToBorrow = availableBorrowsETH.toString() * 0.95 * (1 / daiPrice.toNumber())
    console.log(`You can borrow ${amountDaiToBorrow} DAI`)
    const amountDaiToBorrowWei = ethers.utils.parseEther(amountDaiToBorrow.toString())

    const daiTokenAddress = networkConfig[network.config.chainId].daiToken
    await borrowDai(daiTokenAddress, lendingPool, amountDaiToBorrowWei, deployer)
    await getBorrowUserData(lendingPool, deployer)

    // 3. Repaying
    await repay(amountDaiToBorrowWei, daiTokenAddress, lendingPool, deployer)
    await getBorrowUserData(lendingPool, deployer)
}


async function getLendingPool(account){
    const lendingPoolAddressesProvider = await ethers.getContractAt(
        "ILendingPoolAddressesProvider", 
        networkConfig[network.config.chainId].lendingPoolAddressesProvider, 
        account
    )

    const lendingPoolAddress = await lendingPoolAddressesProvider.getLendingPool()
    const lendingPool = await ethers.getContractAt(
        "ILendingPool", 
        lendingPoolAddress,
        account
    )

    return lendingPool
}


async function approveErc20(erc20Address, spenderAddress, amountToSpend, account){
    const erc20Token = await ethers.getContractAt(
        "IERC20",
        erc20Address,
        account
    )
    const tx = await erc20Token.approve(spenderAddress, amountToSpend)
    await tx.wait(1)
    console.log("Approved!")
}


async function getBorrowUserData(lendingPool, account){
    const {totalCollateralETH, totalDebtETH, availableBorrowsETH} = await lendingPool.getUserAccountData(account)
    console.log(`You have ${totalCollateralETH} worth of ETH deposited.`)
    console.log(`You have ${totalDebtETH} worth of ETH borrowed.`)
    console.log(`You can borrow ${availableBorrowsETH} worth of ETH.`)
    return { availableBorrowsETH, totalDebtETH }
}

async function getDaiPrice(){
    const daiEthPriceFeed = await ethers.getContractAt(
        "AggregatorV3Interface",
        networkConfig[network.config.chainId].daiEthPriceFeed
    )
    const price = (await daiEthPriceFeed.latestRoundData())[1]
    console.log(`The DAI/ETH price is ${price.toString()}`)
    return price
}


async function borrowDai(daiAddress, lendingPool, amountDaiToBorrow, account){
    const borrowTx = await lendingPool.borrow(daiAddress, amountDaiToBorrow, 1, 0, account)
    await borrowTx.wait(1)
    console.log("You've borrowed!")
}


async function repay(amount, daiAddress, lendingPool, account){
    await approveErc20(daiAddress, lendingPool.address, amount, account)
    const reapyTx = await lendingPool.repay(daiAddress, amount, 1, account)
    console.log("Repaid!")
}




main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })