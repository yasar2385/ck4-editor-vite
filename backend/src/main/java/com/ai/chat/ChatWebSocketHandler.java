package com.ai.chat;

// Java 8 WebSocket handler

public class ChatWebSocketHandler {

    private final RestTemplate restTemplate = new RestTemplate();
    private final String BOT_SERVICE_URL = "http://localhost:6000";

    @OnMessage
    public void handleMessage(String message, Session session) {
        String sessionId = session.getId();

        // Parse message
        JsonObject json = JsonParser.parseString(message).getAsJsonObject();
        String question = json.get("question").getAsString();

        // Call Bot Service
        HttpEntity<String> request = new HttpEntity<>(
                "{\"session_id\":\"" + sessionId + "\",\"question\":\"" + question + "\"}");

        ResponseEntity<String> response = restTemplate.postForEntity(
                BOT_SERVICE_URL + "/query",
                request,
                String.class);

        // Send response via WebSocket
        session.getBasicRemote().sendText(response.getBody());
    }
}