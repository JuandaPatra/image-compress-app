import express from "express";
import { compress } from "../controllers/compressController";

import { uploadImages} from '../middlewares/multerConfig'

const router = express.Router();

router.post("/compress", uploadImages, compress);

export default router;