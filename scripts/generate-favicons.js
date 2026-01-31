import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const logoPath = join(__dirname, '../attached_assets/logo2_1762241472426.png');
const publicDir = join(__dirname, '../client/public');
const faviconsDir = join(__dirname, '../client/public/favicons');

async function generateFavicons() {
  console.log('Generating optimized favicons from:', logoPath);
  
  if (!fs.existsSync(logoPath)) {
    console.error('Logo file not found:', logoPath);
    process.exit(1);
  }

  const sizes = [16, 32, 48, 64, 96, 128, 180, 192, 512];
  
  for (const size of sizes) {
    let outputPath;
    let filename;
    
    if (size === 180) {
      filename = 'apple-touch-icon.png';
      outputPath = join(publicDir, filename);
    } else if (size === 192) {
      filename = 'android-chrome-192x192.png';
      outputPath = join(faviconsDir, filename);
    } else if (size === 512) {
      filename = 'android-chrome-512x512.png';
      outputPath = join(faviconsDir, filename);
    } else {
      filename = `favicon-${size}x${size}.png`;
      outputPath = join(faviconsDir, filename);
    }
    
    await sharp(logoPath)
      .resize(size, size, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png({ quality: 100, compressionLevel: 6 })
      .toFile(outputPath);
    
    console.log(`✓ Generated ${size}x${size}: ${filename}`);
  }

  const rootFavicon16 = join(publicDir, 'favicon-16x16.png');
  const rootFavicon32 = join(publicDir, 'favicon-32x32.png');
  
  await sharp(logoPath)
    .resize(16, 16, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ quality: 100 })
    .toFile(rootFavicon16);
  console.log('✓ Generated root favicon-16x16.png');

  await sharp(logoPath)
    .resize(32, 32, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ quality: 100 })
    .toFile(rootFavicon32);
  console.log('✓ Generated root favicon-32x32.png');

  console.log('\nGenerating favicon.ico with multiple sizes...');
  const icon16 = await sharp(logoPath)
    .resize(16, 16, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  const icon32 = await sharp(logoPath)
    .resize(32, 32, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  const icon48 = await sharp(logoPath)
    .resize(48, 48, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  const ico = createIco([icon16, icon32, icon48], [16, 32, 48]);
  fs.writeFileSync(join(publicDir, 'favicon.ico'), ico);
  console.log('✓ Generated multi-size favicon.ico (16x16, 32x32, 48x48)');

  console.log('\nDone! All favicons generated successfully.');
}

function createIco(buffers, sizes) {
  const numImages = buffers.length;
  const headerSize = 6;
  const dirEntrySize = 16;
  const dataOffset = headerSize + (dirEntrySize * numImages);
  
  let currentOffset = dataOffset;
  const offsets = [];
  
  for (const buffer of buffers) {
    offsets.push(currentOffset);
    currentOffset += buffer.length;
  }
  
  const totalSize = currentOffset;
  const ico = Buffer.alloc(totalSize);
  
  ico.writeUInt16LE(0, 0);
  ico.writeUInt16LE(1, 2);
  ico.writeUInt16LE(numImages, 4);
  
  for (let i = 0; i < numImages; i++) {
    const entryOffset = headerSize + (i * dirEntrySize);
    const size = sizes[i];
    
    ico.writeUInt8(size === 256 ? 0 : size, entryOffset);
    ico.writeUInt8(size === 256 ? 0 : size, entryOffset + 1);
    ico.writeUInt8(0, entryOffset + 2);
    ico.writeUInt8(0, entryOffset + 3);
    ico.writeUInt16LE(1, entryOffset + 4);
    ico.writeUInt16LE(32, entryOffset + 6);
    ico.writeUInt32LE(buffers[i].length, entryOffset + 8);
    ico.writeUInt32LE(offsets[i], entryOffset + 12);
  }
  
  for (let i = 0; i < numImages; i++) {
    buffers[i].copy(ico, offsets[i]);
  }
  
  return ico;
}

generateFavicons().catch(console.error);
