
import React from 'react';
import ReactDOM from 'react-dom/client';
import { getClientConfig } from '../config/client/config';

function UserDashboard() {
  const config = getClientConfig();

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-2xl font-semibold mb-4">👤 User Dashboard</h1>
      <p>Welcome, {config.userName || 'Guest'}!</p>
      <p>API Base: {config.apiBaseUrl}</p>
    </div>
  );
}


export default UserDashboard;