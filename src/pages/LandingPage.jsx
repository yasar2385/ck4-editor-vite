import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function LandingPage() {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Header title="SmartDocs Portal" />

            <main className="flex flex-1 flex-col md:flex-row items-stretch px-6 py-8 gap-6">
                {/* Left Panel: Introduction + Button */}
                <section className="flex-1 flex flex-col justify-center bg-white rounded-lg shadow p-6">
                    <h1 className="text-3xl font-semibold mb-4 text-blue-700">Welcome to SmartDocs</h1>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                        Streamline your documentation, editing, and review process in one unified platform.
                        Accept the terms to continue to your workspace.
                    </p>
                    <button className="self-start bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700">
                        Accept / Continue
                    </button>
                </section>

                {/* Right Panel: Document Info */}
                <section className="flex-1 bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-3">Document Details</h2>
                    <ul className="text-gray-700 space-y-2">
                        <li><strong>Title:</strong> Research Paper Draft</li>
                        <li><strong>Version:</strong> v5.00.25</li>
                        <li><strong>Created by:</strong> John Doe</li>
                        <li><strong>Last Modified:</strong> Oct 04, 2025</li>
                    </ul>
                </section>
            </main>

            <Footer />
        </div>
    );
}
