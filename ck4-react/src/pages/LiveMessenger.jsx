import { useEffect, useRef, useState } from "react";
import useCollabSocket from "../socket";
import getRandomName from "../utils/randomName";

export default function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState("");
  const [contextMenu, setContextMenu] = useState(null); // right-click menu
  const messagesEndRef = useRef(null);

  // ✅ Assign random name if not stored
  useEffect(() => {
    let storedName = localStorage.getItem("chatUsername");
    if (!storedName) {
      storedName = getRandomName();
      localStorage.setItem("chatUsername", storedName);
    }
    setUsername(storedName);
  }, []);

  // ✅ Connect WebSocket
  const { sendMessage } = useCollabSocket("/collab", (msg) => {
    try {
      const data = typeof msg == "string" ? JSON.parse(msg) : msg;
      setMessages((prev) => [...prev, data]);
    } catch (err) {
      console.error("Invalid message:", err.message);
    }
  });

  // ✅ Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // ✅ Hide context menu when clicking outside
  useEffect(() => {
    const hideMenu = () => setContextMenu(null);
    window.addEventListener("click", hideMenu);
    return () => window.removeEventListener("click", hideMenu);
  }, []);

  // ✅ Send message
  const handleSend = () => {
    if (!message.trim()) return;

    const payload = {
      user: username,
      text: message.trim(),
      time: new Date().toISOString(),
    };

    sendMessage(JSON.stringify(payload));
    setMessages((prev) => [...prev, payload]);
    setMessage("");
  };

  // ✅ Context menu actions
  const handleContextMenu = (e, msg, isMine) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      msg,
      isMine,
    });
  };

  const handleEdit = (msg) => {
    setMessage(msg.text);
    setMessages((prev) => prev.filter((m) => m.time !== msg.time)); // remove old message
    setContextMenu(null);
  };

  const handleDelete = (msg) => {
    setMessages((prev) => prev.filter((m) => m.time !== msg.time));
    setContextMenu(null);
  };

  const handleReply = (msg) => {
    setMessage(`@${msg.user}: `);
    setContextMenu(null);
  };

  // ✅ UI helpers
  const getInitials = (name) => name.charAt(0).toUpperCase();
  const colorFromName = (name) => {
    const colors = ["#3B82F6", "#EC4899", "#10B981", "#F59E0B", "#8B5CF6"];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div className="flex flex-col h-screen items-center justify-center bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-2">🗨️ Redis WebSocket Chat</h1>
      <p className="text-gray-600 mb-4">
        Logged in as <strong>{username}</strong>
      </p>

      <div className="w-full max-w-md bg-white rounded-2xl shadow p-4 flex flex-col space-y-2 overflow-auto h-96 relative">
        {messages.map((msg, i) => {
          const isMine = msg.user === username;
          const prev = messages[i - 1];
          const showUser = !isMine && (!prev || prev.user !== msg.user);
          const bg = isMine ? "bg-blue-500 text-white" : "bg-gray-200 text-black";

          return (
            <div
              key={i}
              className={`flex ${isMine ? "justify-end" : "justify-start"}`}
              onContextMenu={(e) => handleContextMenu(e, msg, isMine)}
            >
              {!isMine && (
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center mr-2 text-white font-semibold"
                  style={{ backgroundColor: colorFromName(msg.user) }}
                >
                  {getInitials(msg.user)}
                </div>
              )}

              <div className={`p-2 rounded-xl max-w-[75%] ${bg}`}>
                {showUser && (
                  <div className="text-sm font-semibold mb-1">{msg.user}</div>
                )}
                <div>{msg.text}</div>
                <div className="text-xs opacity-70 mt-1">
                  {new Date(msg.time).toLocaleTimeString()}
                </div>
              </div>

              {isMine && (
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center ml-2 text-white font-semibold"
                  style={{ backgroundColor: colorFromName(msg.user) }}
                >
                  me
                </div>
              )}
            </div>
          );
        })}

        {/* scroll anchor */}
        <div ref={messagesEndRef} />

        {/* ✅ Context menu */}
        {contextMenu && (
          <div
            className="absolute bg-white shadow-lg rounded-lg border py-2 text-sm"
            style={{
              top: contextMenu.y,
              left: contextMenu.x,
              zIndex: 999,
              minWidth: "120px",
            }}
          >
            {contextMenu.isMine ? (
              <>
                <div
                  className="px-3 py-1 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleEdit(contextMenu.msg)}
                >
                  ✏️ Edit
                </div>
                <div
                  className="px-3 py-1 hover:bg-gray-100 cursor-pointer text-red-500"
                  onClick={() => handleDelete(contextMenu.msg)}
                >
                  🗑️ Delete
                </div>
              </>
            ) : (
              <div
                className="px-3 py-1 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleReply(contextMenu.msg)}
              >
                💬 Reply
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex w-full max-w-md mt-4">
        <input
          type="text"
          value={message}
          placeholder="Type a message..."
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="flex-1 border border-gray-300 rounded-l-xl p-2 outline-none"
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 text-white px-4 rounded-r-xl hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
}
