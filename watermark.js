import fs from "fs-extra";
import path from "path";
import sharp from "sharp";
import chalk from "chalk";

const inputFolder = "img";
const outputFolder = "watermarked_img";
const QUALITY = 80; // slightly smaller for faster loading

await fs.ensureDir(outputFolder);

// ✅ Create watermark (static size, bold, white text, black outline)
async function makeWatermark() {
  const wmWidth = 800;
  const wmHeight = 400;

  const svg = `
  <svg width="${wmWidth}" height="${wmHeight}" xmlns="http://www.w3.org/2000/svg">
    <style>
      .text {
        font-family: Arial, sans-serif;
        font-weight: 900;
        font-size: 75px;
        text-anchor: middle;
        dominant-baseline: middle;
        fill: white;
        fill-opacity: 1;
        stroke: black;
        stroke-width: 10px;
        paint-order: stroke;
      }
    </style>
    <text x="50%" y="40%" class="text">Samsonite Marble</text>
    <text x="50%" y="75%" class="text">Granite Company</text>
  </svg>`;

  return Buffer.from(svg);
}

async function processImage(filename) {
  // Skip non-image files
  if (!/\.(jpe?g|png|webp)$/i.test(filename)) return;

  const inputPath = path.join(inputFolder, filename);
  const ext = path.extname(filename).toLowerCase();
  const baseName = path.parse(filename).name;
  const outputPath = path.join(outputFolder, `${baseName}.webp`);

  try {
    const img = sharp(inputPath).rotate(); // auto-orient
    const meta = await img.metadata();
    const width = meta.width;
    const height = meta.height || width;

    // Read image into buffer
    const buffer = await img.resize({ width }).toBuffer();

    // Create watermark
    let watermark = await makeWatermark();

    // Rotate watermark (optional: set to 0 if you don’t want it slanted)
    watermark = await sharp(watermark)
      .rotate(-25, { background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .toBuffer();

    // ✅ Auto-shrink watermark if smaller image
    const wmMeta = await sharp(watermark).metadata();
    if (wmMeta.width > width || wmMeta.height > height) {
      const scale = Math.min(width / wmMeta.width, height / wmMeta.height) * 0.9;
      watermark = await sharp(watermark)
        .resize({
          width: Math.floor(wmMeta.width * scale),
          height: Math.floor(wmMeta.height * scale),
        })
        .toBuffer();
    }

    // ✅ Add watermark, optimize, and convert to WEBP
    await sharp(buffer)
      .composite([{ input: watermark, gravity: "center", blend: "over" }])
      .withMetadata()
      .webp({
        quality: QUALITY,
        effort: 6, // balance between speed & quality
        lossless: false,
        smartSubsample: true,
      })
      .toFile(outputPath);

    console.log(chalk.green(`✅ ${filename}`));
  } catch (err) {
    console.log(chalk.red(`❌ ${filename}: ${err.message}`));
  }
}

// ✅ Run
console.log(chalk.cyan(`Processing images from: ${inputFolder}`));
const files = await fs.readdir(inputFolder);
for (const file of files) await processImage(file);
console.log(chalk.greenBright("🎉 All images processed successfully!"));
