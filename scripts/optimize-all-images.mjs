import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, '../public');

// Skip these directories
const SKIP_DIRS = ['portfolio']; // Already optimized

// Get all PNG/JPG files recursively
function getAllImageFiles(dir, files = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.includes(entry.name)) {
        getAllImageFiles(fullPath, files);
      }
    } else if (/\.(png|jpg|jpeg)$/i.test(entry.name)) {
      files.push(fullPath);
    }
  }
  
  return files;
}

async function optimizeImage(inputPath) {
  const dir = path.dirname(inputPath);
  const ext = path.extname(inputPath);
  const baseName = path.basename(inputPath, ext);
  const webpPath = path.join(dir, `${baseName}.webp`);
  
  try {
    const stats = fs.statSync(inputPath);
    
    // Skip if already small (<50KB)
    if (stats.size < 50 * 1024) {
      console.log(`⏭️  ${path.relative(PUBLIC_DIR, inputPath)} - already small (${(stats.size / 1024).toFixed(0)}KB)`);
      return { original: 0, optimized: 0, skipped: true };
    }
    
    const metadata = await sharp(inputPath).metadata();
    const maxWidth = 1200;
    
    let pipeline = sharp(inputPath);
    
    // Resize if too large
    if (metadata.width > maxWidth) {
      pipeline = pipeline.resize(maxWidth, null, { withoutEnlargement: true });
    }
    
    await pipeline.webp({ quality: 85 }).toFile(webpPath);
    
    const newStats = fs.statSync(webpPath);
    const savings = ((1 - newStats.size / stats.size) * 100).toFixed(1);
    
    console.log(`✓ ${path.relative(PUBLIC_DIR, inputPath)}`);
    console.log(`  ${(stats.size / 1024).toFixed(0)}KB → ${(newStats.size / 1024).toFixed(0)}KB (${savings}% smaller)`);
    console.log(`  → ${path.relative(PUBLIC_DIR, webpPath)}`);
    
    return { original: stats.size, optimized: newStats.size, skipped: false };
  } catch (error) {
    console.error(`✗ Error: ${inputPath}:`, error.message);
    return { original: 0, optimized: 0, skipped: true };
  }
}

async function main() {
  console.log('🖼️  Optimizing all images in public/...\n');
  
  const imageFiles = getAllImageFiles(PUBLIC_DIR);
  console.log(`Found ${imageFiles.length} image files\n`);
  
  let totalOriginal = 0;
  let totalOptimized = 0;
  let processed = 0;
  
  for (const file of imageFiles) {
    const result = await optimizeImage(file);
    if (!result.skipped) {
      totalOriginal += result.original;
      totalOptimized += result.optimized;
      processed++;
    }
  }
  
  if (processed > 0) {
    console.log('\n' + '='.repeat(50));
    console.log(`📊 Processed: ${processed} files`);
    console.log(`📊 Total: ${(totalOriginal / 1024 / 1024).toFixed(2)}MB → ${(totalOptimized / 1024 / 1024).toFixed(2)}MB`);
    console.log(`💾 Saved: ${((totalOriginal - totalOptimized) / 1024 / 1024).toFixed(2)}MB (${((1 - totalOptimized / totalOriginal) * 100).toFixed(1)}%)`);
    console.log('='.repeat(50));
  }
  
  console.log('\n✅ Done! Now update your code to use .webp files');
}

main();




import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, '../public');

// Skip these directories
const SKIP_DIRS = ['portfolio']; // Already optimized

// Get all PNG/JPG files recursively
function getAllImageFiles(dir, files = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.includes(entry.name)) {
        getAllImageFiles(fullPath, files);
      }
    } else if (/\.(png|jpg|jpeg)$/i.test(entry.name)) {
      files.push(fullPath);
    }
  }
  
  return files;
}

async function optimizeImage(inputPath) {
  const dir = path.dirname(inputPath);
  const ext = path.extname(inputPath);
  const baseName = path.basename(inputPath, ext);
  const webpPath = path.join(dir, `${baseName}.webp`);
  
  try {
    const stats = fs.statSync(inputPath);
    
    // Skip if already small (<50KB)
    if (stats.size < 50 * 1024) {
      console.log(`⏭️  ${path.relative(PUBLIC_DIR, inputPath)} - already small (${(stats.size / 1024).toFixed(0)}KB)`);
      return { original: 0, optimized: 0, skipped: true };
    }
    
    const metadata = await sharp(inputPath).metadata();
    const maxWidth = 1200;
    
    let pipeline = sharp(inputPath);
    
    // Resize if too large
    if (metadata.width > maxWidth) {
      pipeline = pipeline.resize(maxWidth, null, { withoutEnlargement: true });
    }
    
    await pipeline.webp({ quality: 85 }).toFile(webpPath);
    
    const newStats = fs.statSync(webpPath);
    const savings = ((1 - newStats.size / stats.size) * 100).toFixed(1);
    
    console.log(`✓ ${path.relative(PUBLIC_DIR, inputPath)}`);
    console.log(`  ${(stats.size / 1024).toFixed(0)}KB → ${(newStats.size / 1024).toFixed(0)}KB (${savings}% smaller)`);
    console.log(`  → ${path.relative(PUBLIC_DIR, webpPath)}`);
    
    return { original: stats.size, optimized: newStats.size, skipped: false };
  } catch (error) {
    console.error(`✗ Error: ${inputPath}:`, error.message);
    return { original: 0, optimized: 0, skipped: true };
  }
}

