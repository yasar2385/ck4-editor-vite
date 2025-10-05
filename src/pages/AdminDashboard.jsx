import React from 'react';
import ReactDOM from 'react-dom/client';
import { getClientConfig } from '../config/client/config';

function AdminDashboard() {
    const config = getClientConfig();

    return (
        <div className="p-6 min-h-screen bg-gray-100">
            <h1 className="text-3xl font-bold text-blue-600 mb-4">⚙️ Admin Dashboard</h1>
            <ul className="bg-white rounded shadow p-4">
                <li>Environment: {config.env}</li>
                <li>Version: {config.version}</li>
                <li>API: {config.apiBaseUrl}</li>
            </ul>
        </div>
    );
}

export default AdminDashboard;