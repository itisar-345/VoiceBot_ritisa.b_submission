// src/hooks/useChatSocket.js
import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

export const useChatSocket = (token) => {
  const [messages, setMessages] = useState([]);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!token) return;

    const socket = io("http://localhost:5000", {
      auth: { token },
    });
    socketRef.current = socket;

    socket.on("connect", () => console.log("🔗 socket connected"));
    socket.on("thinking", () => setMessages((m) => [...m, { role: "sys", text: "..." }]));
    socket.on("chatResponse", (data) =>
      setMessages((m) => [...m, { role: "bot", text: data.reply }])
    );
    socket.on("chatError", (e) => console.error(e));

    return () => socket.disconnect();
  }, [token]);

  const sendPrompt = (prompt) => {
    setMessages((m) => [...m, { role: "user", text: prompt }]);
    socketRef.current?.emit("chatMessage", { prompt });
  };

  return { messages, sendPrompt };
};
