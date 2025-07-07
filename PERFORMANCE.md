# Performance Optimization Guide

This document outlines the performance optimizations implemented in the Node.js Interview Prep site.

## Implemented Optimizations

### 1. Code Splitting and Bundle Optimization

- **Webpack Bundle Splitting**: Configured custom chunk splitting for vendor libraries, common code, and heavy libraries (Mermaid, Prism)
- **Dynamic Imports**: Heavy components are lazy-loaded using React.lazy()
- **Tree Shaking**: Unused code is automatically removed during build
- **Bundle Analysis**: Use `npm run build:analyze` to analyze bundle sizes

### 2. Service Worker and Caching

- **Offline Support**: Service worker provides offline functionality with fallback pages
- **Cache Strategies**: 
  - Cache First for static assets (JS, CSS, images)
  - Network First for pages with offline fallback
  - Network Only for API requests
- **Cache Management**: Automatic cache cleanup and versioning

### 3. Lazy Loading

- **Component Lazy Loading**: Heavy components load only when needed
- **Intersection Observer**: Content loads when it enters the viewport
- **Image Lazy Loading**: Images load progressively as user scrolls
- **Route-based Code Splitting**: Each page loads its own bundle

### 4. Resource Optimization

- **Font Optimization**: Fonts use `display: swap` for better loading performance
- **Preconnect**: DNS resolution for external domains happens early
- **Resource Hints**: Critical resources are preloaded
- **Compression**: Gzip/Brotli compression enabled

### 5. Performance Monitoring

- **Web Vitals**: Tracks LCP, FID, CLS metrics
- **Resource Timing**: Monitors network performance
- **Memory Usage**: Tracks JavaScript heap usage
- **Bundle Size**: Monitors asset sizes

## Performance Scripts

```bash
# Build with bundle analysis
npm run build:analyze

# Run Lighthouse audit
npm run lighthouse

# Full performance audit
npm run perf:audit
```

## Performance Budget

The site maintains the following performance budget:

- **Largest Contentful Paint (LCP)**: < 2.5s
- **First Input Delay (FID)**: < 100ms
- **Cumulative Layout Shift (CLS)**: < 0.1
- **Bundle Size**: < 500KB initial load
- **Image Size**: < 200KB per image

## Optimization Checklist

### Build Optimization
- [x] Code splitting configured
- [x] Bundle analysis available
- [x] Tree shaking enabled
- [x] Minification enabled
- [x] Compression enabled

### Runtime Optimization
- [x] Service worker implemented
- [x] Lazy loading for components
- [x] Intersection observer for content
- [x] Image optimization
- [x] Font optimization

### Monitoring
- [x] Web Vitals tracking
- [x] Performance observer
- [x] Resource timing
- [x] Memory monitoring
- [x] Bundle size tracking

## Best Practices

### Component Loading
```typescript
// Use lazy loading for heavy components
const HeavyComponent = lazy(() => import('./HeavyComponent'));

// Wrap in Suspense with fallback
<Suspense fallback={<LoadingSkeleton />}>
  <HeavyComponent />
</Suspense>
```

### Image Optimization
```jsx
// Use proper loading attributes
<img 
  src="/image.jpg" 
  alt="Description"
  loading="lazy"
  width="400"
  height="300"
/>
```

### Resource Preloading
```html
<!-- Preload critical resources -->
<link rel="preload" href="/critical.css" as="style">
<link rel="preload" href="/critical.js" as="script">
```

## Monitoring and Debugging

### Chrome DevTools
1. **Performance Tab**: Analyze runtime performance
2. **Network Tab**: Check resource loading
3. **Lighthouse**: Run performance audits
4. **Coverage Tab**: Find unused code

### Bundle Analysis
```bash
# Generate bundle analysis
npm run build:analyze

# This opens an interactive bundle analyzer
# showing which modules contribute to bundle size
```

### Performance Monitoring
The app automatically tracks performance metrics in the browser console. Check for:
- LCP, FID, CLS values
- Resource loading times
- Memory usage
- Bundle information

## Deployment Optimizations

### Static Export
- Site is built as static files for optimal CDN caching
- No server-side rendering overhead
- Fast global distribution

### CDN Configuration
Recommended CDN settings:
- Cache static assets for 1 year
- Cache HTML for 1 hour
- Enable Brotli/Gzip compression
- Use HTTP/2 push for critical resources

## Future Optimizations

### Planned Improvements
- [ ] Image format optimization (WebP, AVIF)
- [ ] Critical CSS inlining
- [ ] Service worker background sync
- [ ] Push notifications for updates
- [ ] Advanced caching strategies

### Monitoring Enhancements
- [ ] Real User Monitoring (RUM)
- [ ] Performance analytics dashboard
- [ ] Automated performance regression testing
- [ ] Core Web Vitals alerts

## Troubleshooting

### Common Issues

**Slow Initial Load**
- Check bundle size with analyzer
- Verify code splitting is working
- Ensure critical resources are preloaded

**Poor LCP Score**
- Optimize largest content element
- Preload hero images
- Reduce render-blocking resources

**High CLS Score**
- Set explicit dimensions for images
- Reserve space for dynamic content
- Avoid inserting content above existing content

**Service Worker Issues**
- Check browser console for errors
- Verify service worker registration
- Clear cache and reload

## Resources

- [Web Vitals](https://web.dev/vitals/)
- [Next.js Performance](https://nextjs.org/docs/advanced-features/measuring-performance)
- [Bundle Analyzer](https://www.npmjs.com/package/@next/bundle-analyzer)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)