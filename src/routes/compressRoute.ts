import express from "express";
import { compress } from "../controllers/compressController";

import { uploadSingle} from '../middlewares/multerConfig'

const router = express.Router();

router.post("/compress", uploadSingle, compress)

export default router;