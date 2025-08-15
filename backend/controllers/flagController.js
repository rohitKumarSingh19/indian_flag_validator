import { validateIndianFlag } from "../utils/imageValidation.js";
import path from "path";
import fs from "fs";

export const validateFlag = async (req, res) => {
  try {
    console.log("Inside validateFlag");
    console.log("req.file:", req.file);
    console.log("req.body:", req.body);

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // ✅ Get the full file path
    const filePath = path.resolve(req.file.path);

    // ✅ Run validation
    const report = await validateIndianFlag(filePath);

    // (Optional) delete file after processing
    fs.unlink(filePath, (err) => {
      if (err) console.error("Error deleting file:", err);
    });

    // ✅ Send response to frontend
    return res.json({ success: true, report });
  } catch (error) {
    console.error("Error in validateFlag:", error);
    res.status(500).json({ error: error.message });
  }
};
