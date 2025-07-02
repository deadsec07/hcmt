import React, { useState } from 'react';
import { getProduct } from '../utils/api';

export default function ProductView() {
  const [id, setId] = useState('');
  const [data, setData] = useState(null);

  const onFetch = async () => {
    try {
      const res = await getProduct(id);
      setData(res);
    } catch (e) {
      setData({ error: e.message });
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Product Info</h2>
      <input
        type="number"
        className="w-full mb-2 p-2 border rounded"
        placeholder="Product ID"
        value={id}
        onChange={(e) => setId(e.target.value)}
      />
      <button
        onClick={onFetch}
        className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"  // editable
      >
        Fetch
      </button>
      {data && (
        <pre className="mt-4 text-sm text-gray-800 whitespace-pre-wrap">{JSON.stringify(data, null, 2)}</pre>
      )}
    </div>
  );
}
