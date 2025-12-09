import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const ASSETS_DIR = './attached_assets';
const QUALITY = 80;
const MAX_WIDTH = 1200;

async function optimizeImage(inputPath) {
  const ext = path.extname(inputPath).toLowerCase();
  const baseName = path.basename(inputPath, ext);
  const dir = path.dirname(inputPath);
  
  if (!['.png', '.jpg', '.jpeg'].includes(ext)) {
    return;
  }

  try {
    const stats = fs.statSync(inputPath);
    const originalSize = stats.size;
    
    if (originalSize < 100 * 1024) {
      console.log(`Skipping ${inputPath} (already small: ${(originalSize / 1024).toFixed(1)}KB)`);
      return;
    }

    const image = sharp(inputPath);
    const metadata = await image.metadata();
    
    let pipeline = image;
    
    if (metadata.width > MAX_WIDTH) {
      pipeline = pipeline.resize(MAX_WIDTH, null, { 
        withoutEnlargement: true,
        fit: 'inside'
      });
    }

    const outputPath = inputPath;
    const tempPath = inputPath + '.tmp';

    if (ext === '.png') {
      await pipeline
        .png({ 
          quality: QUALITY,
          compressionLevel: 9,
          palette: true
        })
        .toFile(tempPath);
    } else {
      await pipeline
        .jpeg({ 
          quality: QUALITY,
          mozjpeg: true
        })
        .toFile(tempPath);
    }

    const newStats = fs.statSync(tempPath);
    const newSize = newStats.size;
    const savings = ((originalSize - newSize) / originalSize * 100).toFixed(1);

    if (newSize < originalSize) {
      fs.unlinkSync(inputPath);
      fs.renameSync(tempPath, outputPath);
      console.log(`✅ ${path.basename(inputPath)}: ${(originalSize / 1024).toFixed(0)}KB → ${(newSize / 1024).toFixed(0)}KB (${savings}% saved)`);
    } else {
      fs.unlinkSync(tempPath);
      console.log(`⏭️ ${path.basename(inputPath)}: Already optimized`);
    }
  } catch (error) {
    console.error(`❌ Error optimizing ${inputPath}:`, error.message);
  }
}

async function findImages(dir) {
  const images = [];
  
  function scanDir(currentDir) {
    const files = fs.readdirSync(currentDir);
    for (const file of files) {
      const filePath = path.join(currentDir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        scanDir(filePath);
      } else if (/\.(png|jpg|jpeg)$/i.test(file)) {
        images.push(filePath);
      }
    }
  }
  
  scanDir(dir);
  return images;
}

async function main() {
  console.log('🖼️  Starting image optimization...\n');
  
  const images = await findImages(ASSETS_DIR);
  console.log(`Found ${images.length} images to process\n`);
  
  for (const imagePath of images) {
    await optimizeImage(imagePath);
  }
  
  console.log('\n✨ Image optimization complete!');
}

main().catch(console.error);
