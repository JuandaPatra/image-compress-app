import  { Request, Response } from "express";
import path from "path";
import fs from "fs";
import sharp from "sharp";

export const compress = async (req: Request, res: Response) => {
  if (!req.file) return res.status(400).send("No image uploaded");


  const inputPath = req.file.path;
  const outputPath = path.join(path.dirname(inputPath), `compressed-${req.file.filename}`);

  try {
    await sharp(inputPath)
      .jpeg({ quality: 70 }) // kompres JPEG
      .png({ quality: 70 }) // kompres PNG
      .webp({ quality: 70 }) // kompres WEBP
      .toFile(outputPath);

    // Kirim hasilnya ke client
    res.download(outputPath, `compressed-${req.file.originalname}`, (err) => {
      // Setelah file dikirim, hapus file sementara
      fs.unlinkSync(inputPath);
      fs.unlinkSync(outputPath);
      if (err) console.error("Error sending file:", err);
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Image compression failed.");
  }
};

export const compressMulti = async (req:Request, res: Response)=>{
  res.status(200).send('masuk');
}