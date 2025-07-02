import React, { useState } from 'react';

export default function VerifyForm() {
  const [id, setId] = useState('');
  const [status, setStatus] = useState('');

  const onSubmit = async () => {
    try {
      setStatus('Verifying...');
      const res = await verifyProduct(id);
      setStatus(res.txHash ? 'Verified!' : `Error: ${res.error}`);
    } catch (e) {
      setStatus(e.message);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Verify Product</h2>
      <input
        type="number"
        className="w-full mb-2 p-2 border rounded"
        placeholder="Product ID"
        value={id}
        onChange={(e) => setId(e.target.value)}
      />
      <button
        onClick={onSubmit}
        className="w-full bg-yellow-600 text-white py-2 rounded hover:bg-yellow-700"  // editable
      >
        Verify
      </button>
      <p className="mt-2 text-gray-700">{status}</p>
    </div>
  );
}
