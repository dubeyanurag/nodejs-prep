#!/bin/bash

# Deployment script for Node.js Interview Prep Site
# This script builds the static site and prepares it for deployment

set -e

echo "🚀 Starting deployment build..."

# Clean previous build
echo "🧹 Cleaning previous build..."
rm -rf out/

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Run tests
echo "🧪 Running tests..."
npm test

# Build the application
echo "🔨 Building application..."
npm run build

# Add .nojekyll file to prevent Jekyll processing
echo "📝 Adding .nojekyll file..."
touch out/.nojekyll

# Create robots.txt if it doesn't exist
if [ ! -f out/robots.txt ]; then
    echo "🤖 Creating robots.txt..."
    cat > out/robots.txt << EOF
User-agent: *
Allow: /

Sitemap: https://[your-domain]/sitemap.xml
EOF
fi

echo "✅ Build completed successfully!"
echo "📁 Static files are ready in the 'out/' directory"
echo "🌐 You can now deploy the contents of 'out/' to any static hosting service"

# Optional: Start local server to preview
read -p "🔍 Would you like to preview the build locally? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🌐 Starting local server..."
    npm run serve
fi