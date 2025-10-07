import React, { useEffect, useRef, useState } from "react";
import * as Automerge from "@automerge/automerge";

export default function MultiTextareaSync({ initialData = "Welcome! Start editing..." }) {

    initialData = `Monthly Report - October
Prepared by: Alex_Designer
This report provides an overview of the team's progress, challenges, and next steps.
✅ Project milestones achieved
📊 Performance metrics
🧩 Next sprint planning
Generated automatically on 10/7/2025`

    const [text1, setText1] = useState(``);
    const [text2, setText2] = useState("");
    const [text3, setText3] = useState("");

    // Create Automerge doc ref
    const docRef = useRef(Automerge.from({ content: initialData }));
    const lastBinaryRef = useRef(Automerge.save(docRef.current));

    // Update all textareas when doc changes
    const applyDocUpdate = (newDoc) => {
        const content = newDoc.content || "";
        setText1(content);
        setText2(content);
        setText3(content);
    };

    // Handle typing in any textarea
    const handleChange = (index, value) => {
        const newDoc = Automerge.change(docRef.current, "text update", (d) => {
            d.content = value;
        });

        docRef.current = newDoc;
        lastBinaryRef.current = Automerge.save(newDoc);
        applyDocUpdate(newDoc);
    };

    // Load initial data on mount
    useEffect(() => {
        const doc = Automerge.load(lastBinaryRef.current);
        applyDocUpdate(doc);
    }, []);

    return (
        <div style={{ display: "flex", gap: "1rem", padding: "1rem" }}>
            <textarea
                value={text1}
                onChange={(e) => handleChange(1, e.target.value)}
                placeholder="Textarea 1"
                rows={10}
                cols={30}
            />
            <textarea
                value={text2}
                onChange={(e) => handleChange(2, e.target.value)}
                placeholder="Textarea 2"
                rows={10}
                cols={30}
            />
            <textarea
                value={text3}
                onChange={(e) => handleChange(3, e.target.value)}
                placeholder="Textarea 3"
                rows={10}
                cols={30}
            />
        </div>
    );
}
