import { LogOut, User, Download, Send } from 'lucide-react';

export default function NavbarPrimary() {
    return (
        <nav className="grid grid-cols-3 items-center px-4 py-2 border-b">
            {/* Left: Download Icons */}
            <div className="flex gap-2 justify-start">
                <button title="Download"><Download className="w-5 h-5" /></button>
            </div>

            {/* Center: Major Action */}
            <div className="flex justify-center">
                <button className="bg-blue-600 text-white px-4 py-1 rounded-lg hover:bg-blue-700">
                    Submit Document
                </button>
            </div>

            {/* Right: Profile / Logout */}
            <div className="flex gap-3 justify-end">
                <button title="Profile"><User className="w-5 h-5" /></button>
                <button title="Logout"><LogOut className="w-5 h-5" /></button>
            </div>
        </nav>
    );
}
