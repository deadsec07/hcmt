const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SimpleSupplyChain", () => {
  let sc, owner, user, verifier;

  beforeEach(async () => {
    [owner, user, , verifier] = await ethers.getSigners();
    const Factory = await ethers.getContractFactory("SimpleSupplyChain");
    sc = await Factory.deploy();
    await sc.deployed();
  });

  it("registers, transfers, and verifies correctly", async () => {
    const name = "ItemA";
    const msgHash = await sc.getMessageHash(name, owner.address);
    const sig = await owner.signMessage(msgHash);

    await sc.registerProduct(name, sig);
    await sc.transferProduct(0, user.address, await owner.signMessage(
      ethers.utils.arrayify(
        ethers.utils.solidityKeccak256(["uint256","address","address"], [0, user.address, owner.address])
      )
    ));
    await sc.updateVerifier(verifier.address, true);
    await expect(sc.connect(verifier).verifyProduct(0))
      .to.emit(sc, "ProductVerified").withArgs(0);
  });
});
