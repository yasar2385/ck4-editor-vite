import { useState } from "react";
import useSocket from "../socket";

export default function ChatPanel() {
    const [messages, setMessages] = useState([]);
    const { sendMessage } = useSocket("/intelligent-chat", (msg) =>
        setMessages((prev) => [...prev, msg])
    );

    const handleSend = (text) => {
        const payload = {
            type: "chat",
            text,
            user: localStorage.getItem("chatUsername") || "Anonymous",
            time: new Date().toISOString(),
        };
        sendMessage(payload);
        setMessages((prev) => [...prev, payload]);
    };

    return (
        <div>
            {/* your chat UI */}
            <button onClick={() => handleSend("Hello team!")}>Send</button>
        </div>
    );
}
