const { ethers } = require("hardhat");
const hre   = require("hardhat");
const fs    = require("fs");
const path  = require("path");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying to SKALE testnet with account:", deployer.address);

  const Factory = await ethers.getContractFactory("SimpleSupplyChain");
  const instance = await Factory.deploy();
  await instance.deployed();

  console.log("Testnet deploy address:", instance.address);
  // 2. read the artifact’s ABI
  const artifact = await hre.artifacts.readArtifact("SimpleSupplyChain");

  // 3. write it to your frontend’s abis folder
  const outDir = path.resolve(__dirname, "../subgraph/abis");
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(
    path.join(outDir, "SimpleSupplyChain.json"),
    JSON.stringify(artifact.abi, null, 2)
  );
  console.log("ABI exported to", outDir);
}

main().catch(err => {
  console.error(err);
  process.exitCode = 1;
});
