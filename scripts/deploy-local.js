const hre = require("hardhat");

async function main() {
    const SimpleSupplyChain = await hre.ethers.getContractFactory("SimpleSupplyChain");
    const contract = await SimpleSupplyChain.deploy();
    await contract.deployed();

    console.log("Contract deployed at:", contract.address);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});

