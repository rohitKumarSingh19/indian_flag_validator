// utils/imageValidation.js
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const JimpModule = require('jimp');

// ✅ Make Jimp consistent across versions
const Jimp = JimpModule.Jimp || JimpModule;

// ✅ Extract intToRGBA safely for both old & new Jimp versions
const intToRGBA =
  JimpModule.intToRGBA || (Jimp.intToRGBA ? Jimp.intToRGBA : null);

if (!intToRGBA) {
  throw new Error(
    'intToRGBA is not available in your Jimp installation. Please check your version.'
  );
}

// Function to validate Indian flag colors
export async function validateIndianFlag(filePath) {
  try {
    const img = await Jimp.read(filePath);
    const width = img.bitmap.width;
    const height = img.bitmap.height;

    // Example: Pick the center pixel color
    const centerX = Math.floor(width / 2);
    const centerY = Math.floor(height / 2);
    const { r, g, b } = intToRGBA(img.getPixelColor(centerX, centerY));

    console.log(`Center pixel color: R=${r}, G=${g}, B=${b}`);

    // 🟧 Example logic: check if the center pixel is close to saffron
    // (adjust the tolerance as per your validation rules)
    const isSaffron = r > 200 && g > 100 && b < 80;

    return {
      valid: isSaffron,
      details: {
        centerPixel: { r, g, b },
        message: isSaffron
          ? 'Center pixel matches saffron tone.'
          : 'Center pixel does not match saffron tone.',
      },
    };
  } catch (err) {
    console.error('Error in validateIndianFlag:', err);
    return { valid: false, error: err.message };
  }
}
