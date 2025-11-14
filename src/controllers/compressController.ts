import { Request, Response } from "express";
import path from "path";
import fs from "fs";
import sharp from "sharp";
import archiver from "archiver";
import { cleanUpUtils } from "../utils/cleanup";
import { insertLog } from "../models/compressLogModel";

export const compress = async (req: Request, res: Response) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files uploaded.");
  }

  const outputDir = path.join(__dirname, "../compressed");
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  

  const quality = Number(req.query.quality ?? 70);
   
  const compressedFiles: string[] = [];
  const uploadedFiles: string[] = [];

  const startTime = Date.now();

  try {
    // Kompres semua file
    for (const key in files) {
      const fileArray = files[key];
      for (const file of fileArray) {
        const inputPath = file.path;
        const originalSize = fs.statSync(inputPath).size; 
        uploadedFiles.push(file.path); // simpan untuk dihapus nanti

        const outputPath = path.join(outputDir, `compressed-${file.filename}`);
        await sharp(file.path)
          .jpeg({ quality })
          .png({ quality })
          .webp({ quality })
          .toFile(outputPath);

        const compressedSize = fs.statSync(outputPath).size;
        const duration = Date.now() - startTime;

        const ip =
          req.headers["x-forwarded-for"]?.toString().split(",")[0] ||
          req.socket.remoteAddress ||
          "unknown";

            await insertLog(originalSize, compressedSize, duration, ip);

        compressedFiles.push(outputPath);
      }
    }

    const cleanUp = () => {
      // Hapus file upload original
      cleanUpUtils(uploadedFiles);
      // Hapus file compressed
      cleanUpUtils(compressedFiles);
    };

    // Jika hanya satu file
    if (compressedFiles.length === 1) {
      const filePath = compressedFiles[0];
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=${path.basename(filePath)}`
      );

      const stream = fs.createReadStream(filePath);
      stream.pipe(res);

      // Hapus file setelah response selesai
      res.on("finish", cleanUp);

      return;
    }

    // Jika lebih dari satu → zip
    const zipPath = path.join(outputDir, `compressed-${Date.now()}.zip`);
    const output = fs.createWriteStream(zipPath);
    const archive = archiver("zip", { zlib: { level: 9 } });

    archive.pipe(output);
    for (const file of compressedFiles) {
      archive.file(file, { name: path.basename(file) });
    }

    await archive.finalize();

    output.on("close", () => {
      res.setHeader("Content-Type", "application/zip");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=${path.basename(zipPath)}`
      );
      fs.createReadStream(zipPath).pipe(res);

      // Hapus semua file setelah zip dikirim
      res.on("finish", () => {
        fs.existsSync(zipPath) && fs.unlinkSync(zipPath);
        cleanUp();
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Image compression failed.");
  }
};
