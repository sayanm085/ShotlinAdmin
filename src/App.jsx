// src/App.jsx
import React from 'react';
import { Toaster } from 'react-hot-toast';
import { Outlet } from 'react-router';

export default function App() {
  return (
    <>
      {/* Your single global Toaster */}
      <Toaster
        position="top-right"
        toastOptions={{ duration: 3000, style: { background: '#333', color: '#fff' } }}
      />

      <div className="flex flex-col min-h-screen">
        <main className="flex-grow">
          <Outlet />
        </main>
      </div>
    </>
  );
}
