/**
 * socket.jsx
 * WebSocket utility for Collab (binary) + Intelligent Chat (JSON/text)
 */

import { useEffect, useRef } from "react";

/**
 * Generic WebSocket hook
 * @param {string} endpoint - e.g. "/collaboration" or "/intelligent-chat"
 * @param {function} onMessage - Callback when message received
 * @param {function} onStatusChange - Optional connection status handler
 */
export default function useSocket(endpoint, onMessage, onStatusChange) {
  const ws = useRef(null);
  const reconnectTimer = useRef(null);

  const connect = () => {
    const socket = new WebSocket(`ws://localhost:8025${endpoint}`);

    // ✅ Only collaboration endpoint uses binary (Automerge)
    if (endpoint === "/collaboration") {
      socket.binaryType = "arraybuffer";
    }

    ws.current = socket;

    socket.onopen = () => {
      console.log(`✅ Connected to ${endpoint}`);
      onStatusChange?.("connected");
    };

    socket.onclose = () => {
      console.warn(`❌ Disconnected from ${endpoint}`);
      onStatusChange?.("disconnected");
      reconnectTimer.current = setTimeout(connect, 2000); // auto-reconnect
    };

    socket.onerror = (err) => {
      console.error(`⚠️ WebSocket error (${endpoint}):`, err);
      onStatusChange?.("error");
    };

    socket.onmessage = (event) => {
      try {
        // 🧩 Binary message — only for collaboration endpoint
        if (endpoint === "/collaboration" && event.data instanceof ArrayBuffer) {
          const bytes = new Uint8Array(event.data);
          onMessage({ type: "binary", data: bytes });
          return;
        }

        // 🧩 Fallback to JSON or plain text
        const parsed = JSON.parse(event.data);
        onMessage(parsed);
      } catch {
        onMessage({ type: "text", data: event.data });
      }
    };
  };

  useEffect(() => {
    connect();
    return () => {
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
      ws.current?.close();
    };
  }, [endpoint]);

  /**
   * Send message
   * Supports raw binary for collaboration, JSON/text otherwise
   */
  const sendMessage = (data) => {
    const socket = ws.current;
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      console.warn(`🚫 Cannot send: ${endpoint} not open`);
      return;
    }

    // 🧩 Collaboration endpoint — send raw binary
    if (endpoint === "/collaboration" && (data instanceof Uint8Array || data instanceof ArrayBuffer)) {
      socket.send(data);
      return;
    }

    // 🧩 Other endpoints — JSON or text
    if (typeof data === "object") socket.send(JSON.stringify(data));
    else socket.send(String(data));
  };

  return { sendMessage };
}
