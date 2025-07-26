export interface HeadingItem {
  id: string;
  title: string;
  level: number;
  anchor: string;
}

/**
 * Extract headings from markdown content
 */
export function extractHeadings(content: string): HeadingItem[] {
  const headings: HeadingItem[] = [];
  const lines = content.split('\n');
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // Match markdown headings (# ## ### etc.)
    const headingMatch = trimmedLine.match(/^(#{1,6})\s+(.+)$/);
    
    if (headingMatch) {
      const level = headingMatch[1].length;
      const title = headingMatch[2].trim();
      
      // Generate anchor ID (similar to how GitHub generates anchors)
      const anchor = title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '') // Remove special characters except spaces and hyphens
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
        .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
      
      headings.push({
        id: `heading-${headings.length}`,
        title,
        level,
        anchor
      });
    }
  }
  
  return headings;
}

/**
 * Generate a unique anchor ID, handling duplicates
 */
export function generateUniqueAnchor(title: string, existingAnchors: Set<string>): string {
  let baseAnchor = title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  
  let anchor = baseAnchor;
  let counter = 1;
  
  while (existingAnchors.has(anchor)) {
    anchor = `${baseAnchor}-${counter}`;
    counter++;
  }
  
  existingAnchors.add(anchor);
  return anchor;
}