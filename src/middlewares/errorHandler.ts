import Express, { Request, Response, NextFunction } from "express";
import multer from "multer";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err.message === "Only image files are allowed!") {
    return res.status(400).json({ error: err.message });
  }

  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: err.message });
  }

  console.error(err);
  res.status(500).json({ error: "Internal server error" });
};
