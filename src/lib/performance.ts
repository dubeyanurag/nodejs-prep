// Performance monitoring and optimization utilities

// Web Vitals tracking
export interface WebVitalsMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
}

// Performance observer for monitoring
export function initPerformanceMonitoring() {
  if (typeof window === 'undefined') return;

  // Monitor Largest Contentful Paint (LCP)
  if ('PerformanceObserver' in window) {
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        
        if (lastEntry) {
          console.log('LCP:', lastEntry.startTime);
          // Send to analytics if needed
        }
      });
      
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
    } catch (e) {
      console.warn('LCP observer not supported');
    }

    // Monitor First Input Delay (FID)
    try {
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          console.log('FID:', entry.processingStart - entry.startTime);
          // Send to analytics if needed
        });
      });
      
      fidObserver.observe({ type: 'first-input', buffered: true });
    } catch (e) {
      console.warn('FID observer not supported');
    }

    // Monitor Cumulative Layout Shift (CLS)
    try {
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        console.log('CLS:', clsValue);
      });
      
      clsObserver.observe({ type: 'layout-shift', buffered: true });
    } catch (e) {
      console.warn('CLS observer not supported');
    }
  }
}

// Resource loading performance
export function trackResourceLoading() {
  if (typeof window === 'undefined') return;

  window.addEventListener('load', () => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    if (navigation) {
      const metrics = {
        dns: navigation.domainLookupEnd - navigation.domainLookupStart,
        tcp: navigation.connectEnd - navigation.connectStart,
        ssl: navigation.connectEnd - navigation.secureConnectionStart,
        ttfb: navigation.responseStart - navigation.requestStart,
        download: navigation.responseEnd - navigation.responseStart,
        domParse: navigation.domContentLoadedEventStart - navigation.responseEnd,
        domReady: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        total: navigation.loadEventEnd - navigation.navigationStart,
      };

      console.log('Navigation Timing:', metrics);
      
      // Track resource loading
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      const resourceMetrics = resources.map(resource => ({
        name: resource.name,
        duration: resource.duration,
        size: resource.transferSize,
        type: resource.initiatorType,
      }));

      console.log('Resource Loading:', resourceMetrics);
    }
  });
}

// Memory usage monitoring
export function trackMemoryUsage() {
  if (typeof window === 'undefined' || !('memory' in performance)) return;

  const memory = (performance as any).memory;
  
  const memoryInfo = {
    used: Math.round(memory.usedJSHeapSize / 1048576), // MB
    total: Math.round(memory.totalJSHeapSize / 1048576), // MB
    limit: Math.round(memory.jsHeapSizeLimit / 1048576), // MB
  };

  console.log('Memory Usage:', memoryInfo);
  return memoryInfo;
}

// Bundle size tracking
export function trackBundleSize() {
  if (typeof window === 'undefined') return;

  const scripts = Array.from(document.querySelectorAll('script[src]'));
  const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
  
  const bundleInfo = {
    scripts: scripts.length,
    styles: styles.length,
    totalResources: scripts.length + styles.length,
  };

  console.log('Bundle Info:', bundleInfo);
  return bundleInfo;
}

// Performance budget checker
export interface PerformanceBudget {
  lcp: number; // ms
  fid: number; // ms
  cls: number; // score
  bundleSize: number; // KB
  imageSize: number; // KB
}

export const DEFAULT_PERFORMANCE_BUDGET: PerformanceBudget = {
  lcp: 2500, // 2.5s
  fid: 100,  // 100ms
  cls: 0.1,  // 0.1 score
  bundleSize: 500, // 500KB
  imageSize: 200,  // 200KB per image
};

export function checkPerformanceBudget(budget: PerformanceBudget = DEFAULT_PERFORMANCE_BUDGET) {
  const results = {
    lcp: { passed: false, value: 0, budget: budget.lcp },
    fid: { passed: false, value: 0, budget: budget.fid },
    cls: { passed: false, value: 0, budget: budget.cls },
    bundleSize: { passed: false, value: 0, budget: budget.bundleSize },
  };

  // This would be populated by actual measurements
  console.log('Performance Budget Check:', results);
  return results;
}

// Image optimization checker
export function checkImageOptimization() {
  if (typeof document === 'undefined') return;

  const images = Array.from(document.querySelectorAll('img'));
  const imageIssues = images.map(img => {
    const issues = [];
    
    // Check for missing alt text
    if (!img.alt) {
      issues.push('Missing alt text');
    }
    
    // Check for missing loading attribute
    if (!img.loading) {
      issues.push('Missing loading attribute');
    }
    
    // Check for missing width/height
    if (!img.width || !img.height) {
      issues.push('Missing dimensions');
    }
    
    return {
      src: img.src,
      issues: issues,
    };
  }).filter(img => img.issues.length > 0);

  if (imageIssues.length > 0) {
    console.warn('Image Optimization Issues:', imageIssues);
  }
  
  return imageIssues;
}

// Critical resource preloader
export function preloadCriticalResources() {
  if (typeof document === 'undefined') return;

  const criticalResources = [
    { href: '/fonts/inter-var.woff2', as: 'font', type: 'font/woff2', crossorigin: 'anonymous' },
    // Add more critical resources as needed
  ];

  criticalResources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = resource.href;
    link.as = resource.as;
    if (resource.type) link.type = resource.type;
    if (resource.crossorigin) link.crossOrigin = resource.crossorigin;
    
    document.head.appendChild(link);
  });
}

// Lazy loading intersection observer
export function createLazyLoadObserver(callback: (entries: IntersectionObserverEntry[]) => void) {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return null;
  }

  return new IntersectionObserver(callback, {
    rootMargin: '50px 0px',
    threshold: 0.01,
  });
}

// Performance timing helper
export function measurePerformance<T>(name: string, fn: () => T): T {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  
  console.log(`${name} took ${end - start} milliseconds`);
  return result;
}

// Async performance timing helper
export async function measureAsyncPerformance<T>(name: string, fn: () => Promise<T>): Promise<T> {
  const start = performance.now();
  const result = await fn();
  const end = performance.now();
  
  console.log(`${name} took ${end - start} milliseconds`);
  return result;
}

// Initialize all performance monitoring
export function initAllPerformanceMonitoring() {
  if (typeof window === 'undefined') return;

  initPerformanceMonitoring();
  trackResourceLoading();
  
  // Run checks after page load
  window.addEventListener('load', () => {
    setTimeout(() => {
      trackMemoryUsage();
      trackBundleSize();
      checkImageOptimization();
      checkPerformanceBudget();
    }, 1000);
  });
}