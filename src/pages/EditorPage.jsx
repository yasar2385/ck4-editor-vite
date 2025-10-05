import React from 'react';
import Header from '../components/Header';
import NavbarPrimary from '../components/NavbarPrimary';
import NavbarSecondary from '../components/NavbarSecondary';
import TocPanel from '../components/TocPanel';
import CKEditor4Wrapper from '../components/CKEditor4Wrapper';
import ImageDisplay from '../components/ImageDisplay';
import ThumbnailPanel from '../components/ThumbnailPanel';
import Footer from '../components/Footer';

export default function EditorPage() {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Header title="SmartDocs Editor" />

            {/* Navbars */}
            <div className="z-10 shadow-sm bg-white">
                <NavbarPrimary />
                <NavbarSecondary />
            </div>

            {/* Main Editor Layout */}
            <main className="flex flex-1 flex-col xl:flex-row overflow-hidden">
                {/* 1️⃣ TOC */}
                <aside className="xl:w-1/6 border-r bg-gray-100 p-4 overflow-auto">
                    <TocPanel />
                </aside>

                {/* 2️⃣ CKEditor Panel */}
                <section className="flex-1 bg-white p-4 overflow-auto">
                    <CKEditor4Wrapper id="mainEditor" data="<p>Start writing...</p>" />
                </section>

                {/* 3️⃣ Image Display */}
                <aside className="xl:w-1/4 border-l bg-white p-4 overflow-auto">
                    <ImageDisplay />
                </aside>

                {/* 4️⃣ Thumbnails */}
                <aside className="xl:w-1/5 border-l bg-gray-50 p-4 overflow-auto">
                    <ThumbnailPanel />
                </aside>
            </main>

            <Footer fixed />
        </div>
    );
}
