package com.collab.editor;

import org.glassfish.tyrus.server.Server;

import com.ai.chat.IntelligentChatServer;

public class MainServer {
    public static void main(String[] args) {

        Server server = new Server("localhost", 8025, "/", null,
                CollabEditorServer.class,
                IntelligentChatServer.class,
                CollabServer.class);

        try {
            server.start();
            System.out.println("✅ WebSocket server started:");
            System.out.println("   • Old Collab Editor → ws://localhost:8025/old_collab");
            System.out.println("   • Collab Editor → ws://localhost:8025/collaboration");
            System.out.println("   • Intelligent Chat → ws://localhost:8025/intelligent-chat");
            Thread.sleep(Long.MAX_VALUE);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            server.stop();
        }
    }
}
