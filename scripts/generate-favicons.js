import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const logoPath = join(__dirname, '../attached_assets/Logo5Nobackground1_1762920314202.png');
const outputDir = join(__dirname, '../client/public/favicons');

const sizes = [128, 96, 64];

async function generateFavicons() {
  console.log('Generating optimized favicons...');
  
  for (const size of sizes) {
    const outputPath = join(outputDir, `favicon-${size}x${size}.png`);
    
    await sharp(logoPath)
      .resize(size, size, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png({ quality: 90, compressionLevel: 9 })
      .toFile(outputPath);
    
    console.log(`✓ Generated ${size}x${size} favicon`);
  }
  
  console.log('Done! All favicons generated successfully.');
}

generateFavicons().catch(console.error);
