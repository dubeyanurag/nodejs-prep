#!/bin/bash

# Setup script for GitHub Pages deployment
# This script helps configure the repository for deployment

set -e

echo "🚀 Setting up GitHub Pages deployment..."

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "❌ This is not a git repository. Please run 'git init' first."
    exit 1
fi

# Check if remote origin exists
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "❌ No remote origin found. Please add your GitHub repository as origin:"
    echo "   git remote add origin https://github.com/USERNAME/REPOSITORY.git"
    exit 1
fi

# Get repository information
REMOTE_URL=$(git remote get-url origin)
if [[ $REMOTE_URL =~ github\.com[:/]([^/]+)/([^/.]+) ]]; then
    USERNAME="${BASH_REMATCH[1]}"
    REPO_NAME="${BASH_REMATCH[2]}"
    SITE_URL="https://${USERNAME}.github.io/${REPO_NAME}"
    
    echo "📍 Repository: ${USERNAME}/${REPO_NAME}"
    echo "🌐 Site URL: ${SITE_URL}"
else
    echo "❌ Could not parse GitHub repository URL"
    exit 1
fi

# Update robots.txt with correct URL
echo "🤖 Updating robots.txt..."
sed -i.bak "s|\[your-username\]|${USERNAME}|g" public/robots.txt
sed -i.bak "s|\[your-repo-name\]|${REPO_NAME}|g" public/robots.txt
rm -f public/robots.txt.bak

# Update sitemap script with correct URL
echo "🗺️  Updating sitemap configuration..."
export SITE_URL="${SITE_URL}"

# Test the build process
echo "🔨 Testing build process..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed. Please fix the errors before deploying."
    exit 1
fi

# Check if main branch exists
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ] && [ "$CURRENT_BRANCH" != "master" ]; then
    echo "⚠️  Current branch is '${CURRENT_BRANCH}'. GitHub Pages deploys from 'main' or 'master'."
    read -p "Would you like to create and switch to 'main' branch? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git checkout -b main
        echo "✅ Switched to 'main' branch"
    fi
fi

# Commit changes if there are any
if ! git diff --quiet || ! git diff --cached --quiet; then
    echo "📝 Committing deployment configuration changes..."
    git add .
    git commit -m "Configure GitHub Pages deployment"
fi

# Push to remote
echo "📤 Pushing to remote repository..."
git push -u origin $(git branch --show-current)

echo ""
echo "🎉 Deployment setup complete!"
echo ""
echo "Next steps:"
echo "1. Go to https://github.com/${USERNAME}/${REPO_NAME}/settings/pages"
echo "2. Set Source to 'GitHub Actions'"
echo "3. Your site will be available at: ${SITE_URL}"
echo ""
echo "The deployment will start automatically when you push changes to the main branch."
echo "Check the Actions tab to monitor deployment progress."