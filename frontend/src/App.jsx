import React, { useEffect } from 'react';
import RegisterForm from './components/RegisterForm';
import TransferForm from './components/TransferForm';
import VerifyForm from './components/VerifyForm';
import ProductView from './components/ProductView';
import AdminPanel from './components/AdminPanel';

export default function App() {
  useEffect(() => {
    document.title = 'HCMT Supply Chain Dashboard';
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow mb-6">
        <div className="max-w-7xl mx-auto py-6 px-4">
          <h1 className="text-3xl font-bold text-gray-900">HCMT Supply Chain Dashboard</h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 grid gap-8 md:grid-cols-2">
        <RegisterForm />
        <TransferForm />
        <VerifyForm />
        <ProductView />
        <AdminPanel />
      </main>
    </div>
  );
}
