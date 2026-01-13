import { connectdb } from "./db/connectdb.js";
import dotenv from "dotenv";
import { app } from "./app.js";
import { Server } from "socket.io";
import { createServer } from "http";
import { addUser, removeUserBySocket } from "./socket/connectedUsers.js";
dotenv.config();
const PORT = process.env.PORT || 3000;
const url = process.env.ORIGIN;

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: url,
    methods: ["GET", "POST", "PATCH"],
  },
});

(async () => {
  try {
    await connectdb();
    app.set("io", io);
    io.on("connection", (socket) => {
      console.log("a user connected", socket.id);

      socket.on("register", (userId) => {
        addUser(userId, socket.id);
        console.log(`User ${userId} registered with socket ${socket.id}`);
      });
      socket.on("disconnect", (socket) => {
        const userId = removeUserBySocket(socket.id);
        if (userId) {
          console.log(`User ${userId} disconnected`);
        }
      });
    });

    server.listen(PORT, () => {
      console.log(`server is running/listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed: ", error);
    process.exit(1);
  }
})();
