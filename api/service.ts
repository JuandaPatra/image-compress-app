import express from "express";
import cors from "cors";
import serverless from "serverless-http";
import compressRoutes from "../src/routes/compressRoute";
import { errorHandler } from "../src/middlewares/errorHandler";
import "../src/database/init";

const app = express();

app.use(
  cors({
    origin: "*",
    exposedHeaders: ["X-Filename"],
  })
);

app.use("/", compressRoutes);
app.use(errorHandler);

// ❌ Tidak ada app.listen()
// Serverless function hanya EXPORT handler
export default serverless(app);
