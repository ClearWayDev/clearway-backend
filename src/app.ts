import express from "express";
import http from "http";
import { Server } from "socket.io";
import UserTypeDTO from "./app/DTOs/UserTypeDTO";
import UserDataDTO from "./app/DTOs/UserTypeDTO";
import admin from "firebase-admin";
const serviceAccount = require("./fb-admin.json");

// Initialize express app and server
const appPort = 6699;
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Store socket IDs of connected clients
let clients: string[] = [];
let clientsAll: UserTypeDTO[] = [];

app.get("/socket", (req, res) => {
  res.json({
    message: "WebSocket server is running",
    clientsConnected: clients,
  });
});
// When a new socket connects
io.on("connection", (socket) => {
  console.log("A user connected");
  clients.push(socket.id); // Add the client to the list of connected clients

  socket.on("init", (userData: UserDataDTO) => {
    console.log("User data received:", userData);
    clientsAll.push(userData);
  });
  // Notify the new client if there are already 2 clients
  if (clients.length === 2) {
    io.to(clients[0]).emit("ready");
    io.to(clients[1]).emit("ready");
  }

  // Relay signal messages (offer, answer, ice candidates) to the appropriate client
  socket.on("offer", (offer: any) => {
    const recipient = clients.find((id) => id !== socket.id);
    if (recipient) {
      io.to(recipient).emit("offer", offer);
    }
  });

  socket.on("answer", (answer: any) => {
    const recipient = clients.find((id) => id !== socket.id);
    if (recipient) {
      io.to(recipient).emit("answer", answer);
    }
  });

  socket.on("ice-candidate", (candidate: any) => {
    const recipient = clients.find((id) => id !== socket.id);
    if (recipient) {
      io.to(recipient).emit("ice-candidate", candidate);
    }
  });

  // Log any custom events sent by clients
  socket.onAny((eventName, ...args) => {
    console.log(`Event received: ${eventName}`, args);
  });

  // Clean up the clients array when a user disconnects
  socket.on("disconnect", () => {
    console.log("A user disconnected");
    clients = clients.filter((id) => id !== socket.id);
  });
});

// Set up the server to listen on port 3000
server.listen(appPort, () => {
  console.log(`Server is running on http://localhost:${appPort}`);
});

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Function to send notification to an FCM token
const sendNotification = async (fcmToken: string, title: string, body: string) => {
  const message = {
    token: fcmToken,
    notification: {
      title: title,
      body: body,
    },
  };

  try {
    const response = await admin.messaging().send(message);
    console.log("Notification sent successfully:", response);
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};