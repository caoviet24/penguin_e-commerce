const io = require("socket.io");

function initSocket(server) {
  console.log("Initialize Socket.io...");

  const socketServer = new io.Server(server, {
    cors: {
      origin:
        process.env.NODE_ENV === "production"
          ? process.env.CLIENT_PROD_URL
          : [process.env.CLIENT_DEV_URL, process.env.CLIENT_ADMIN_URL],
      methods: ["GET", "POST"],
    },
  });

  socketServer.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Event to join a room based on user ID
    socket.on("join_room", (user) => {
      console.log("User joining room:", user);
      
      if (user) {
        socket.join(user.id);
        console.log(`Socket ${socket.id} joined room ${user.id}`);
        // Optionally, send a confirmation back to the client
        socket.emit("room_joined", `Successfully joined room ${user}`);
      } else {
        console.log(
          `Socket ${socket.id} tried to join a room with an invalid userId.`
        );
        socket.emit("join_error", "User ID is required to join a room.");
      }
    });

    // Event to send a notification to a specific user ID
    socket.on("send_notification", (data) => {
      const { recipientUserId, message } = data;
      if (recipientUserId && message) {
        // Emit the notification to all sockets in the recipient's room
        socketServer.to(recipientUserId).emit("receive_notification", {
          sender: socket.id, // Or a more meaningful sender ID if available
          message: message,
          timestamp: new Date().toISOString(),
        });
        console.log(`Notification sent to room ${recipientUserId}: ${message}`);
      } else {
        console.log("Invalid data for send_notification:", data);
        socket.emit(
          "notification_error",
          "Recipient User ID and message are required."
        );
      }
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected:", socket.id);
      // Optionally, handle room cleanup if needed
      // For example, if you store user-socket mappings:
      // removeUserSocket(socket.id);
    });
  });

  return socketServer;
}

module.exports = initSocket;
