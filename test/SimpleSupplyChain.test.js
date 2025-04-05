const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SimpleSupplyChain", function () {
  let contract, owner, verifier, user1, user2;

  beforeEach(async () => {
    [owner, verifier, user1, user2] = await ethers.getSigners();
    const Factory = await ethers.getContractFactory("SimpleSupplyChain");
    contract = await Factory.connect(owner).deploy();
    await contract.deployed();
  });

  async function getSignature(signer, message) {
    const hash = ethers.utils.solidityKeccak256(["string", "address"], message);
    const bytesHash = ethers.utils.arrayify(hash);
    return await signer.signMessage(bytesHash);
  }

  it("should register a product with valid signature", async () => {
    const name = "Test Product";
    const signature = await getSignature(owner, [name, owner.address]);

    const tx = await contract.registerProduct(name, signature);
    await tx.wait();

    const product = await contract.products(0);
    expect(product.name).to.equal(name);
    expect(product.currentOwner).to.equal(owner.address);
  });

  it("should transfer a product with valid signature", async () => {
    const name = "Test Product";
    const sig = await getSignature(owner, [name, owner.address]);
    await contract.registerProduct(name, sig);

    const transferSig = await (async () => {
      const hash = ethers.utils.solidityKeccak256(["uint256", "address", "address"], [0, user1.address, owner.address]);
      const bytesHash = ethers.utils.arrayify(hash);
      return await owner.signMessage(bytesHash);
    })();

    await contract.transferProduct(0, user1.address, transferSig);
    const updated = await contract.products(0);
    expect(updated.currentOwner).to.equal(user1.address);
  });

  it("should allow owner to add and remove verifier", async () => {
    await contract.addVerifier(verifier.address);
    expect(await contract.authorizedVerifiers(verifier.address)).to.equal(true);

    await contract.removeVerifier(verifier.address);
    expect(await contract.authorizedVerifiers(verifier.address)).to.equal(false);
  });

  it("should allow a verifier to verify product", async () => {
    const name = "Test Product";
    const sig = await getSignature(owner, [name, owner.address]);
    await contract.registerProduct(name, sig);

    await contract.addVerifier(verifier.address);
    await contract.connect(verifier).verifyProduct(0);
    const verifiedProduct = await contract.products(0);
    expect(verifiedProduct.verified).to.equal(true);
  });
});
