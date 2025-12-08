import express from "express";
import multer from "multer";
import sharp from "sharp";
import cors from "cors";
import path from "path";
import fs from "fs";

const serverless = require("serverless-http");
const app = express();

// allow CORS
app.use(cors({ origin: "*" }));

// Vercel hanya boleh tulis di /tmp
const uploadDir = "/tmp/uploads";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

app.post("/compress", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).send("No image uploaded");

    const input = req.file.path;
    const output = path.join(uploadDir, "compressed-" + req.file.filename);

    await sharp(input)
      .jpeg({ quality: 70 })
      .toFile(output);

    // download ke client
    res.download(output, "compressed-" + req.file.originalname, () => {
      fs.unlinkSync(input);
      fs.unlinkSync(output);
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Compression failed");
  }
});

module.exports = serverless(app);
