import  express , { Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import sharp from "sharp";

const PORT = process.env.PORT || 3000;

const app = express();


// Simpan file di memory, bukan di disk
const upload = multer({ storage: multer.memoryStorage() });

app.post("/compress", upload.single("image"), async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: "No file uploaded" });
      return;
    }

    const mimeType = req.file.mimetype;
    let format: "jpeg" | "png" | "webp" = "jpeg";

    if (mimeType.includes("png")) format = "png";
    else if (mimeType.includes("webp")) format = "webp";

    // Kompres langsung dari buffer tanpa simpan file
    const compressedBuffer = await sharp(req.file.buffer)
      .toFormat(format, { quality: 70 })
      .toBuffer();

    res.set({
      "Content-Type": mimeType,
      "Content-Disposition": `attachment; filename="compressed.${format}"`,
    });

    res.send(compressedBuffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Compression failed" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});