// src/components/ImageDisplay.jsx
import React from "react";

export default function ImageDisplay({ events = [] }) {
    return (
        <div
            style={{
                maxHeight: "350px",
                overflowY: "auto",
                border: "1px solid #ccc",
                background: "#f8f8f8",
                borderRadius: "6px",
                padding: "8px",
                fontSize: "13px",
            }}
        >
            <h4 style={{ marginBottom: "4px" }}>📡 Event Information</h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {events.map((evt, i) => (
                    <div
                        key={i}
                        className="p-2 border-b border-gray-200 text-sm font-mono bg-gray-50 rounded"
                    >
                        <div>
                            <strong>{evt.type}</strong> — <em>{evt.time}</em>
                        </div>
                        <div className="text-gray-700 break-all">
                            {typeof evt.details === "string"
                                ? evt.details
                                : JSON.stringify(evt.details)}
                        </div>
                    </div>
                ))}
            </ul>
        </div>
    );
}
