import React, { useState } from 'react';
import { ethers } from 'ethers';
import { getTransferHash, transferProduct } from '../utils/api';

export default function TransferForm() {
  const [id, setId] = useState('');
  const [to, setTo] = useState('');
  const [status, setStatus] = useState('');

  const onSubmit = async () => {
    try {
      setStatus('Initializing wallet...');
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      setStatus('Signing...');
      const hash = await getTransferHash(id, to);
      const signature = await signer.signMessage(ethers.utils.arrayify(hash));

      setStatus('Transferring...');
      const res = await transferProduct(id, to, signature);
      setStatus(res.txHash ? 'Transferred!' : `Error: ${res.error}`);
    } catch (e) {
      setStatus(e.message);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Transfer Product</h2>
      <input
        type="number"
        className="w-full mb-2 p-2 border rounded"
        placeholder="Product ID"
        value={id}
        onChange={(e) => setId(e.target.value)}
      />
      <input
        className="w-full mb-2 p-2 border rounded"
        placeholder="New Owner Address"
        value={to}
        onChange={(e) => setTo(e.target.value)}
      />
      <button
        onClick={onSubmit}
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"  // editable
      >
        Transfer
      </button>
      <p className="mt-2 text-gray-700">{status}</p>
    </div>
  );
}