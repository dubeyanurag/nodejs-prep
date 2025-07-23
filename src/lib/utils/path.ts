/**
 * Utility functions for handling paths in GitHub Pages deployment
 */

const isProd = process.env.NODE_ENV === 'production';
const isGitHubPages = process.env.GITHUB_ACTIONS === 'true' || typeof window !== 'undefined' && window.location.hostname.includes('github.io');
const basePath = isProd && isGitHubPages ? '/nodejs-prep' : '';

/**
 * Prepends the base path to a given path for GitHub Pages compatibility
 */
export function withBasePath(path: string): string {
  if (!path) return basePath || '/';
  
  // Don't add base path to external URLs
  if (path.startsWith('http') || path.startsWith('//')) {
    return path;
  }
  
  // Don't add base path to hash links
  if (path.startsWith('#')) {
    return path;
  }
  
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  return `${basePath}${normalizedPath}`;
}

/**
 * Gets the base path for the application
 */
export function getBasePath(): string {
  return basePath;
}