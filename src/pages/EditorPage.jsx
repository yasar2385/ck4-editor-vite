import React, { useState } from "react";

import Header from '../components/Header';
import NavbarPrimary from '../components/NavbarPrimary';
import NavbarSecondary from '../components/NavbarSecondary';
import TocPanel from '../components/TocPanel';
import CKEditor4Wrapper from '../components/CKEditor4Wrapper';
import ImageDisplay from '../components/ImageDisplay';
import ThumbnailPanel from '../components/ThumbnailPanel';
import Footer from '../components/Footer';

export default function EditorPage() {
    const [events, setEvents] = useState([]);

    const handleEditorEvent = (evtData) => {
        // evtData = { time, event, details }
        setEvents((prev) => [evtData, ...prev.slice(0, 49)]); // keep last 50
    };
    window.DOMAIN_ROOT = "www.smartdocs.ai";
    window.iKEY_EVENT_HANDLING = {
        CHECK_IGNORE_LITE_TRACK: () => false
    };
    window.USER_INFO = {
        "MAIL_ID": "durairajan.gnanam@nkw.pub",
        "USER_ID": null,
        "HAS_COLLAB_WORKFLOW": false,
        "IS_ADMIN": false,
        "MAIL_ID_PREFIX": "durairajan.gnanam",
        "DISNAME": "Durairajan Gnanam",
        "ROLE_ID": "5bcf15b1cf510152afba028a",
        "ROLE_NAME": "Collator",
        "SELECTOR_BKUP_FOLDER": "5bcf15b1cf510152afba028a_CO",
        "SELECTOR_SHOW_HIDE": "showForCO",
        "IS_CO_ROLE": false,
        "TRACK_ROLE_NAME": "Collator",
        "IS_AUTHOR": false,
        "SELECTOR_RESTRICT": "null",
        "TOUR": 1
    }



    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Header title="SmartDocs CKEditor-4" />

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
                <section className="xl:w-1/3 flex-1 bg-white p-4 overflow-auto">
                    <CKEditor4Wrapper id="mainEditor" onEvent={handleEditorEvent} />
                </section>

                {/* 3️⃣ Image Display */}
                <aside className="xl:w-1/3 border-l bg-white p-4 overflow-auto">
                    <ImageDisplay events={events} />
                </aside>

                {/* 4️⃣ Thumbnails */}
                <aside className="xl:w-1/6 border-l bg-gray-50 p-4 overflow-auto">
                    <ThumbnailPanel />
                </aside>
            </main>

            <Footer fixed />
        </div>
    );
}
