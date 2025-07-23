// Mermaid.js configuration and utilities for diagram rendering
import mermaid from 'mermaid';

// Mermaid configuration
const mermaidConfig = {
  startOnLoad: false,
  theme: 'default' as const,
  themeVariables: {
    primaryColor: '#3B82F6',
    primaryTextColor: '#1F2937',
    primaryBorderColor: '#2563EB',
    lineColor: '#6B7280',
    secondaryColor: '#F3F4F6',
    tertiaryColor: '#E5E7EB',
    background: '#FFFFFF',
    mainBkg: '#FFFFFF',
    secondBkg: '#F9FAFB',
    tertiaryBkg: '#F3F4F6',
  },
  flowchart: {
    useMaxWidth: true,
    htmlLabels: true,
    curve: 'basis' as const,
  },
  sequence: {
    useMaxWidth: true,
    diagramMarginX: 50,
    diagramMarginY: 10,
    actorMargin: 50,
    width: 150,
    height: 65,
    boxMargin: 10,
    boxTextMargin: 5,
    noteMargin: 10,
    messageMargin: 35,
  },
  gantt: {
    useMaxWidth: true,
    leftPadding: 75,
    gridLineStartPadding: 35,
    fontSize: 11,
    sectionFontSize: 11,
    numberSectionStyles: 4,
  },
  er: {
    useMaxWidth: true,
    diagramPadding: 20,
    layoutDirection: 'TB' as const,
    minEntityWidth: 100,
    minEntityHeight: 75,
    entityPadding: 15,
    stroke: '#2563EB',
    fill: '#F3F4F6',
  },
  pie: {
    useMaxWidth: true,
    textPosition: 0.75,
  },
  git: {
    useMaxWidth: true,
    mainBranchName: 'main',
    showBranches: true,
    showCommitLabel: true,
  },
};

/**
 * Initialize Mermaid with custom configuration
 */
export function initializeMermaid(): void {
  if (typeof window !== 'undefined') {
    mermaid.initialize(mermaidConfig);
  }
}

/**
 * Render a Mermaid diagram
 */
