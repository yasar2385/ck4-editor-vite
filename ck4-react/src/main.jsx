import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; // ✅ add this import
import App from './App.jsx';
import './index.css';

// ✅ Bootstrap JS bundle (with Popper included)
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// ✅ Import jQuery and make it global
import $ from 'jquery';
window.$ = $;
window.jQuery = $;


import { UserDashboard, AdminDashboard, EditorReadOnlyPage, EditorPage, LiveMessenger, MultiTextareaSync } from './pages/index.js'; // ✅ import the components


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Example routes (uncomment when ready) */}
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/chat" element={<LiveMessenger />} />
        <Route path="/editor" element={<EditorPage />} />
        <Route path="/automerge-demo" element={<MultiTextareaSync />} />

        <Route path="/" element={<App />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
