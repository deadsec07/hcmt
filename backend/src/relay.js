const { contract } = require('./config');

async function relayRegister(name, signature) {
  const tx = await contract.registerProduct(name, signature);
  await tx.wait();
  return tx;
}

async function relayTransfer(id, to, signature) {
  const tx = await contract.transferProduct(id, to, signature);
  await tx.wait();
  return tx;
}

async function relayVerify(id) {
  const tx = await contract.verifyProduct(id);
  await tx.wait();
  return tx;
}

async function relayFreeze(id) {
  const tx = await contract.freezeProduct(id);
  await tx.wait();
  return tx;
}

async function relayUnfreeze(id) {
  const tx = await contract.unfreezeProduct(id);
  await tx.wait();
  return tx;
}

module.exports = {
  relayRegister,
  relayTransfer,
  relayVerify,
  relayFreeze,
  relayUnfreeze
};
