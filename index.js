import { connectdb } from "./db/connectdb.js";
import dotenv from "dotenv";
import { app } from "./app.js";
import { Server } from "socket.io";
import { createServer } from "http";
import { addUser, removeUserBySocket } from "./socket/connectedUsers.js";

dotenv.config();

const PORT = process.env.PORT || 3000;
const url = process.env.ORIGIN || "*"; 

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: url,
    methods: ["GET", "POST", "PATCH"],
    credentials: true,
  },
});

(async () => {
  try {
    await connectdb();

  
    app.set("io", io);

    io.on("connection", (socket) => {
      console.log("🔌 User connected:", socket.id);

      socket.on("register", (userId) => {
        try {
          if (!userId) {
            console.log("❌ Invalid userId for socket:", socket.id);
            return;
          }

          addUser(userId.toString(), socket.id);

          console.log(
            `✅ User ${userId} registered with socket ${socket.id}`
          );
        } catch (error) {
          console.error("Socket register error:", error.message);
        }
      });


      socket.on("disconnect", () => {
        try {
          const userId = removeUserBySocket(socket.id);

          if (userId) {
            console.log(`❌ User ${userId} disconnected`);
          } else {
            console.log(`❌ Unknown socket disconnected: ${socket.id}`);
          }
        } catch (error) {
          console.error("Socket disconnect error:", error.message);
        }
      });
    });

    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Server startup failed:", error);
    process.exit(1);
  }
})();