const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying to Production with account:", deployer.address);

  const Factory = await ethers.getContractFactory("SimpleSupplyChain");
  const instance = await Factory.deploy();
  await instance.deployed();

  console.log("Production deploy at:", instance.address);
}

main().catch(err => {
  console.error(err);
  process.exitCode = 1;
});
