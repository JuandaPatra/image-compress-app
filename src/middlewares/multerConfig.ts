import multer from "multer";
import path from "path";
import fs from "fs";

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

// export const uploadSingle = upload.single("image");
export const uploadImages = upload.fields([
  { name: "image", maxCount: 1 },
  { name: "images", maxCount: 10 },
]);