const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export async function getMessageHash(name) {
  const res = await fetch(`${BACKEND_URL}/rpc/getMessageHash`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name })
  });
  return res.json();
}

export async function registerProduct(name, signature) {
  const res = await fetch(`${BACKEND_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, signature })
  });
  return res.json();
}

export async function getTransferHash(id, to) {
  const res = await fetch(`${BACKEND_URL}/rpc/getTransferHash`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, to })
  });
  return res.json();
}

export async function transferProduct(id, to, signature) {
  const res = await fetch(`${BACKEND_URL}/transfer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, to, signature })
  });
  return res.json();
}

export async function verifyProduct(id) {
  const res = await fetch(`${BACKEND_URL}/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id })
  });
  return res.json();
}

export async function getProduct(id) {
  const res = await fetch(`${BACKEND_URL}/product/${id}`);
  return res.json();
}
