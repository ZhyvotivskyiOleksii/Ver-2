import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const PORTFOLIO_DIR = './public/portfolio';
const OUTPUT_DIR = './public/portfolio/optimized';

// Create output directory
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Configuration
const configs = {
  // Mockups for carousel - smaller, max 600px wide
  mockup: {
    width: 600,
    quality: 80,
  },
  // Screenshots for modal - larger, max 1200px wide
  screenshot: {
    width: 1200,
    quality: 85,
  },
};

async function optimizeImage(inputPath, outputPath, config) {
  try {
    const metadata = await sharp(inputPath).metadata();
    
    // Skip if already small
    if (metadata.width <= config.width) {
      await sharp(inputPath)
        .webp({ quality: config.quality })
        .toFile(outputPath);
    } else {
      await sharp(inputPath)
        .resize(config.width, null, { withoutEnlargement: true })
        .webp({ quality: config.quality })
        .toFile(outputPath);
    }
    
    const originalSize = fs.statSync(inputPath).size;
    const newSize = fs.statSync(outputPath).size;
    const savings = ((1 - newSize / originalSize) * 100).toFixed(1);
    
    console.log(`✓ ${path.basename(inputPath)} → ${path.basename(outputPath)}`);
    console.log(`  ${(originalSize / 1024 / 1024).toFixed(2)}MB → ${(newSize / 1024).toFixed(0)}KB (${savings}% smaller)`);
    
    return { original: originalSize, optimized: newSize };
  } catch (error) {
    console.error(`✗ Error processing ${inputPath}:`, error.message);
    return { original: 0, optimized: 0 };
  }
}

async function main() {
  console.log('🖼️  Optimizing portfolio images...\n');
  
  const files = fs.readdirSync(PORTFOLIO_DIR);
  const imageFiles = files.filter(f => 
    /\.(png|jpg|jpeg|svg)$/i.test(f) && 
    !f.startsWith('.') &&
    f !== 'optimized'
  );
  
  let totalOriginal = 0;
  let totalOptimized = 0;
  
  // Process mockups (Mockup*.jpg/png)
  console.log('📦 Processing mockups (carousel images)...\n');
  const mockups = imageFiles.filter(f => /^Mockup\d+\.(jpg|png)$/i.test(f));
  
  for (const file of mockups) {
    const inputPath = path.join(PORTFOLIO_DIR, file);
    const outputName = file.replace(/\.(jpg|png)$/i, '.webp');
    const outputPath = path.join(OUTPUT_DIR, outputName);
    
    const result = await optimizeImage(inputPath, outputPath, configs.mockup);
    totalOriginal += result.original;
    totalOptimized += result.optimized;
  }
  
  // Process screenshots (Desktop_*.png, etc)
  console.log('\n📸 Processing screenshots (modal images)...\n');
  const screenshots = imageFiles.filter(f => !f.startsWith('Mockup') && /\.(png|jpg|jpeg)$/i.test(f));
  
  for (const file of screenshots) {
    const inputPath = path.join(PORTFOLIO_DIR, file);
    const outputName = file.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    const outputPath = path.join(OUTPUT_DIR, outputName);
    
    const result = await optimizeImage(inputPath, outputPath, configs.screenshot);
    totalOriginal += result.original;
    totalOptimized += result.optimized;
  }
  
  console.log('\n' + '='.repeat(50));
  console.log(`📊 Total: ${(totalOriginal / 1024 / 1024).toFixed(2)}MB → ${(totalOptimized / 1024 / 1024).toFixed(2)}MB`);
  console.log(`💾 Saved: ${((totalOriginal - totalOptimized) / 1024 / 1024).toFixed(2)}MB (${((1 - totalOptimized / totalOriginal) * 100).toFixed(1)}%)`);
  console.log('='.repeat(50));
  console.log('\n✅ Done! Optimized images are in: public/portfolio/optimized/');
}

