// routes/flagRoutes.js
import express from "express";
import multer from "multer";
import { validateFlag } from "../controllers/flagController.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

// ✅ Matches frontend formData.append("flag", file)
router.post("/validate", upload.single("flag"), validateFlag);

export default router;
