// Lazy loading utilities for improved performance

import React, { lazy, ComponentType, LazyExoticComponent } from 'react';

// Generic lazy loading wrapper with error boundary
export function createLazyComponent<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  fallback?: React.ComponentType
): LazyExoticComponent<T> {
  return lazy(async () => {
    try {
      const loadedModule = await importFn();
      return loadedModule;
    } catch (error) {
      console.error('Failed to load component:', error);
      // Return a fallback component in case of error
      return {
        default: (fallback || (() => React.createElement('div', null, 'Failed to load component'))) as T
      };
    }
  });
}

// Intersection Observer hook for lazy loading content
export function useIntersectionObserver(
  ref: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
): boolean {
  const [isIntersecting, setIsIntersecting] = React.useState(false);

  React.useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options,
      }
    );

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [ref, options]);

  return isIntersecting;
}

// Lazy load images with placeholder
export function useLazyImage(src: string, placeholder?: string) {
  const [imageSrc, setImageSrc] = React.useState(placeholder || '');
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [isError, setIsError] = React.useState(false);

  React.useEffect(() => {
    const img = new Image();

    img.onload = () => {
      setImageSrc(src);
      setIsLoaded(true);
    };

    img.onerror = () => {
      setIsError(true);
    };

    img.src = src;
  }, [src]);

  return { imageSrc, isLoaded, isError };
}

// Dynamic import with retry logic
export async function dynamicImport<T>(
  importFn: () => Promise<T>,
  retries: number = 3,
  delay: number = 1000
): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      return await importFn();
    } catch (error) {
      if (i === retries - 1) throw error;

      console.warn(`Import failed, retrying... (${i + 1}/${retries})`);
      await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
    }
  }

  throw new Error('All import attempts failed');
}

// Preload critical resources
export function preloadResource(href: string, as: string, type?: string) {
  if (typeof document === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = as;
  if (type) link.type = type;

  document.head.appendChild(link);
}

// Prefetch resources for next navigation
export function prefetchResource(href: string) {
  if (typeof document === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = href;

  document.head.appendChild(link);
}

// Bundle splitting utilities
export const LazyComponents = {
  // Heavy components that should be loaded on demand
  Mermaid: createLazyComponent(
    () => import('../components/content/DiagramRenderer'),
    () => React.createElement('div', { className: 'animate-pulse bg-gray-200 h-64 rounded' }, 'Loading diagram...')
  ),

  CodePlayground: createLazyComponent(
    () => import('../components/content/CodePlayground'),
    () => React.createElement('div', { className: 'animate-pulse bg-gray-200 h-48 rounded' }, 'Loading code playground...')
  ),

  FlashcardSession: createLazyComponent(
    () => import('../components/content/FlashcardSession'),
    () => React.createElement('div', { className: 'animate-pulse bg-gray-200 h-96 rounded' }, 'Loading flashcards...')
  ),

  SearchInterface: createLazyComponent(
    () => import('../components/content/SearchInterface'),
    () => React.createElement('div', { className: 'animate-pulse bg-gray-200 h-32 rounded' }, 'Loading search...')
  ),

  PerformanceBenchmarks: createLazyComponent(
    () => import('../components/content/PerformanceBenchmarks'),
    () => React.createElement('div', { className: 'animate-pulse bg-gray-200 h-64 rounded' }, 'Loading benchmarks...')
  ),
};

// Resource hints for critical paths
export function addResourceHints() {
  if (typeof document === 'undefined') return;

  // Preconnect to external domains
  const preconnectDomains = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
  ];

  preconnectDomains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = domain;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });

  // DNS prefetch for external resources
  const dnsPrefetchDomains = [
    'https://cdn.jsdelivr.net',
    'https://unpkg.com',
  ];

  dnsPrefetchDomains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = domain;
    document.head.appendChild(link);
  });
}

