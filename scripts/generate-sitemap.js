#!/usr/bin/env node

/**
 * Generate sitemap.xml for the Node.js Interview Prep Site
 * This script should be run after the build process
 */

const fs = require('fs');
const path = require('path');

// Configuration
const SITE_URL = process.env.SITE_URL || 'https://[your-username].github.io/[your-repo-name]';
const BUILD_DIR = path.join(__dirname, '../out');
const SITEMAP_PATH = path.join(BUILD_DIR, 'sitemap.xml');

// Priority and change frequency for different page types
const PAGE_CONFIG = {
  '/': { priority: '1.0', changefreq: 'weekly' },
  '/flashcards': { priority: '0.8', changefreq: 'weekly' },
  '/search': { priority: '0.7', changefreq: 'monthly' },
  '/progress': { priority: '0.6', changefreq: 'monthly' },
  '/quick-reference': { priority: '0.8', changefreq: 'weekly' },
  // Category pages
  'category': { priority: '0.9', changefreq: 'weekly' },
  // Topic pages
  'topic': { priority: '0.8', changefreq: 'weekly' }
};

function getAllHtmlFiles(dir, baseDir = dir) {
  const files = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      files.push(...getAllHtmlFiles(fullPath, baseDir));
    } else if (item.endsWith('.html')) {
      const relativePath = path.relative(baseDir, fullPath);
      files.push(relativePath);
    }
  }
  
  return files;
}

function generateSitemap() {
  if (!fs.existsSync(BUILD_DIR)) {
    console.error('Build directory not found. Please run "npm run build" first.');
    process.exit(1);
  }
  
  const htmlFiles = getAllHtmlFiles(BUILD_DIR);
  const currentDate = new Date().toISOString().split('T')[0];
  
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  for (const file of htmlFiles) {
    // Convert file path to URL path
    let urlPath = file.replace(/\\/g, '/').replace(/\.html$/, '');
    
    // Handle index files
    if (urlPath.endsWith('/index')) {
      urlPath = urlPath.replace('/index', '');
    }
    
    // Ensure path starts with /
    if (!urlPath.startsWith('/')) {
      urlPath = '/' + urlPath;
    }
    
    // Handle root index
    if (urlPath === '/index') {
      urlPath = '/';
    }
    
    // Determine page configuration
    let config = PAGE_CONFIG[urlPath] || { priority: '0.7', changefreq: 'weekly' };
    
    // Special handling for category and topic pages
    if (urlPath.includes('/') && urlPath !== '/') {
      const segments = urlPath.split('/').filter(Boolean);
      if (segments.length === 1) {
        config = PAGE_CONFIG.category;
      } else if (segments.length === 2) {
        config = PAGE_CONFIG.topic;
      }
    }
    
    const fullUrl = `${SITE_URL}${urlPath}`;
    
    sitemap += `
  <url>
    <loc>${fullUrl}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${config.changefreq}</changefreq>
    <priority>${config.priority}</priority>
  </url>`;
  }
  
  sitemap += `
</urlset>`;

  fs.writeFileSync(SITEMAP_PATH, sitemap);
  console.log(`✅ Sitemap generated with ${htmlFiles.length} URLs`);
  console.log(`📍 Sitemap saved to: ${SITEMAP_PATH}`);
  console.log(`🌐 Site URL: ${SITE_URL}`);
  
  // Also generate a simple robots.txt if it doesn't exist
  const robotsPath = path.join(BUILD_DIR, 'robots.txt');
  if (!fs.existsSync(robotsPath)) {
    const robotsContent = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml`;
    
    fs.writeFileSync(robotsPath, robotsContent);
    console.log(`🤖 robots.txt generated`);
  }
}

if (require.main === module) {
  generateSitemap();
}

module.exports = { generateSitemap };