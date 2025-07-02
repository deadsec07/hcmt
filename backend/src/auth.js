const { contract } = require('./config');

async function subscribe(address) {
  // Grant CLIENT_ROLE to a new subscriber
  const role = await contract.CLIENT_ROLE();
  const tx   = await contract.grantRole(role, address);
  await tx.wait();
  return tx;
}

module.exports = { subscribe };
