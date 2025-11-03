import express from "express";
import { compress, compressMulti } from "../controllers/compressController";

import { uploadSingle} from '../middlewares/multerConfig'

const router = express.Router();

router.post("/compress", uploadSingle, compress);
router.post("/compress-multi-image",compressMulti)

export default router;