export async function renderDiagram(
  definition: string,
  elementId: string
): Promise<string> {
  try {
    if (typeof window === 'undefined') {
      throw new Error('Mermaid can only be rendered in the browser');
    }

    // Validate the diagram definition
    if (!definition.trim()) {
      throw new Error('Empty diagram definition');
    }

    // Generate a unique ID for the diagram
    const diagramId = `mermaid-${elementId}-${Date.now()}`;
    
    // Render the diagram
    const { svg } = await mermaid.render(diagramId, definition);
    
    return svg;
  } catch (error) {
    console.error('Error rendering Mermaid diagram:', error);
    throw new Error(`Failed to render diagram: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Validate Mermaid diagram syntax
 */
export function validateDiagram(definition: string): {
  isValid: boolean;
  error?: string;
} {
  try {
    if (!definition.trim()) {
      return { isValid: false, error: 'Empty diagram definition' };
    }

    // Basic syntax validation
    const lines = definition.trim().split('\n');
    const firstLine = lines[0].trim();
    
    // Check for valid diagram types
    const validTypes = [
      'graph',
      'flowchart',
      'sequenceDiagram',
      'classDiagram',
      'stateDiagram',
      'erDiagram',
      'journey',
      'gantt',
      'pie',
      'gitGraph',
      'mindmap',
      'timeline',
    ];

    const hasValidType = validTypes.some(type => 
      firstLine.startsWith(type) || firstLine.includes(type)
    );

    if (!hasValidType) {
      return { 
        isValid: false, 
        error: `Invalid diagram type. Must start with one of: ${validTypes.join(', ')}` 
      };
    }

    return { isValid: true };
  } catch (error) {
    return { 
      isValid: false, 
      error: error instanceof Error ? error.message : 'Unknown validation error' 
    };
  }
}

/**
 * Get diagram type from definition
 */
export function getDiagramType(definition: string): string {
  const firstLine = definition.trim().split('\n')[0].trim();
  
  if (firstLine.startsWith('graph') || firstLine.startsWith('flowchart')) {
    return 'flowchart';
  } else if (firstLine.startsWith('sequenceDiagram')) {
    return 'sequence';
  } else if (firstLine.startsWith('classDiagram')) {
    return 'class';
  } else if (firstLine.startsWith('stateDiagram')) {
    return 'state';
  } else if (firstLine.startsWith('erDiagram')) {
    return 'er';
  } else if (firstLine.startsWith('journey')) {
    return 'journey';
  } else if (firstLine.startsWith('gantt')) {
    return 'gantt';
  } else if (firstLine.startsWith('pie')) {
    return 'pie';
  } else if (firstLine.startsWith('gitGraph')) {
    return 'git';
  } else if (firstLine.startsWith('mindmap')) {
    return 'mindmap';
  } else if (firstLine.startsWith('timeline')) {
    return 'timeline';
  }
  
  return 'unknown';
}

/**
 * Get display name for diagram type
 */
export function getDiagramTypeDisplayName(type: string): string {
  const displayNames: Record<string, string> = {
    'flowchart': 'Flowchart',
    'sequence': 'Sequence Diagram',
    'class': 'Class Diagram',
    'state': 'State Diagram',
    'er': 'Entity Relationship Diagram',
    'journey': 'User Journey',
    'gantt': 'Gantt Chart',
    'pie': 'Pie Chart',
    'git': 'Git Graph',
    'mindmap': 'Mind Map',
    'timeline': 'Timeline',
  };

  return displayNames[type] || type.charAt(0).toUpperCase() + type.slice(1);
}

/**
 * Common diagram templates for quick creation
 */
export const diagramTemplates = {
  systemArchitecture: `graph TB
    A[Client] --> B[Load Balancer]
    B --> C[Web Server 1]
    B --> D[Web Server 2]
    C --> E[Database]
    D --> E[Database]
    E --> F[Cache]`,

  sequenceFlow: `sequenceDiagram
    participant C as Client
    participant S as Server
    participant D as Database
    
    C->>S: Request
    S->>D: Query
    D-->>S: Result
    S-->>C: Response`,

  microservices: `graph TB
    subgraph "Frontend"
        A[React App]
    end
    
    subgraph "API Gateway"
        B[Gateway]
    end
    
    subgraph "Services"
        C[User Service]
        D[Order Service]
        E[Payment Service]
    end
    
    subgraph "Data Layer"
        F[User DB]
        G[Order DB]
        H[Payment DB]
    end
    
    A --> B
    B --> C
    B --> D
    B --> E
    C --> F
    D --> G
    E --> H`,

  eventLoop: `graph TB
    A[Call Stack] --> B{Stack Empty?}
    B -->|No| A
    B -->|Yes| C[Event Loop]
    C --> D[Callback Queue]
    D --> E{Queue Empty?}
    E -->|Yes| C
    E -->|No| F[Move to Stack]
    F --> A`,

  databaseER: `erDiagram
    USER {
        int id PK
        string email UK
        string name
        datetime created_at
    }
    
    ORDER {
        int id PK
        int user_id FK
        decimal total
        datetime created_at
    }
    
    ORDER_ITEM {
        int id PK
        int order_id FK
        int product_id FK
        int quantity
        decimal price
    }
    
    PRODUCT {
        int id PK
        string name
        decimal price
        int stock
    }
    
    USER ||--o{ ORDER : places
    ORDER ||--o{ ORDER_ITEM : contains
    PRODUCT ||--o{ ORDER_ITEM : included_in`,
};

/**
 * Generate diagram from template
 */
export function generateFromTemplate(templateName: keyof typeof diagramTemplates): string {
  return diagramTemplates[templateName] || '';
}

/**
 * Extract and parse Mermaid diagrams from markdown content
 */
export function extractDiagramsFromMarkdown(content: string): Array<{
  definition: string;
  type: string;
  startIndex: number;
  endIndex: number;
}> {
  const mermaidRegex = /```mermaid\n([\s\S]*?)```/g;
  const diagrams: Array<{
    definition: string;
    type: string;
    startIndex: number;
    endIndex: number;
  }> = [];
  
  let match;
  while ((match = mermaidRegex.exec(content)) !== null) {
    const definition = match[1].trim();
    diagrams.push({
      definition,
      type: getDiagramType(definition),
      startIndex: match.index,
      endIndex: match.index + match[0].length,
    });
  }
  
  return diagrams;
}

/**
 * Configure Mermaid theme
 */
export function setTheme(theme: 'default' | 'dark' | 'forest' | 'neutral'): void {
  const themeConfig = {
    ...mermaidConfig,
    theme,
  };
  
  if (typeof window !== 'undefined') {
    mermaid.initialize(themeConfig);
  }
}

/**
 * Get responsive configuration for mobile devices
 */
export function getMobileConfig() {
  return {
    ...mermaidConfig,
    flowchart: {
      ...mermaidConfig.flowchart,
      useMaxWidth: true,
      htmlLabels: false, // Better for mobile
    },
    sequence: {
      ...mermaidConfig.sequence,
      useMaxWidth: true,
      width: 100, // Smaller for mobile
      actorMargin: 30,
    },
  };
}

// Export mermaid instance for direct access if needed
export { mermaid };

// Initialize Mermaid when this module is imported
if (typeof window !== 'undefined') {
  initializeMermaid();
}