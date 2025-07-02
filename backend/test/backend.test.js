const request = require('supertest');
const { expect } = require('chai');
let app;

describe('HCMT Backend API', () => {
  before(() => {
    process.env.RPC_URL = 'http://127.0.0.1:8545';
    process.env.PRIVATE_KEY = '0x' + '11'.repeat(32); // dummy key for startup
    process.env.CONTRACT_ADDRESS = '0x0000000000000000000000000000000000000000';
    app = require('../src/index');
  });

  it('POST /subscribe 400 on missing address', async () => {
    const res = await request(app).post('/subscribe').send({});
    expect(res.status).to.equal(400);
  });

  it('POST /register 400 on missing name', async () => {
    const res = await request(app).post('/register').send({ signature: '0x00' });
    expect(res.status).to.equal(400);
  });

  it('POST /transfer 400 on missing params', async () => {
    const res = await request(app).post('/transfer').send({ id: 0 });
    expect(res.status).to.equal(400);
  });

  it('GET /product/:id 500 on invalid contract', async () => {
    const res = await request(app).get('/product/0');
    expect(res.status).to.equal(500);
  });
});
