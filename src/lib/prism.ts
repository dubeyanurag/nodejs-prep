// Prism.js configuration and utilities for syntax highlighting
import Prism from 'prismjs';

// Import core languages
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-docker';
import 'prismjs/components/prism-nginx';
import 'prismjs/components/prism-mongodb';

// Import plugins
import 'prismjs/plugins/line-numbers/prism-line-numbers';
import 'prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard';
import 'prismjs/plugins/toolbar/prism-toolbar';

// Language mappings for common aliases
const languageMap: Record<string, string> = {
  'js': 'javascript',
  'ts': 'typescript',
  'node': 'javascript',
  'nodejs': 'javascript',
  'shell': 'bash',
  'sh': 'bash',
  'zsh': 'bash',
  'yml': 'yaml',
  'dockerfile': 'docker',
  'mongo': 'mongodb',
  'psql': 'sql',
  'mysql': 'sql',
  'postgresql': 'sql',
};

/**
 * Normalize language identifier to match Prism.js language names
 */
export function normalizeLanguage(language: string): string {
  const normalized = language.toLowerCase().trim();
  return languageMap[normalized] || normalized;
}

/**
 * Check if a language is supported by Prism.js
 */
export function isLanguageSupported(language: string): boolean {
  const normalizedLang = normalizeLanguage(language);
  return normalizedLang in Prism.languages;
}

/**
 * Highlight code using Prism.js
 */
export function highlightCode(code: string, language: string): string {
  const normalizedLang = normalizeLanguage(language);
  
  if (!isLanguageSupported(normalizedLang)) {
    console.warn(`Language '${language}' is not supported by Prism.js`);
    return Prism.util.encode(code) as string;
  }

  try {
    return Prism.highlight(code, Prism.languages[normalizedLang], normalizedLang);
  } catch (error) {
    console.error(`Error highlighting code for language '${language}':`, error);
    return Prism.util.encode(code) as string;
  }
}

/**
 * Get the display name for a language
 */
export function getLanguageDisplayName(language: string): string {
  const displayNames: Record<string, string> = {
    'javascript': 'JavaScript',
    'typescript': 'TypeScript',
    'jsx': 'JSX',
    'tsx': 'TSX',
    'json': 'JSON',
    'bash': 'Bash',
    'sql': 'SQL',
    'python': 'Python',
    'java': 'Java',
    'yaml': 'YAML',
    'docker': 'Dockerfile',
    'nginx': 'Nginx',
    'mongodb': 'MongoDB',
  };

  const normalizedLang = normalizeLanguage(language);
  return displayNames[normalizedLang] || language.toUpperCase();
}

/**
 * Get appropriate file extension for a language
 */
export function getLanguageExtension(language: string): string {
  const extensions: Record<string, string> = {
    'javascript': '.js',
    'typescript': '.ts',
    'jsx': '.jsx',
    'tsx': '.tsx',
    'json': '.json',
    'bash': '.sh',
    'sql': '.sql',
    'python': '.py',
    'java': '.java',
    'yaml': '.yml',
    'docker': 'Dockerfile',
    'nginx': '.conf',
    'mongodb': '.js',
  };

  const normalizedLang = normalizeLanguage(language);
  return extensions[normalizedLang] || `.${normalizedLang}`;
}

/**
 * Initialize Prism.js with custom configuration
 */
export function initializePrism(): void {
  // Configure Prism.js plugins
  if (typeof window !== 'undefined') {
    // Line numbers plugin configuration
    Prism.plugins.lineNumbers = {
      getLine: function(element: Element, number: number) {
        if (element.tagName !== 'PRE' || !element.classList.contains('line-numbers')) {
          return;
        }
        
        const lineNumberRows = element.querySelector('.line-numbers-rows');
        if (!lineNumberRows) {
          return;
        }
        
        const lineNumberCells = lineNumberRows.children;
        return lineNumberCells[number - 1];
      }
    };

    // Copy to clipboard plugin configuration
    if (Prism.plugins.toolbar) {
      Prism.plugins.toolbar.registerButton('copy-to-clipboard', {
        text: 'Copy',
        onClick: function (env: any) {
          const code = env.code;
          navigator.clipboard.writeText(code).then(() => {
            this.textContent = 'Copied!';
            setTimeout(() => {
              this.textContent = 'Copy';
            }, 2000);
          }).catch(() => {
            console.error('Failed to copy code to clipboard');
          });
        }
      });
    }
  }
}

/**
 * Format code with proper indentation and line breaks
 */
export function formatCode(code: string, language: string): string {
  // Basic code formatting - in a real implementation, you might use prettier or similar
  let formatted = code.trim();
  
  // Add basic formatting for common languages
  if (['javascript', 'typescript', 'json'].includes(normalizeLanguage(language))) {
    // Basic JavaScript/TypeScript formatting
    formatted = formatted
      .replace(/;/g, ';\n')
      .replace(/\{/g, '{\n')
      .replace(/\}/g, '\n}')
      .replace(/,/g, ',\n');
  }
  
  return formatted;
}

/**
 * Extract code blocks from markdown-style content
 */
export function extractCodeBlocks(content: string): Array<{
  language: string;
  code: string;
  startIndex: number;
  endIndex: number;
}> {
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
  const blocks: Array<{
    language: string;
    code: string;
    startIndex: number;
    endIndex: number;
  }> = [];
  
  let match;
  while ((match = codeBlockRegex.exec(content)) !== null) {
    blocks.push({
      language: match[1] || 'text',
      code: match[2].trim(),
      startIndex: match.index,
      endIndex: match.index + match[0].length,
    });
  }
  
  return blocks;
}

/**
 * Get syntax highlighting theme CSS class names
 */
export function getThemeClasses(theme: 'light' | 'dark' = 'light'): string {
  const baseClasses = 'language-';
  const themeClasses = theme === 'dark' 
    ? 'prism-dark-theme' 
    : 'prism-light-theme';
  
  return `${baseClasses} ${themeClasses}`;
}

// Export Prism instance for direct access if needed
export { Prism };

// Initialize Prism.js when this module is imported
if (typeof window !== 'undefined') {
  initializePrism();
}