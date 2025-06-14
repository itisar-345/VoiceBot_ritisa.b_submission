// services/wsService.js
import { askModel } from "./sagemakerService.js";
import { saveChat, getChats } from "./dynamoService.js";

export const handleSocket = (io, socket) => {
  // Send recent history on connect (optional)
  getChats(socket.user.email).then((items) =>
    socket.emit("history", items ?? [])
  );

  socket.on("chatMessage", async ({ prompt }) => {
    if (!prompt) return socket.emit("chatError", { message: "Empty prompt" });

    socket.emit("thinking");
    try {
      const reply = await askModel(prompt);
      await saveChat(socket.user.email, prompt, reply);

      socket.emit("chatResponse", {
        prompt,
        reply,
        timestamp: Date.now(),
      });
    } catch (err) {
      console.error(err);
      socket.emit("chatError", { message: "Model error" });
    }
  });

  socket.on("disconnect", () =>
    console.log(`Client disconnected: ${socket.id}`)
  );
};
