package com.ai.chat;

import java.io.IOException;
import java.util.concurrent.CopyOnWriteArraySet;

import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;

import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPubSub;

/**
 * Intelligent Chat Assistance WebSocket Server
 * Channel: intelligent_chat_channel
 */
@ServerEndpoint("/intelligent-chat")
public class IntelligentChatServer {

    private static final CopyOnWriteArraySet<Session> sessions = new CopyOnWriteArraySet<>();
    private static final String CHANNEL = "intelligent_chat_channel";

    static {
        // Redis Subscriber Thread
        new Thread(() -> {
            try (Jedis jedis = new Jedis("localhost", 6379)) {
                jedis.subscribe(new JedisPubSub() {
                    @Override
                    public void onMessage(String channel, String message) {
                        if (CHANNEL.equals(channel)) {
                            for (Session session : sessions) {
                                try {
                                    session.getBasicRemote().sendText(message);
                                } catch (IOException e) {
                                    e.printStackTrace();
                                }
                            }
                        }
                    }
                }, CHANNEL);
            }
        }, "Chat-Redis-Subscriber").start();
    }

    @OnOpen
    public void onOpen(Session session) {
        sessions.add(session);
        System.out.println("[Chat] Connected: " + session.getId());
    }

    @OnMessage
    public void onMessage(String message, Session session) {
        System.out.println("[Chat] Message: " + message);
        try (Jedis jedis = new Jedis("localhost", 6379)) {
            jedis.publish(CHANNEL, message);

            // TODO LATER:
            // Here we can detect messages like "@assistant" or "/suggest"
            // and forward them to your LLM backend pipeline.
        }
    }

    @OnClose
    public void onClose(Session session) {
        sessions.remove(session);
        System.out.println("[Chat] Disconnected: " + session.getId());
    }

    @OnError
    public void onError(Session session, Throwable throwable) {
        System.err.println("[Chat] Error: " + throwable.getMessage());
        throwable.printStackTrace();
    }
}
