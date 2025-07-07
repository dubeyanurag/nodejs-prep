# GitHub Pages Deployment Checklist

## Pre-Deployment Setup

- [ ] Repository is public (required for free GitHub Pages)
- [ ] Code is pushed to `main` or `master` branch
- [ ] All dependencies are properly listed in `package.json`
- [ ] Build process works locally (`npm run build`)

## GitHub Pages Configuration

- [ ] Go to repository Settings > Pages
- [ ] Set Source to "GitHub Actions"
- [ ] Verify branch is set correctly (main/master)
- [ ] Custom domain configured (if applicable)

## Deployment Files Checklist

- [ ] `.github/workflows/deploy.yml` - GitHub Actions workflow
- [ ] `next.config.ts` - Next.js configuration with `output: 'export'`
- [ ] `public/.nojekyll` - Prevents Jekyll processing
- [ ] `public/404.html` - Custom 404 page
- [ ] `public/robots.txt` - SEO configuration
- [ ] `scripts/generate-sitemap.js` - Sitemap generation
- [ ] `DEPLOYMENT.md` - Deployment documentation

## Build Configuration Verification

- [ ] `output: 'export'` in `next.config.ts`
- [ ] `trailingSlash: true` for proper routing
- [ ] `images.unoptimized: true` for static hosting
- [ ] All dynamic routes have `generateStaticParams`

## Content Verification

- [ ] All markdown content files are present
- [ ] Images and assets are in `public/` directory
- [ ] No server-side only code in components
- [ ] All imports are properly resolved

## Testing

- [ ] Local build works: `npm run build`
- [ ] Local serve works: `npm run serve`
- [ ] All pages load without errors
- [ ] Navigation works correctly
- [ ] Search functionality works
- [ ] Responsive design works on mobile

## Post-Deployment

- [ ] Site is accessible at GitHub Pages URL
- [ ] All pages load correctly
- [ ] Assets (CSS, JS, images) load properly
- [ ] Search functionality works
- [ ] 404 page displays correctly
- [ ] Sitemap is generated and accessible

## Troubleshooting

### Common Issues

1. **404 on all pages except home**
   - Check `trailingSlash: true` in `next.config.ts`
   - Verify `generateStaticParams` for dynamic routes

2. **Assets not loading**
   - Check `images.unoptimized: true`
   - Verify asset paths are relative

3. **Build fails in GitHub Actions**
   - Check Actions tab for detailed error logs
   - Verify all dependencies are in `package.json`
   - Test build locally first

4. **Site not updating**
   - Check Actions tab for deployment status
   - Clear browser cache
   - Verify changes were pushed to correct branch

### Debug Commands

```bash
# Test build locally
npm run build

# Serve built site locally
npm run serve

# Generate sitemap manually
npm run sitemap

# Run deployment script
npm run deploy
```

## Performance Optimization

- [ ] Bundle size is reasonable (check with `npm run build:analyze`)
- [ ] Images are optimized
- [ ] Code splitting is working
- [ ] Lighthouse score is good

## SEO Optimization

- [ ] Meta tags are properly set
- [ ] Sitemap is generated and submitted
- [ ] robots.txt is configured
- [ ] Open Graph tags are set
- [ ] Structured data is included (if applicable)

## Security

- [ ] No sensitive data in client-side code
- [ ] HTTPS is enabled (automatic with GitHub Pages)
- [ ] Content Security Policy configured (if needed)

## Monitoring

- [ ] Google Analytics configured (if desired)
- [ ] Error tracking set up (if desired)
- [ ] Performance monitoring enabled (if desired)