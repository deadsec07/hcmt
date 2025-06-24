const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying locally with account:", deployer.address);

  const Factory = await ethers.getContractFactory("SimpleSupplyChain");
  const instance = await Factory.deploy();
  await instance.deployed();

  console.log("Local deploy at:", instance.address);
}

main().catch(err => {
  console.error(err);
  process.exitCode = 1;
});
