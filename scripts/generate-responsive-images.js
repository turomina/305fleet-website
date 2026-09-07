import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const vehicles = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/vehicles.json'), 'utf-8'));

const SIZES = [
  { width: 400, suffix: '400w' },
  { width: 600, suffix: '600w' },
  { width: 800, suffix: '800w' },
  { width: 1200, suffix: '1200w' },
  { width: 1600, suffix: '1600w' }
];

const QUALITY = { webp: 82, avif: 65 };

async function generateVariants(inputPath) {
  const dir = path.dirname(inputPath);
  const ext = path.extname(inputPath);
  const base = path.basename(inputPath, ext);
  
  const variants = [];
  
  for (const size of SIZES) {
    const webpPath = path.join(dir, `${base}-${size.suffix}.webp`);
    const avifPath = path.join(dir, `${base}-${size.suffix}.avif`);
    
    if (!fs.existsSync(webpPath)) {
      await sharp(inputPath)
        .resize(size.width, null, { withoutEnlargement: true })
        .webp({ quality: QUALITY.webp })
        .toFile(webpPath);
    }
    
    if (!fs.existsSync(avifPath)) {
      await sharp(inputPath)
        .resize(size.width, null, { withoutEnlargement: true })
        .avif({ quality: QUALITY.avif })
        .toFile(avifPath);
    }
    
    variants.push({
      width: size.width,
      webp: webpPath,
      avif: avifPath
    });
  }
  
  return variants;
}

async function main() {
  const published = vehicles.filter(v => 
    v.publication_status === 'preview_only' || v.publication_status === 'published'
  );
  
  console.log(`Processing ${published.length} vehicles...\n`);
  
  for (const vehicle of published) {
    if (!vehicle.hero_image) continue;
    
    const heroPath = path.join(__dirname, '../public', vehicle.hero_image);
    if (!fs.existsSync(heroPath)) {
      console.log(`⚠️  Missing: ${vehicle.slug}`);
      continue;
    }
    
    console.log(`📷 ${vehicle.slug}`);
    const variants = await generateVariants(heroPath);
    
    const sizes = variants.map(v => v.width).join(', ');
    console.log(`   Generated: ${sizes}\n`);
  }
  
  console.log('✅ Done!');
}

main().catch(console.error);
