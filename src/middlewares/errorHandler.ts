import Express, { Request, Response, NextFunction } from "express";
import multer from "multer";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err.message === "Only image files are allowed!") {
    return res.error(err.message, 400);
  }

  if (err instanceof multer.MulterError) {
    return res.error(err.message, 400);
  }

  console.error(err);
  res.error("Internal Server Error", 500);
};
