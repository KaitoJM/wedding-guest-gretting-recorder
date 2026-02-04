import express from "express";
import multer from "multer";
import path from "path";
import cors from "cors";
import fs from "fs";
import http from "http";
import { WebSocketServer } from "ws";

const app = express();
const PORT = process.env.SERVER_PORT || 3001;

app.use(cors());
app.use("/uploads", express.static(path.resolve("public/uploads")));

// Set up storage for uploaded videos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Endpoint to upload video
app.post("/upload", upload.single("video"), (req, res) => {
  res.send({ message: "Video uploaded successfully!", file: req.file });

  // Notify connected websocket clients about the new video
  try {
    const filename =
      req.file && (req.file.filename || req.file.path || req.file.originalname);
    const payload = { type: "new-video", filename };
    const msg = JSON.stringify(payload);
    if (wss) {
      wss.clients.forEach((client) => {
        if (client.readyState === 1) {
          client.send(msg);
        }
      });
    }
  } catch (err) {
    console.error("Failed to broadcast new-video message:", err);
  }
});

// Endpoint to retrieve all videos
app.get("/videos", (req, res) => {
  try {
    const videos = fs
      .readdirSync("public/uploads")
      .filter((file) => file.endsWith(".webm"))
      .sort()
      .reverse();

    res.json({ videos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve videos" });
  }
});

// Create HTTP server and attach WebSocket server
const server = http.createServer(app);

const wss = new WebSocketServer({ server });

wss.on("connection", (socket) => {
  console.log("WebSocket client connected");
  socket.on("close", () => console.log("WebSocket client disconnected"));
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`WebSocket server attached`);
});
