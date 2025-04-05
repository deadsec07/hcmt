async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  // Get network gas price dynamically
  const gasPrice = await ethers.provider.getGasPrice();
  console.log("Network gas price:", gasPrice.toString());

  const txOverrides = {
    gasPrice: gasPrice,
    gasLimit: 8000000
  };

  const Factory = await ethers.getContractFactory("SimpleSupplyChain");
  const contract = await Factory.deploy(txOverrides);
  
  console.log("Tx hash:", contract.deployTransaction.hash);
  await contract.deployed();
  console.log("Deployed address:", contract.address);
}

main().catch(console.error);