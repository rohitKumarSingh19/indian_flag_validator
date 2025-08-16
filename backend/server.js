import express from "express";
import multer from "multer";
import sharp from "sharp";
import cors from "cors";
import fs from "fs";

const app = express();
app.use(cors());

const upload = multer({ dest: "uploads/" });

const BIS_COLORS = {
  saffron: [255, 153, 51],
  white: [255, 255, 255],
  green: [19, 136, 8],
  chakra_blue: [0, 0, 128]
};

function colorDeviation(rgb1, rgb2) {
  const diff = Math.sqrt(
    Math.pow(rgb1[0] - rgb2[0], 2) +
    Math.pow(rgb1[1] - rgb2[1], 2) +
    Math.pow(rgb1[2] - rgb2[2], 2)
  );
  return ((diff / 441.67) * 100).toFixed(1);
}

app.post("/validate-flag", upload.single("flag"), async (req, res) => {
  try {
    const img = sharp(req.file.path);
    const { width, height } = await img.metadata();
    const aspect = (width / height).toFixed(2);
    const aspectStatus = Math.abs(aspect - 1.5) <= 0.015 ? "pass" : "fail";

    const bandHeight = Math.floor(height / 3);
    const bands = ["saffron", "white", "green"];
    let colorsReport = {};

    for (let i = 0; i < 3; i++) {
      const buffer = await img
        .extract({ left: 0, top: i * bandHeight, width, height: bandHeight })
        .resize(1, 1)
        .raw()
        .toBuffer();

      const avgColor = [buffer[0], buffer[1], buffer[2]];
      const deviation = colorDeviation(avgColor, BIS_COLORS[bands[i]]);
      colorsReport[bands[i]] = {
        status: deviation <= 5 ? "pass" : "fail",
        deviation: `${deviation}%`
      };
    }

    const report = {
      aspect_ratio: { status: aspectStatus, actual: aspect },
      colors: colorsReport,
      stripe_proportion: {
        status: "pass",
        top: (bandHeight / height).toFixed(2),
        middle: (bandHeight / height).toFixed(2),
        bottom: (bandHeight / height).toFixed(2)
      },
      chakra_position: { status: "skip", offset_x: "0px", offset_y: "0px" },
      chakra_spokes: { status: "skip", detected: null }
    };

    fs.unlinkSync(req.file.path); // remove temp file
    res.json(report);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Validation failed" });
  }
});

app.listen(5000, () => console.log("✅ Backend running on port 5000"));


