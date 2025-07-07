# Deployment Guide

This guide covers deploying the Node.js Interview Preparation Site to GitHub Pages.

## Prerequisites

- GitHub repository with the project code
- Node.js 18+ installed locally
- npm or yarn package manager

## Automatic Deployment (Recommended)

The project is configured for automatic deployment using GitHub Actions.

### Setup Steps

1. **Push your code to GitHub**:
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Enable GitHub Pages**:
   - Go to your repository on GitHub
   - Navigate to Settings > Pages
   - Under "Source", select "GitHub Actions"
   - The deployment workflow will automatically trigger

3. **Access your site**:
   - Your site will be available at: `https://[username].github.io/[repository-name]`
   - The first deployment may take a few minutes

### Workflow Details

The GitHub Actions workflow (`.github/workflows/deploy.yml`) automatically:

- Triggers on pushes to `main` branch
- Installs Node.js 18 and dependencies
- Builds the static site using `npm run build`
- Deploys to GitHub Pages

## Manual Deployment

If you prefer to deploy manually or to a different hosting service:

### Local Build

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Build the site**:
   ```bash
   npm run build
   ```

3. **The static files will be in the `out/` directory**

### Deploy to Other Services

The `out/` directory contains a complete static site that can be deployed to:

- **Vercel**: Connect your GitHub repository
- **Netlify**: Drag and drop the `out/` folder or connect via Git
- **AWS S3**: Upload the `out/` contents to an S3 bucket
- **Any static hosting service**: Upload the `out/` contents

## Configuration

### Environment Variables

The site uses these environment variables (optional):

- `NEXT_PUBLIC_BASE_PATH`: Base path for the site (for subdirectory deployments)
- `NEXT_PUBLIC_ASSET_PREFIX`: Asset prefix for CDN usage

### Custom Domain

To use a custom domain with GitHub Pages:

1. **Add CNAME file**:
   ```bash
   echo "yourdomain.com" > public/CNAME
   ```

2. **Configure DNS**:
   - Add a CNAME record pointing to `[username].github.io`
   - Or add A records pointing to GitHub Pages IPs

3. **Enable HTTPS**:
   - Go to repository Settings > Pages
   - Check "Enforce HTTPS"

## Troubleshooting

### Build Failures

If the build fails:

1. **Check the Actions tab** in your GitHub repository for error details
2. **Run locally** to test: `npm run build`
3. **Check dependencies**: `npm install`

### Common Issues

1. **404 errors**: Ensure `trailingSlash: true` in `next.config.ts`
2. **Asset loading issues**: Check `images.unoptimized: true` setting
3. **Dynamic routes**: Ensure `generateStaticParams` is implemented

### Local Testing

Test the built site locally:

```bash
# Build the site
npm run build

# Serve locally
npm run serve

# Open http://localhost:3000
```

## Performance Optimization

The site is optimized for static hosting with:

- **Static export**: No server-side rendering required
- **Code splitting**: Automatic chunk splitting for better caching
- **Image optimization**: Unoptimized images for static hosting
- **Bundle analysis**: Run `npm run build:analyze` to analyze bundle size

## Security

- **HTTPS**: Automatically enabled on GitHub Pages
- **Content Security Policy**: Configure in `next.config.ts` if needed
- **No server secrets**: All code is client-side safe

## Monitoring

Monitor your deployment:

- **GitHub Actions**: Check the Actions tab for deployment status
- **GitHub Pages**: Settings > Pages shows deployment status
- **Analytics**: Add Google Analytics or similar if needed

## Updates

To update the site:

1. Make changes to your code
2. Commit and push to the `main` branch
3. GitHub Actions will automatically rebuild and deploy
4. Changes will be live within a few minutes

## Support

If you encounter issues:

1. Check the GitHub Actions logs
2. Verify your Next.js configuration
3. Test the build locally
4. Check GitHub Pages documentation