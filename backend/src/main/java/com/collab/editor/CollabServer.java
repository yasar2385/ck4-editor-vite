package com.collab.editor;

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

@ServerEndpoint("/collab")
public class CollabServer {

    private static final CopyOnWriteArraySet<Session> sessions = new CopyOnWriteArraySet<>();
    private static final String CHANNEL = "collab_channel";

    static {
        new Thread(() -> {
            try (Jedis jedis = new Jedis("localhost", 6379)) {
                jedis.subscribe(new JedisPubSub() {
                    @Override
                    public void onMessage(String channel, String message) {
                        if (CHANNEL.equals(channel)) {
                            sessions.forEach(session -> {
                                try {
                                    session.getBasicRemote().sendText(message);
                                } catch (IOException e) {
                                    e.printStackTrace();
                                }
                            });
                        }
                    }
                }, CHANNEL);
            }
        }).start();
    }

    @OnOpen
    public void onOpen(Session session) {
        sessions.add(session);
        System.out.println("Connected: " + session.getId());
    }

    @OnMessage
    public void onMessage(String message, Session session) {
        System.out.println("Received: " + message);
        try (Jedis jedis = new Jedis("localhost", 6379)) {
            jedis.publish(CHANNEL, message);
        }
    }

    @OnClose
    public void onClose(Session session) {
        sessions.remove(session);
        System.out.println("Disconnected: " + session.getId());
    }

    @OnError
    public void onError(Session session, Throwable throwable) {
        throwable.printStackTrace();
    }
}
