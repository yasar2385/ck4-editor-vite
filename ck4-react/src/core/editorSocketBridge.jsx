/**
 * src/core/editorSocketBridge.jsx
 * Unified CKEditor event + Automerge + WebSocket handler
 */

import { useRef, useCallback } from "react";
import * as Automerge from "@automerge/automerge";
import useSocket from "../socket";

// Simple debounce utility
function useDebounce(callback, delay = 400) {
  const timer = useRef(null);
  return useCallback(
    (...args) => {
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => callback(...args), delay);
    },
    [callback, delay]
  );
}

export default function useEditorSocketBridge(
  editorInstance,
  userId = "Guest",
  onEditorEvent
) {
  const editorRef = useRef(null);
  const docRef = useRef(Automerge.init());
  const applyingRemote = useRef(false);

  // ✅ Binary-aware socket
  const { sendMessage } = useSocket("/collaboration", async (msg) => {
    if (msg.type === "binary") {
      try {
        const [newDoc] = Automerge.applyChanges(docRef.current, [msg.data]);
        docRef.current = newDoc;

        const newHTML = newDoc.html || "";
        const editor = editorRef.current;
        if (editor && !applyingRemote.current) {
          const current = editor.getData();
          if (newHTML !== current) {
            applyingRemote.current = true;
            editor.setData(newHTML, {
              callback: () => (applyingRemote.current = false),
            });
            emitEvent("remoteUpdate", { length: newHTML.length });
          }
        }
      } catch (err) {
        console.error("⚠️ Failed to apply Automerge change:", err);
      }
    }
  });

  // Emit debug/info event
  const emitEvent = (type, details = {}) =>
    typeof onEditorEvent === "function" &&
    onEditorEvent({ type, details, time: new Date().toLocaleTimeString() });

  // 🔹 Editor change → Automerge change → binary send
  const handleEditorChange = useDebounce(() => {
    const editor = editorRef.current;
    if (!editor || applyingRemote.current) return;

    const html = editor.getData();
    const prevDoc = docRef.current;
    const nextDoc = Automerge.change(prevDoc, (d) => {
      d.html = html;
      d.lastUser = userId;
      d.updatedAt = new Date().toISOString();
    });

    const change = Automerge.getLastLocalChange(nextDoc);
    docRef.current = nextDoc;

    if (change) {
      sendMessage(change); // ✅ send raw Uint8Array
      emitEvent("localChange", { length: html.length });
    }
  }, 500);

  // 🔹 Optional click tracking
  const handleClick = (evt) => {
    const para = evt.data?.getTarget?.()?.getAscendant("p", true);
    const paraId = para?.getId?.() || para?.getUniqueId?.() || "unknown";
    emitEvent("click", { paragraphId: paraId });
  };

  // 🔹 Bind editor once
  const bindEditorEvents = useCallback(
    (instance) => {
      if (!instance || editorRef.current === instance) return;
      editorRef.current = instance;

      // Initialize Automerge doc with current data
      docRef.current = Automerge.change(docRef.current, (d) => {
        d.html = instance.getData();
        d.lastUser = userId;
      });

      instance.on("change", handleEditorChange);
      instance.on("key", handleEditorChange);
      instance.on("paste", handleEditorChange);
      instance.on("click", handleClick);

      emitEvent("bind", { message: "Editor events bound (Automerge)" });
    },
    [handleEditorChange]
  );

  return { bindEditorEvents };
}
