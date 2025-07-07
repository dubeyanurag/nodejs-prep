#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔨 Testing build process...');

try {
  // Clean previous build
  if (fs.existsSync('out')) {
    console.log('🧹 Cleaning previous build...');
    fs.rmSync('out', { recursive: true, force: true });
  }

  if (fs.existsSync('.next')) {
    console.log('🧹 Cleaning .next directory...');
    fs.rmSync('.next', { recursive: true, force: true });
  }

  // Run the build
  console.log('🚀 Running Next.js build...');
  const buildOutput = execSync('npx next build', { 
    encoding: 'utf8',
    stdio: 'pipe'
  });
  
  console.log('Build output:', buildOutput);

  // Check if out directory was created
  if (fs.existsSync('out')) {
    console.log('✅ Build successful! Output directory created.');
    
    // List contents
    const files = fs.readdirSync('out');
    console.log('📁 Output files:', files.slice(0, 10));
    
    if (files.length > 10) {
      console.log(`... and ${files.length - 10} more files`);
    }
  } else {
    console.log('❌ Build completed but no output directory found.');
    console.log('This might indicate an issue with static export configuration.');
  }

} catch (error) {
  console.error('❌ Build failed:', error.message);
  if (error.stdout) {
    console.log('STDOUT:', error.stdout);
  }
  if (error.stderr) {
    console.log('STDERR:', error.stderr);
  }
  process.exit(1);
}