async function main() {
  console.log('🖼️  Optimizing all images in public/...\n');
  
  const imageFiles = getAllImageFiles(PUBLIC_DIR);
  console.log(`Found ${imageFiles.length} image files\n`);
  
  let totalOriginal = 0;
  let totalOptimized = 0;
  let processed = 0;
  
  for (const file of imageFiles) {
    const result = await optimizeImage(file);
    if (!result.skipped) {
      totalOriginal += result.original;
      totalOptimized += result.optimized;
      processed++;
    }
  }
  
  if (processed > 0) {
    console.log('\n' + '='.repeat(50));
    console.log(`📊 Processed: ${processed} files`);
    console.log(`📊 Total: ${(totalOriginal / 1024 / 1024).toFixed(2)}MB → ${(totalOptimized / 1024 / 1024).toFixed(2)}MB`);
    console.log(`💾 Saved: ${((totalOriginal - totalOptimized) / 1024 / 1024).toFixed(2)}MB (${((1 - totalOptimized / totalOriginal) * 100).toFixed(1)}%)`);
    console.log('='.repeat(50));
  }
  
  console.log('\n✅ Done! Now update your code to use .webp files');
}

main();




import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, '../public');

// Skip these directories
const SKIP_DIRS = ['portfolio']; // Already optimized

// Get all PNG/JPG files recursively
function getAllImageFiles(dir, files = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.includes(entry.name)) {
        getAllImageFiles(fullPath, files);
      }
    } else if (/\.(png|jpg|jpeg)$/i.test(entry.name)) {
      files.push(fullPath);
    }
  }
  
  return files;
}

async function optimizeImage(inputPath) {
  const dir = path.dirname(inputPath);
  const ext = path.extname(inputPath);
  const baseName = path.basename(inputPath, ext);
  const webpPath = path.join(dir, `${baseName}.webp`);
  
  try {
    const stats = fs.statSync(inputPath);
    
    // Skip if already small (<50KB)
    if (stats.size < 50 * 1024) {
      console.log(`⏭️  ${path.relative(PUBLIC_DIR, inputPath)} - already small (${(stats.size / 1024).toFixed(0)}KB)`);
      return { original: 0, optimized: 0, skipped: true };
    }
    
    const metadata = await sharp(inputPath).metadata();
    const maxWidth = 1200;
    
    let pipeline = sharp(inputPath);
    
    // Resize if too large
    if (metadata.width > maxWidth) {
      pipeline = pipeline.resize(maxWidth, null, { withoutEnlargement: true });
    }
    
    await pipeline.webp({ quality: 85 }).toFile(webpPath);
    
    const newStats = fs.statSync(webpPath);
    const savings = ((1 - newStats.size / stats.size) * 100).toFixed(1);
    
    console.log(`✓ ${path.relative(PUBLIC_DIR, inputPath)}`);
    console.log(`  ${(stats.size / 1024).toFixed(0)}KB → ${(newStats.size / 1024).toFixed(0)}KB (${savings}% smaller)`);
    console.log(`  → ${path.relative(PUBLIC_DIR, webpPath)}`);
    
    return { original: stats.size, optimized: newStats.size, skipped: false };
  } catch (error) {
    console.error(`✗ Error: ${inputPath}:`, error.message);
    return { original: 0, optimized: 0, skipped: true };
  }
}

async function main() {
  console.log('🖼️  Optimizing all images in public/...\n');
  
  const imageFiles = getAllImageFiles(PUBLIC_DIR);
  console.log(`Found ${imageFiles.length} image files\n`);
  
  let totalOriginal = 0;
  let totalOptimized = 0;
  let processed = 0;
  
  for (const file of imageFiles) {
    const result = await optimizeImage(file);
    if (!result.skipped) {
      totalOriginal += result.original;
      totalOptimized += result.optimized;
      processed++;
    }
  }
  
  if (processed > 0) {
    console.log('\n' + '='.repeat(50));
    console.log(`📊 Processed: ${processed} files`);
    console.log(`📊 Total: ${(totalOriginal / 1024 / 1024).toFixed(2)}MB → ${(totalOptimized / 1024 / 1024).toFixed(2)}MB`);
    console.log(`💾 Saved: ${((totalOriginal - totalOptimized) / 1024 / 1024).toFixed(2)}MB (${((1 - totalOptimized / totalOriginal) * 100).toFixed(1)}%)`);
    console.log('='.repeat(50));
  }
  
  console.log('\n✅ Done! Now update your code to use .webp files');
}

main();







