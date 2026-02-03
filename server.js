import express from "express";
import multer from "multer";
import path from "path";
import cors from "cors";
import fs from "fs";

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
});

// Endpoint to retrieve all videos
app.get("/videos", (req, res) => {
  try {
    const videos = fs.readdirSync("public/uploads/");
    res.json({ videos });
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve videos" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
