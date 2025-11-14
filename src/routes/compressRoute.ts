import express from "express";
import { compress } from "../controllers/compressController";

import { uploadImages } from "../middlewares/multerConfig";
import db from "../database/db";
import { convert } from "../controllers/convertController";

const router = express.Router();

router.post("/compress", uploadImages, compress);

router.post("/convert", uploadImages, convert)

router.get("/logs", (req, res) => {
  db.all(
    "SELECT * FROM compress_logs ORDER BY created_at DESC",
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

export default router;
