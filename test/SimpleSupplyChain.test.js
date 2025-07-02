const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SimpleSupplyChain (full features)", function () {
  let sc, owner, client, transporter, verifier, freezer;

  beforeEach(async function () {
    [owner, client, transporter, verifier, freezer] = await ethers.getSigners();
    const Factory = await ethers.getContractFactory("SimpleSupplyChain");
    sc = await Factory.deploy();
    await sc.deployed();

    // grant roles
    const ADMIN = await sc.DEFAULT_ADMIN_ROLE();
    await sc.grantRole(await sc.CLIENT_ROLE(), client.address);
    await sc.grantRole(await sc.TRANSFER_ROLE(), transporter.address);
    await sc.grantRole(await sc.VERIFIER_ROLE(), verifier.address);
    await sc.grantRole(await sc.FREEZER_ROLE(), freezer.address);
  });

  it("registerBatch + history + getters work", async function () {
    // batch register 2 items
    const names = ["TeaA", "TeaB"];
    const hashes = await Promise.all(
      names.map((n) => sc.getMessageHash(n, client.address))
    );
    const sigs = await Promise.all(
      hashes.map((h) => client.signMessage(ethers.utils.arrayify(h)))
    );

    await sc.connect(client).registerBatch(names, sigs);
    expect(await sc.nextProductId()).to.equal(2);

    // history check
    const hist0 = await sc.getHistory(0);
    expect(hist0[0]).to.equal(client.address);
  });

  it("full lifecycle: register → transfer → verify → freeze → unfreeze → read", async function () {
    // register single
    const pName = "ItemX";
    const h = await sc.getMessageHash(pName, client.address);
    const s = await client.signMessage(ethers.utils.arrayify(h));
    await sc.connect(client).registerProduct(pName, s);

    // transfer
    const th = await sc.getTransferHash(0, transporter.address, client.address);
    const ts = await client.signMessage(ethers.utils.arrayify(th));
    await sc.connect(transporter).transferProduct(0, transporter.address, ts);

    // verify
    await sc.connect(verifier).verifyProduct(0);
    let res = await sc.getProduct(0);
    expect(res[2]).to.equal(transporter.address);
    expect(res[3]).to.equal(true);

    // freeze
    await sc.connect(freezer).freezeProduct(0);
    await expect(
      sc.connect(verifier).verifyProduct(0)
    ).to.be.revertedWith("Product is frozen");

    // unfreeze & re-verify
    await sc.connect(freezer).unfreezeProduct(0);
    await sc.connect(verifier).verifyProduct(0);
    res = await sc.getProduct(0);
    expect(res[4]).to.equal(false); // frozen = false
  });
});
