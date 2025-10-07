// ck4-react/src/pages/EditorPage.jsx
import React, { useState } from "react";

import Header from "../components/Header";
import NavbarSecondary from "../components/NavbarSecondary";
import TocPanel from "../components/TocPanel";
import CKEditor4Wrapper from "../components/CKEditor4Wrapper";
import ImageDisplay from "../components/ImageDisplay";
import ThumbnailPanel from "../components/ThumbnailPanel";
import Footer from "../components/Footer";

export default function EditorPage() {
    const [events, setEvents] = useState([]);
    const [editorInstance, setEditorInstance] = useState(null);

    const handleEditorEvent = (evtData) => {
        // evtData = { time, event, details }
        setEvents((prev) => [evtData, ...prev.slice(0, 49)]); // keep last 50
    };

    // Set global context
    window.DOMAIN_ROOT = "www.smartdocs.ai";
    window.iKEY_EVENT_HANDLING = {
        CHECK_IGNORE_LITE_TRACK: () => false,
    };
    window.USER_INFO = {
        MAIL_ID: "durairajan.gnanam@nkw.pub",
        DISNAME: "Durairajan Gnanam",
        ROLE_NAME: "Collator",
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Header fixed title="CK4 SmartDocs" />

            {/* Navbar */}
            <div className="z-10 shadow-sm bg-white">
                <NavbarSecondary />
            </div>

            {/* Main layout */}
            <main className="flex flex-1 flex-col xl:flex-row overflow-hidden">
                {/* 1️⃣ TOC */}
                <aside className="xl:w-1/8 border-r bg-gray-100 p-4 overflow-auto">
                    <TocPanel />
                </aside>

                {/* 2️⃣ CKEditor Panel */}
                <section className="xl:w-1/2 flex-1 bg-white p-4 overflow-auto">
                    <CKEditor4Wrapper
                        id="mainEditor"
                        onEvent={handleEditorEvent}
                        refCallback={(instance) => setEditorInstance(instance)}
                    />
                    <div className="text-sm mt-2 text-gray-500">
                        Collaboration active 🟢
                    </div>
                </section>

                {/* 3️⃣ Image Display */}
                <aside className="xl:w-1/4 border-l bg-white p-4 overflow-auto">
                    <ImageDisplay events={events} />
                </aside>

                {/* 4️⃣ Thumbnails */}
                <aside className="xl:w-1/10 border-l bg-gray-50 p-4 overflow-auto">
                    <ThumbnailPanel />
                </aside>
            </main>

            <Footer fixed />
        </div>
    );
}
