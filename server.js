import express from "express";
import multer from "multer";
import path from "path";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());

// Set up storage for uploaded videos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
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

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