main();




import fs from 'fs';
import path from 'path';

const PORTFOLIO_DIR = './public/portfolio';
const OUTPUT_DIR = './public/portfolio/optimized';

// Create output directory
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Configuration
const configs = {
  // Mockups for carousel - smaller, max 600px wide
  mockup: {
    width: 600,
    quality: 80,
  },
  // Screenshots for modal - larger, max 1200px wide
  screenshot: {
    width: 1200,
    quality: 85,
  },
};

async function optimizeImage(inputPath, outputPath, config) {
  try {
    const metadata = await sharp(inputPath).metadata();
    
    // Skip if already small
    if (metadata.width <= config.width) {
      await sharp(inputPath)
        .webp({ quality: config.quality })
        .toFile(outputPath);
    } else {
      await sharp(inputPath)
        .resize(config.width, null, { withoutEnlargement: true })
        .webp({ quality: config.quality })
        .toFile(outputPath);
    }
    
    const originalSize = fs.statSync(inputPath).size;
    const newSize = fs.statSync(outputPath).size;
    const savings = ((1 - newSize / originalSize) * 100).toFixed(1);
    
    console.log(`✓ ${path.basename(inputPath)} → ${path.basename(outputPath)}`);
    console.log(`  ${(originalSize / 1024 / 1024).toFixed(2)}MB → ${(newSize / 1024).toFixed(0)}KB (${savings}% smaller)`);
    
    return { original: originalSize, optimized: newSize };
  } catch (error) {
    console.error(`✗ Error processing ${inputPath}:`, error.message);
    return { original: 0, optimized: 0 };
  }
}

async function main() {
  console.log('🖼️  Optimizing portfolio images...\n');
  
  const files = fs.readdirSync(PORTFOLIO_DIR);
  const imageFiles = files.filter(f => 
    /\.(png|jpg|jpeg|svg)$/i.test(f) && 
    !f.startsWith('.') &&
    f !== 'optimized'
  );
  
  let totalOriginal = 0;
  let totalOptimized = 0;
  
  // Process mockups (Mockup*.jpg/png)
  console.log('📦 Processing mockups (carousel images)...\n');
  const mockups = imageFiles.filter(f => /^Mockup\d+\.(jpg|png)$/i.test(f));
  
  for (const file of mockups) {
    const inputPath = path.join(PORTFOLIO_DIR, file);
    const outputName = file.replace(/\.(jpg|png)$/i, '.webp');
    const outputPath = path.join(OUTPUT_DIR, outputName);
    
    const result = await optimizeImage(inputPath, outputPath, configs.mockup);
    totalOriginal += result.original;
    totalOptimized += result.optimized;
  }
  
  // Process screenshots (Desktop_*.png, etc)
  console.log('\n📸 Processing screenshots (modal images)...\n');
  const screenshots = imageFiles.filter(f => !f.startsWith('Mockup') && /\.(png|jpg|jpeg)$/i.test(f));
  
  for (const file of screenshots) {
    const inputPath = path.join(PORTFOLIO_DIR, file);
    const outputName = file.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    const outputPath = path.join(OUTPUT_DIR, outputName);
    
    const result = await optimizeImage(inputPath, outputPath, configs.screenshot);
    totalOriginal += result.original;
    totalOptimized += result.optimized;
  }
  
  console.log('\n' + '='.repeat(50));
  console.log(`📊 Total: ${(totalOriginal / 1024 / 1024).toFixed(2)}MB → ${(totalOptimized / 1024 / 1024).toFixed(2)}MB`);
  console.log(`💾 Saved: ${((totalOriginal - totalOptimized) / 1024 / 1024).toFixed(2)}MB (${((1 - totalOptimized / totalOriginal) * 100).toFixed(1)}%)`);
  console.log('='.repeat(50));
  console.log('\n✅ Done! Optimized images are in: public/portfolio/optimized/');
}

