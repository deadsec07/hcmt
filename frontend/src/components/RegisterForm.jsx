import React, { useState } from 'react';
import { ethers } from 'ethers';
import { getMessageHash, registerProduct } from '../utils/api';

export default function RegisterForm() {
  const [name, setName] = useState('');
  const [status, setStatus] = useState('');

  const onSubmit = async () => {
    try {
      setStatus('Initializing wallet...');
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      setStatus('Signing...');
      const hash = await getMessageHash(name);
      const signature = await signer.signMessage(ethers.utils.arrayify(hash));

      setStatus('Registering...');
      const res = await registerProduct(name, signature);
      setStatus(res.txHash ? 'Registered!' : `Error: ${res.error}`);
    } catch (e) {
      setStatus(e.message);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Register Product</h2>
      <input
        className="w-full mb-2 p-2 border rounded"
        placeholder="Product Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button
        onClick={onSubmit}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"  // **bg-blue-600**, **hover:bg-blue-700** editable for button color
      >
        Register
      </button>
      <p className="mt-2 text-gray-700">{status}</p>
    </div>
  );
}
