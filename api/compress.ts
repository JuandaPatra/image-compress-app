import type { VercelRequest, VercelResponse } from "@vercel/node";
import multer from "multer";
import sharp from "sharp";
import path from "path";
import fs from "fs";

// Disable default body parser (Wajib untuk multer)
export const config = {
  api: {
    bodyParser: false
  }
};

// hanya boleh tulis di /tmp
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

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  upload.single("image")(req as any, res as any, async (err) => {
    if (err) return res.status(500).json({ error: err.message });

    try {
      if (!req.file) return res.status(400).json({ error: "No image uploaded" });

      const input = (req as any).file.path;
      const output = path.join(uploadDir, "compressed-" + (req as any).file.filename);

      await sharp(input)
        .jpeg({ quality: 70 })
        .toFile(output);

      res.download(output, "compressed.jpg", () => {
        fs.unlinkSync(input);
        fs.unlinkSync(output);
      });

    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Compression failed" });
    }
  });
}
