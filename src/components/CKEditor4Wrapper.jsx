import React, { useEffect, useRef } from "react";
import {
    ReportTemplate,
    ArticleTemplate,
    MeetingNotesTemplate,
    ProductOverviewTemplate,
} from "./customTemplates/index";

import { editorConfig, defaultUserData } from "./customTemplates/editorConfig";

export default function CKEditor4Wrapper({
    id = "editor1",
    data = "",
    onChange,
    onEvent,
}) {
    const editorRef = useRef(null);
    const eventHandlerRef = useRef(onEvent); // ✅ keep onEvent stable
    const dataRef = useRef(data);

    // Keep onEvent ref updated without re-running effect
    useEffect(() => {
        eventHandlerRef.current = onEvent;
    }, [onEvent]);

    // Initialize editor ONCE
    useEffect(() => {
        const scriptId = "ckeditor4-script";

        // Load script if not already loaded
        if (!document.getElementById(scriptId)) {
            const script = document.createElement("script");
            script.id = scriptId;
            script.src = "/ckeditor/ckeditor.js";
            script.onload = initEditor;
            document.body.appendChild(script);
        } else {
            initEditor();
        }

        function sendEvent(eventName, details = "") {
            const eventData = {
                time: new Date().toLocaleTimeString(),
                event: eventName,
                details,
            };
            if (typeof eventHandlerRef.current === "function") {
                eventHandlerRef.current(eventData);
            }
        }

        function initEditor() {
            if (!window.CKEDITOR) return;
            if (editorRef.current) return; // ✅ prevent reinit if already exists

            // Destroy any old instance with same ID
            if (window.CKEDITOR.instances[id]) {
                window.CKEDITOR.instances[id].destroy(true);
            }

            const templates = [
                ReportTemplate("Alex_Designer"),
                ArticleTemplate("Exploring Modern Editors", "Maria_Writer"),
                MeetingNotesTemplate("Weekly Project Sync"),
                ProductOverviewTemplate("CKEditor Integration Demo"),
            ];
            const initialData =
                dataRef.current || templates[Math.floor(Math.random() * templates.length)];

            const instance = window.CKEDITOR.replace(id, editorConfig);
            
            window.GlobalEditor = instance;

            instance.on("instanceReady", () => {
                instance.setData(initialData);
                sendEvent("instanceReady", "Editor initialized");

                const lite = instance.plugins.lite;
                if (lite?.setUserData) lite.setUserData(defaultUserData);
                else if (lite?._config) {
                    lite._config.userId = defaultUserData.id;
                    lite._config.userColor = defaultUserData.color;
                }
            });

            // Core events
            instance.on("change", () => {
                const val = instance.getData();
                sendEvent("change", "Content updated");
                if (onChange) onChange(val);
            });

            instance.on("selectionChange", (evt) => {
                sendEvent(
                    "selectionChange",
                    evt.data?.path?.lastElement?.getName?.() || "unknown"
                );
            });

            instance.on("key", (evt) => sendEvent("key", `KeyCode: ${evt.data.keyCode}`));

            instance.on("beforeCommandExec", (evt) =>
                sendEvent("beforeCommandExec", evt.data.name)
            );
            instance.on("afterCommandExec", (evt) =>
                sendEvent("afterCommandExec", evt.data.name)
            );

            instance.on("lite:init", () => sendEvent("lite:init", "Lite initialized"));

            // DOM-level events
            instance.on("contentDom", (evt) => {
                const editable = evt.editor.editable();
                ["cut", "copy", "keyup", "click", "paste", "mousedown"].forEach((type) => {
                    editable.on(type, (domEvt) => {
                        const target = domEvt.data?.getTarget?.()?.getName?.() || "text";
                        sendEvent(`DOM:${type}`, target);
                    });
                });
            });

            editorRef.current = instance;
        }

        // Cleanup only on unmount
        return () => {
            if (editorRef.current) {
                editorRef.current.destroy(true);
                editorRef.current = null;
            }
        };
    }, [id]); // ✅ only reinitialize if ID changes

    // Optional: update data dynamically if it changes externally
    useEffect(() => {
        if (editorRef.current && data !== dataRef.current) {
            const instance = editorRef.current;
            dataRef.current = data;
            if (instance.getData() !== data) {
                instance.setData(data);
            }
        }
    }, [data]);

    return <textarea id={id} defaultValue={data}></textarea>;
}
