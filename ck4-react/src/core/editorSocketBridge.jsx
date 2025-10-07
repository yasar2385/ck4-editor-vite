/**
 * src/core/editorSocketBridge.jsx
 * Unified CKEditor event + Automerge + WebSocket handler
 * Using Automerge.load() for better CRDT state management
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
  const docRef = useRef(null);
  const headRef = useRef(null); // Track document head for merge conflicts
  const applyingRemote = useRef(false);
  const pendingChanges = useRef(new Map()); // Track local changes

  // Initialize empty doc on first load
  const initializeDoc = useCallback(() => {
    if (!docRef.current) {
      docRef.current = Automerge.init();
      docRef.current = Automerge.change(docRef.current, (d) => {
        d.html = "";
        d.lastUser = userId;
        d.updatedAt = new Date().toISOString();
        d.version = 0;
      });
    }
  }, [userId]);

  // ✅ Better approach: Merge remote changes into document state
  const { sendMessage } = useSocket("/collaboration", async (msg) => {
    if (msg.type === "binary" && msg.data) {
      try {
        applyingRemote.current = true;

        // Load the remote document from binary
        const remoteDoc = Automerge.load(msg.data);

        if (!docRef.current) {
          // First sync: use remote doc as base
          docRef.current = remoteDoc;
          headRef.current = Automerge.getHeads(docRef.current);
        } else {
          // Merge remote changes into local doc
          docRef.current = Automerge.merge(docRef.current, remoteDoc);
          headRef.current = Automerge.getHeads(docRef.current);
        }

        // Extract updated content
        const docState = Automerge.toJS(docRef.current);
        const newHTML = docState.html || "";

        console.log("📥 Remote change merged:", {
          newHTML,
          lastUser: docState.lastUser,
          updatedAt: docState.updatedAt,
        });

        // Update editor only if content changed
        const editor = editorRef.current;
        if (editor) {
          const current = editor.getData();
          if (newHTML !== current && newHTML.trim() !== current.trim()) {
            editor.setData(newHTML, {
              callback: () => {
                applyingRemote.current = false;
              },
            });
            emitEvent("remoteUpdate", {
              length: newHTML.length,
              user: docState.lastUser,
            });
          } else {
            applyingRemote.current = false;
          }
        }
      } catch (err) {
        console.error("⚠️ Failed to merge Automerge change:", err);
        applyingRemote.current = false;
      }
    }
  });

  // Emit debug/info event
  const emitEvent = (type, details = {}) =>
    typeof onEditorEvent === "function" &&
    onEditorEvent({ type, details, time: new Date().toLocaleTimeString() });

  // 🔹 Editor change → Automerge change → send full doc state
  const handleEditorChange = useDebounce(() => {
    const editor = editorRef.current;
    if (!editor || applyingRemote.current) return;

    const html = editor.getData();

    try {
      // Clone document if it's outdated before making changes
      let workingDoc = docRef.current;
      if (Automerge.getHeads(workingDoc).length > 0) {
        workingDoc = Automerge.clone(workingDoc);
      }

      // Update document with change
      const nextDoc = Automerge.change(workingDoc, (d) => {
        d.html = html;
        d.lastUser = userId;
        d.updatedAt = new Date().toISOString();
        d.version = (d.version || 0) + 1;
      });

      docRef.current = nextDoc;
      headRef.current = Automerge.getHeads(docRef.current);

      // Send as binary snapshot for better merge resolution
      const binary = Automerge.save(nextDoc);
      sendMessage(binary); // Send raw Uint8Array directly

      emitEvent("localChange", {
        length: html.length,
        version: nextDoc.version || 1,
      });
    } catch (err) {
      console.error("⚠️ Failed to save doc:", err);
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

      // Initialize document
      initializeDoc();

      // Set initial editor content from doc
      const docState = Automerge.toJS(docRef.current);
      if (docState.html) {
        instance.setData(docState.html);
      }

      instance.on("change", handleEditorChange);
      instance.on("key", handleEditorChange);
      instance.on("paste", handleEditorChange);
      instance.on("click", handleClick);

      emitEvent("bind", { message: "Editor events bound with CRDT merge strategy" });
    },
    [handleEditorChange, initializeDoc]
  );

  return { bindEditorEvents };
}