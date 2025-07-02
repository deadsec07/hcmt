const express = require('express');
const bodyParser = require('body-parser');
const { subscribe } = require('./auth');
const {
  relayRegister,
  relayTransfer,
  relayVerify,
  relayFreeze,
  relayUnfreeze
} = require('./relay');
const { contract } = require('./config');
const ethers = require('ethers');

const app = express();
app.use(bodyParser.json());

// 1. Subscription endpoint
app.post('/subscribe', async (req, res) => {
  const { address } = req.body;
  if (!address) return res.status(400).json({ error: 'address required' });
  try {
    const tx = await subscribe(address);
    res.json({ txHash: tx.hash });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// 2. Register product
app.post('/register', async (req, res) => {
  const { name, signature } = req.body;
  if (!name || !signature) return res.status(400).json({ error: 'name & signature required' });
  try {
    const tx = await relayRegister(name, signature);
    res.json({ txHash: tx.hash });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// 3. Transfer product
app.post('/transfer', async (req, res) => {
  const { id, to, signature } = req.body;
  if (id === undefined || !to || !signature) return res.status(400).json({ error: 'id, to & signature required' });
  try {
    const tx = await relayTransfer(id, to, signature);
    res.json({ txHash: tx.hash });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// 4. Verify product
app.post('/verify', async (req, res) => {
  const { id } = req.body;
  if (id === undefined) return res.status(400).json({ error: 'id required' });
  try {
    const tx = await relayVerify(id);
    res.json({ txHash: tx.hash });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// 5. Freeze / Unfreeze
app.post('/freeze', async (req, res) => {
  const { id } = req.body;
  if (id === undefined) return res.status(400).json({ error: 'id required' });
  try {
    const tx = await relayFreeze(id);
    res.json({ txHash: tx.hash });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
app.post('/unfreeze', async (req, res) => {
  const { id } = req.body;
  if (id === undefined) return res.status(400).json({ error: 'id required' });
  try {
    const tx = await relayUnfreeze(id);
    res.json({ txHash: tx.hash });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// 6. Read product + history
app.get('/product/:id', async (req, res) => {
  const id = parseInt(req.params.id);

  // 👇 Guard against an unset or zero contract address
  if (contract.address === ethers.constants.AddressZero) {
    return res.status(500).json({ error: 'Invalid contract address' });
  }

  try {
    const [pid, name, ownerAddr, verified, frozen, registeredAt] =
      await contract.getProduct(id);
    const history = await contract.getHistory(id);
    res.json({
      id: pid.toString(),
      name,
      currentOwner: ownerAddr,
      verified,
      frozen,
      registeredAt: registeredAt.toNumber(),
      history
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});


// Only start the server if this file is run directly
if (require.main === module) {
  const port = process.env.PORT || 3001;
  app.listen(port, () => console.log(`Backend listening on ${port}`));
}

module.exports = app;


