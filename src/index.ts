import express, { Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import sharp from "sharp";

const PORT = process.env.PORT || 3000;

const app = express();

// Folder sementara untuk upload
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Simpan file di disk sementara
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});
// Simpan file di memory, bukan di disk
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    // Validasi tipe file (hanya gambar)
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed!"));
    }
    cb(null, true);
  },
});

app.post("/compress", upload.single("image"), async (req, res) => {
  if (!req.file) return res.status(400).send("No image uploaded");

  const inputPath = req.file.path;
  const outputPath = path.join(uploadDir, `compressed-${req.file.filename}`);

  try {
    await sharp(inputPath)
      .jpeg({ quality: 70 }) // kompres JPEG
      .png({ quality: 70 }) // kompres PNG
      .webp({ quality: 70 }) // kompres WEBP
      .toFile(outputPath);

    // Kirim hasilnya ke client
    res.download(outputPath, (err) => {
      // Setelah file dikirim, hapus file sementara
      fs.unlinkSync(inputPath);
      fs.unlinkSync(outputPath);
      if (err) console.error("Error sending file:", err);
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Image compression failed.");
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