main();




import fs from 'fs';
import path from 'path';

const PORTFOLIO_DIR = './public/portfolio';
const OUTPUT_DIR = './public/portfolio/optimized';

// Create output directory
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Configuration
const configs = {
  // Mockups for carousel - smaller, max 600px wide
  mockup: {
    width: 600,
    quality: 80,
  },
  // Screenshots for modal - larger, max 1200px wide
  screenshot: {
    width: 1200,
    quality: 85,
  },
};

async function optimizeImage(inputPath, outputPath, config) {
  try {
    const metadata = await sharp(inputPath).metadata();
    
    // Skip if already small
    if (metadata.width <= config.width) {
      await sharp(inputPath)
        .webp({ quality: config.quality })
        .toFile(outputPath);
    } else {
      await sharp(inputPath)
        .resize(config.width, null, { withoutEnlargement: true })
        .webp({ quality: config.quality })
        .toFile(outputPath);
    }
    
    const originalSize = fs.statSync(inputPath).size;
    const newSize = fs.statSync(outputPath).size;
    const savings = ((1 - newSize / originalSize) * 100).toFixed(1);
    
    console.log(`✓ ${path.basename(inputPath)} → ${path.basename(outputPath)}`);
    console.log(`  ${(originalSize / 1024 / 1024).toFixed(2)}MB → ${(newSize / 1024).toFixed(0)}KB (${savings}% smaller)`);
    
    return { original: originalSize, optimized: newSize };
  } catch (error) {
    console.error(`✗ Error processing ${inputPath}:`, error.message);
    return { original: 0, optimized: 0 };
  }
}

async function main() {
  console.log('🖼️  Optimizing portfolio images...\n');
  
  const files = fs.readdirSync(PORTFOLIO_DIR);
  const imageFiles = files.filter(f => 
    /\.(png|jpg|jpeg|svg)$/i.test(f) && 
    !f.startsWith('.') &&
    f !== 'optimized'
  );
  
  let totalOriginal = 0;
  let totalOptimized = 0;
  
  // Process mockups (Mockup*.jpg/png)
  console.log('📦 Processing mockups (carousel images)...\n');
  const mockups = imageFiles.filter(f => /^Mockup\d+\.(jpg|png)$/i.test(f));
  
  for (const file of mockups) {
    const inputPath = path.join(PORTFOLIO_DIR, file);
    const outputName = file.replace(/\.(jpg|png)$/i, '.webp');
    const outputPath = path.join(OUTPUT_DIR, outputName);
    
    const result = await optimizeImage(inputPath, outputPath, configs.mockup);
    totalOriginal += result.original;
    totalOptimized += result.optimized;
  }
  
  // Process screenshots (Desktop_*.png, etc)
  console.log('\n📸 Processing screenshots (modal images)...\n');
  const screenshots = imageFiles.filter(f => !f.startsWith('Mockup') && /\.(png|jpg|jpeg)$/i.test(f));
  
  for (const file of screenshots) {
    const inputPath = path.join(PORTFOLIO_DIR, file);
    const outputName = file.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    const outputPath = path.join(OUTPUT_DIR, outputName);
    
    const result = await optimizeImage(inputPath, outputPath, configs.screenshot);
    totalOriginal += result.original;
    totalOptimized += result.optimized;
  }
  
  console.log('\n' + '='.repeat(50));
  console.log(`📊 Total: ${(totalOriginal / 1024 / 1024).toFixed(2)}MB → ${(totalOptimized / 1024 / 1024).toFixed(2)}MB`);
  console.log(`💾 Saved: ${((totalOriginal - totalOptimized) / 1024 / 1024).toFixed(2)}MB (${((1 - totalOptimized / totalOriginal) * 100).toFixed(1)}%)`);
  console.log('='.repeat(50));
  console.log('\n✅ Done! Optimized images are in: public/portfolio/optimized/');
}

main();







