const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Enhanced Supply Chain Tests", function () {
  let contract, owner, addr1, addr2, verifier;

  beforeEach(async () => {
    [owner, addr1, addr2, verifier] = await ethers.getSigners();
    const SupplyChain = await ethers.getContractFactory("SimpleSupplyChain");
    contract = await SupplyChain.deploy();
    await contract.deployed();
  });

  function getSignature(signer, hash) {
    return signer.signMessage(ethers.utils.arrayify(hash));
  }

  it("should register product with valid signature", async () => {
    const name = "Tea";
    const messageHash = ethers.utils.solidityKeccak256(["string", "address"], [name, owner.address]);
    const signature = await getSignature(owner, messageHash);

    await expect(contract.registerProduct(name, signature))
      .to.emit(contract, "ProductRegistered");
  });

  it("should transfer product with valid signature", async () => {
    // Register first
    const name = "Coffee";
    const registerHash = ethers.utils.solidityKeccak256(["string", "address"], [name, owner.address]);
    const registerSig = await getSignature(owner, registerHash);
    await contract.registerProduct(name, registerSig);

    // Transfer to addr1
    const transferHash = ethers.utils.solidityKeccak256(
      ["uint256", "address", "address"],
      [0, addr1.address, owner.address]
    );
    const transferSig = await getSignature(owner, transferHash);

    await expect(contract.transferProduct(0, addr1.address, transferSig))
      .to.emit(contract, "ProductTransferred")
      .withArgs(0, owner.address, addr1.address);
  });

  it("should allow verification by authorized verifier", async () => {
    // Register product
    const name = "Spices";
    const messageHash = ethers.utils.solidityKeccak256(["string", "address"], [name, owner.address]);
    const signature = await getSignature(owner, messageHash);
    await contract.registerProduct(name, signature);

    // Transfer to addr1
    const transferHash = ethers.utils.solidityKeccak256(["uint256", "address", "address"], [0, addr1.address, owner.address]);
    const transferSig = await getSignature(owner, transferHash);
    await contract.transferProduct(0, addr1.address, transferSig);

    // Add verifier
    await contract.updateVerifier(verifier.address, true);

    // Connect as verifier
    await expect(contract.connect(verifier).verifyProduct(0))
      .to.emit(contract, "ProductVerified")
      .withArgs(0);
  });
});
