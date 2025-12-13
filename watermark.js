import fs from "fs-extra";
import path from "path";
import sharp from "sharp";
import chalk from "chalk";

const inputFolder = "img";
const outputFolder = "watermarked_img";
const MAX_WIDTH = 2500;
const QUALITY = 85;

await fs.ensureDir(outputFolder);

async function makeWatermark(baseWidth, baseHeight) {
  // Initial size: 55% of width, capped by height
  const wmWidth = 800;
  const wmHeight = 400;

  const svg = `
  <svg width="${wmWidth}" height="${wmHeight}" xmlns="http://www.w3.org/2000/svg">
    <style>
      .text {
        font-family: Arial, sans-serif;
        font-weight: 900;
        font-size: ${Math.round(wmWidth / 10)}px;
        text-anchor: middle;
        dominant-baseline: middle;
        fill: white;
        fill-opacity: 0.9;
        stroke: black;
        stroke-width: 8px;
        stroke-opacity: 1;
        paint-order: stroke;
      }
    </style>
    <text x="50%" y="40%" class="text">Samsonite Marble</text>
    <text x="50%" y="75%" class="text">Granite Company</text>
  </svg>`;
  return Buffer.from(svg);
}

async function processImage(filename) {
  if (!/\.(jpe?g|png|webp)$/i.test(filename)) return;
  const input = path.join(inputFolder, filename);
  const output = path.join(outputFolder, path.parse(filename).name + ".jpg");

  try {
    const img = sharp(input).rotate();
    const meta = await img.metadata();
    const width = meta.width
    const height = meta.height || width;

    const resizedBuffer = await img.resize({ width }).toBuffer();

    // Create watermark buffer sized to this image
    const wmBuf = await makeWatermark(width, height);
    let rotatedWM = await sharp(wmBuf)
      .rotate(-35, { background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .toBuffer();

    // Ensure watermark fits after rotation
    const wmMeta = await sharp(rotatedWM).metadata();

    if (wmMeta.width > width || wmMeta.height > height) {
  const scale = Math.min(width / wmMeta.width, height / wmMeta.height) * 0.7;
  rotatedWM = await sharp(rotatedWM)
    .resize({
      width: Math.floor(wmMeta.width * scale),
      height: Math.floor(wmMeta.height * scale),
    })
    .toBuffer();
}

    // if (wmMeta.width > width || wmMeta.height > height) {
    //   const scale = Math.min(width / wmMeta.width, height / wmMeta.height) * 0.8; // 80% safety margin
    //   rotatedWM = await sharp(rotatedWM)
    //     .resize({
    //       width: Math.floor(wmMeta.width * scale),
    //       height: Math.floor(wmMeta.height * scale),
    //     })
    //     .toBuffer();
    // }

    await sharp(resizedBuffer)
      .composite([{ input: rotatedWM, gravity: "center", blend: "over" }])
      .modulate({ brightness: 1.05 })
      .withMetadata()
      .jpeg({ quality: QUALITY, progressive: true, chromaSubsampling: "4:4:4" })
      .toFile(output);

    console.log(chalk.green(`✅ ${filename}`));
  } catch (e) {
    console.log(chalk.red(`❌ ${filename}: ${e.message}`));
  }
}

console.log(chalk.cyan(`Processing images from: ${inputFolder}`));
const files = await fs.readdir(inputFolder);
for (const f of files) await processImage(f);
console.log(chalk.greenBright("🎉 All images processed!"));
