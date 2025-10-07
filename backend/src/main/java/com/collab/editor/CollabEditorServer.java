package com.collab.editor;

import java.io.ByteArrayOutputStream;
import java.nio.ByteBuffer;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

import javax.websocket.CloseReason;
import javax.websocket.EndpointConfig;
import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;

/**
 * WebSocket endpoint that relays binary Automerge changes to all other clients.
 * - Expects binary messages (Automerge change blobs) as ByteBuffer.
 * - Broadcasts the same binary to all OTHER connected sessions.
 * - Keeps a thread-safe sessions set.
 *
 * Note: This endpoint intentionally does not decode or persist Automerge data.
 */
@ServerEndpoint(value = "/collaboration")
public class CollabEditorServer {

    // Thread-safe set of sessions
    private static final Set<Session> sessions = ConcurrentHashMap.newKeySet();

    @OnOpen
    public void onOpen(Session session, EndpointConfig config) {
        sessions.add(session);
        session.setMaxBinaryMessageBufferSize(4 * 1024 * 1024); // 4 MB (adjust as needed)
        System.out.println("[collab] Connected: " + session.getId() + " (total: " + sessions.size() + ")");
    }

    @OnMessage
    public void onBinaryMessage(ByteBuffer message, Session sender) {
        if (message == null || !message.hasRemaining())
            return;

        // We will broadcast the exact binary payload to all other sessions.
        // Make a copy of the ByteBuffer bytes since the same ByteBuffer may be reused.
        byte[] bytes;
        if (message.hasArray()) {
            // Direct array access if available
            bytes = message.array();
        } else {
            // Copy remaining bytes to array
            ByteArrayOutputStream baos = new ByteArrayOutputStream(message.remaining());
            byte[] buffer = new byte[8192];
            while (message.hasRemaining()) {
                int chunk = Math.min(buffer.length, message.remaining());
                message.get(buffer, 0, chunk);
                baos.write(buffer, 0, chunk);
            }
            bytes = baos.toByteArray();
        }

        // Broadcast to all other clients
        for (Session s : sessions) {
            if (!s.isOpen() || s.equals(sender))
                continue;
            try {
                // Use async send to avoid blocking the server thread
                s.getAsyncRemote().sendBinary(ByteBuffer.wrap(bytes));
            } catch (Exception ex) {
                System.err.println("[collab] Failed to send binary to session " + s.getId() + ": " + ex.getMessage());
            }
        }
    }

    @OnMessage
    public void onTextMessage(String text, Session sender) {
        // Optional: handle text commands / control messages if you want.
        // By default we simply log and ignore.
        System.out.println("[collab] Text message from " + sender.getId() + ": " + text);
    }

    @OnClose
    public void onClose(Session session, CloseReason reason) {
        sessions.remove(session);
        System.out.println("[collab] Disconnected: " + session.getId() + " Reason: " + reason + " (total: "
                + sessions.size() + ")");
    }

    @OnError
    public void onError(Session session, Throwable throwable) {
        System.err.println("[collab] Error on session " + (session != null ? session.getId() : "unknown") + ": "
                + throwable.getMessage());
        throwable.printStackTrace();
    }
}
