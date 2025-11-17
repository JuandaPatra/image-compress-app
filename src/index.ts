import express from "express";
import cors from "cors";
import compressRoutes from "./routes/compressRoute";
import { errorHandler } from "./middlewares/errorHandler";
import "./database/init";
import { responseMiddleware } from "./middlewares/responseMiddleware";

const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors({
  origin: "http://localhost:5173",
}));
app.use(responseMiddleware);
app.use('/service', compressRoutes )
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
