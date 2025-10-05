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
                {events.length === 0 ? (
                    <li style={{ color: "#888" }}>No events yet...</li>
                ) : (
                    events.map((e, i) => (
                        <li key={i}>
                            <b>[{e.time}]</b> {e.event} — <i>{e.details}</i>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
}
