import React, { useState, useEffect, useRef } from "react";

const API = "http://127.0.0.1:8000"; // ✅ safer port

async function queryBot(sessionId, question) {
  const res = await fetch(`${API}/query`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ session_id: sessionId, question }),
  });
  return res.json();
}

const ChatComponent = () => {
  const [sessionId] = useState(() => crypto.randomUUID());
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Auto-scroll when messages update
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message to backend
  const handleSend = async (msg) => {
    const text = msg || question;
    if (!text.trim()) return;

    const userMsg = { type: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const data = await queryBot(sessionId, text);
      const botMsg = { type: "bot", text: data.answer };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error("Error querying backend:", err);
      setMessages((prev) => [
        ...prev,
        { type: "bot", text: "⚠️ Error contacting AI service." },
      ]);
    } finally {
      setLoading(false);
      setQuestion("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // 👇 QUICK TEST button handler
  const handleTest = () => {
    const greetings = ["hi", "hello", "good morning"];
    const randomMsg = greetings[Math.floor(Math.random() * greetings.length)];
    handleSend(randomMsg);
  };

  return (
    <div className="flex flex-col h-screen max-w-3xl mx-auto p-4 bg-gray-100">
      <h2 className="text-xl font-bold text-center mb-4 text-green-700">
        💬 Chat Assistant (API Mode)
      </h2>

      {/* Chat window */}
      <div className="flex-1 bg-white rounded-lg shadow-inner overflow-y-auto p-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`my-2 p-2 rounded-lg max-w-[80%] whitespace-pre-wrap break-words ${
              msg.type === "user"
                ? "bg-green-600 text-white ml-auto"
                : "bg-gray-200 text-black"
            }`}
          >
            {msg.text}
          </div>
        ))}
        {loading && (
          <div className="italic text-gray-500 text-sm text-center">
            Bot is thinking...
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input + Send */}
      <div className="flex gap-2 mt-3">
        <textarea
          rows={1}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your question..."
          className="flex-1 border rounded-lg px-3 py-2 resize-none focus:ring-2 focus:ring-green-400 outline-none"
        />
        <button
          onClick={() => handleSend()}
          disabled={loading}
          className={`px-4 py-2 rounded-lg text-white font-semibold ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          Send
        </button>
      </div>

      {/* Quick Test Buttons */}
      <div className="flex justify-center gap-2 mt-3">
        <button
          onClick={handleTest}
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg"
        >
          🔍 Quick Test
        </button>
      </div>

      {/* Session Info */}
      <div className="text-xs text-center text-gray-400 mt-2">
        Session ID: <span className="font-mono">{sessionId}</span>
      </div>
    </div>
  );
};

export default ChatComponent;
