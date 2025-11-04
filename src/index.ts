import express from "express";
import cors from "cors";
import compressRoutes from "./routes/compressRoute";
import { errorHandler } from "./middlewares/errorHandler";

const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use('/service', compressRoutes )
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
