/**
 * Utility functions for handling paths in GitHub Pages deployment
 * 
 * Note: Next.js automatically handles basePath from next.config.ts,
 * so we don't need to manually prepend it to Link hrefs.
 */

/**
 * Simple pass-through function for consistency
 * Next.js handles the base path automatically
 */
export function withBasePath(path: string): string {
  return path;
}

/**
 * Gets the base path for the application
 */
export function getBasePath(): string {
  const isProd = process.env.NODE_ENV === 'production';
  const isGitHubPages = process.env.GITHUB_ACTIONS === 'true' || (typeof window !== 'undefined' && window.location.hostname.includes('github.io'));
  return isProd && isGitHubPages ? '/nodejs-prep' : '';
}