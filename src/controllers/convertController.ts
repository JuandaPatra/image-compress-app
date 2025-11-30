import { Request, Response } from "express";
import path from "path";
import fs from "fs";
import { cleanUpUtils } from "../utils/cleanup";
import sharp from "sharp";
import archiver from "archiver";
import { convertFormatted } from "../utils/convertFormatted";

export const convert = async (req: Request, res: Response) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files uploaded.");
  }

  const toFormat = (req.query.to as string)?.toLowerCase();
  const compressedFiles: string[] = [];

  if (!toFormat || !["jpg", "png", "webp"].includes(toFormat)) {
    return res.status(400).json({
      error: "Invalid target format. Use ?to=jpg|png|webp",
    });
  }

  try {
    const outputDir = path.join(__dirname, "../converted");
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    for (const key in req.files) {
      const fileArray = files[key];
      for (const file of fileArray) {
        const inputPath = file.path;
        const outputPath = path.join(
          outputDir,
          `converted-${file.filename
            .split(".")
            .slice(0, -1)
            .join(".")}.${toFormat}`
        );

        await convertFormatted(toFormat, inputPath).toFile(outputPath);

        compressedFiles.push(outputPath);
      }
    }

    if (compressedFiles.length === 1) {
          const filePath = compressedFiles[0];
          res.setHeader(
            "Content-Disposition",
            `attachment; filename=${path.basename(filePath)}`
          );
    
          const stream = fs.createReadStream(filePath);
          stream.pipe(res);
    
          // Hapus file setelah response selesai
        //   res.on("finish", cleanUp);
    
          return;
        }
    // Buat zip dari semua file yang sudah di-convert
    const zipFileName = `converted-${Date.now()}.zip`;
    const zipFilePath = path.join(outputDir, zipFileName);
    const output = fs.createWriteStream(zipFilePath);
    const archive = archiver("zip", {
      zlib: { level: 9 },
    });

    output.on("close", () => {
        // Kirim file zip ke client
        res.setHeader(
          "Content-Disposition",
          `attachment; filename=${zipFileName}`);
        res.setHeader(
          "Content-Type",
          "application/zip"
        );
        fs.createReadStream(zipFilePath).pipe(res);

        // Cleanup setelah response selesai
        res.on("finish", async () => {
          await cleanUpUtils([...compressedFiles, zipFilePath]);
        });
    })
    archive.pipe(output);
    for (const filePath of compressedFiles) {
      archive.file(filePath, { name: path.basename(filePath) });
    }
    await archive.finalize();

  } catch (error) {
    console.error("Conversion error:", error);
    res.status(500).send("An error occurred during conversion.");
    return;
  }
};
