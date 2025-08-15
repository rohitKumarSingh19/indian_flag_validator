// utils/colorUtils.js

/**
 * Convert HEX color to RGB object
 * @param {string} hex - Example: "#FF9933"
 * @returns {{r: number, g: number, b: number}}
 */
export function hexToRgb(hex) {
  const sanitized = hex.replace(/^#/, '');
  const bigint = parseInt(sanitized, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255
  };
}

/**
 * Calculate percentage deviation between two RGB colors
 * @param {{r:number, g:number, b:number}} color1
 * @param {{r:number, g:number, b:number}} color2
 * @returns {number} - deviation in %
 */
export function colorDeviation(color1, color2) {
  const diffR = Math.abs(color1.r - color2.r);
  const diffG = Math.abs(color1.g - color2.g);
  const diffB = Math.abs(color1.b - color2.b);

  // Max possible difference for a channel is 255
  const deviation = ((diffR + diffG + diffB) / (3 * 255)) * 100;
  return deviation;
}

/**
 * Check if a color is within the tolerance of the target color
 * @param {string} hexTarget - Target HEX color
 * @param {string} hexActual - Actual HEX color
 * @param {number} tolerancePercent - Allowed tolerance in %
 * @returns {{status: string, deviation: string}}
 */
export function validateColor(hexTarget, hexActual, tolerancePercent = 5) {
  const targetRGB = hexToRgb(hexTarget);
  const actualRGB = hexToRgb(hexActual);

  const deviation = colorDeviation(targetRGB, actualRGB);

  return {
    status: deviation <= tolerancePercent ? "pass" : "fail",
    deviation: `${deviation.toFixed(2)}%`
  };
}

/**
 * Get average color from a list of pixels
 * @param {Uint8ClampedArray} pixels - flat RGBA pixel array
 * @returns {string} HEX color
 */
export function averageColor(pixels) {
  let r = 0, g = 0, b = 0, count = 0;

  for (let i = 0; i < pixels.length; i += 4) {
    r += pixels[i];
    g += pixels[i + 1];
    b += pixels[i + 2];
    count++;
  }

  r = Math.round(r / count);
  g = Math.round(g / count);
  b = Math.round(b / count);

  return rgbToHex(r, g, b);
}

/**
 * Convert RGB to HEX
 * @param {number} r
 * @param {number} g
 * @param {number} b
 * @returns {string} HEX color string
 */
export function rgbToHex(r, g, b) {
  return "#" + [r, g, b]
    .map(x => x.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase();
}
