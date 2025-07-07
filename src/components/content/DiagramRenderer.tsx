'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Diagram } from '@/types/content';
import { initializeMermaid, renderDiagram } from '@/lib/mermaid';

interface DiagramRendererProps {
  diagram?: Diagram;
  diagramId?: string;
  className?: string;
}

// Sample diagrams for demonstration
const sampleDiagrams: Record<string, Diagram> = {
  'event-loop-diagram': {
    id: 'event-loop-diagram',
    type: 'flowchart',
    title: 'Node.js Event Loop Flow',
    description: 'Visual representation of the Event Loop execution flow',
    mermaidCode: `flowchart TD
    A[Start] --> B[Timer Phase]
    B --> C[Pending Callbacks]
    C --> D[Idle, Prepare]
    D --> E[Poll Phase]
    E --> F[Check Phase]
    F --> G[Close Callbacks]
    G --> H{More Work?}
    H -->|Yes| B
    H -->|No| I[Exit]
    
    style A fill:#e1f5fe
    style I fill:#ffebee
    style E fill:#f3e5f5
    style F fill:#e8f5e8`,
    explanation: 'This diagram shows the complete flow of the Event Loop through all six phases, with decision points for continuing the loop.'
  },
  'event-loop-phases': {
    id: 'event-loop-phases',
    type: 'sequence',
    title: 'Event Loop Phase Execution',
    description: 'Sequence diagram showing callback execution order',
    mermaidCode: `sequenceDiagram
    participant JS as JavaScript Code
    participant EL as Event Loop
    participant T as Timer Queue
    participant P as Poll Queue
    participant C as Check Queue
    participant NT as NextTick Queue
    
    JS->>EL: Execute Script
    EL->>NT: Process nextTick callbacks
    EL->>T: Timer Phase
    T-->>EL: Execute timer callbacks
    EL->>P: Poll Phase
    P-->>EL: Execute I/O callbacks
    EL->>C: Check Phase
    C-->>EL: Execute setImmediate callbacks
    EL->>JS: Continue execution`,
    explanation: 'This sequence diagram illustrates how different types of callbacks are processed in their respective phases.'
  }
};

export default function DiagramRenderer({ 
  diagram, 
  diagramId, 
  className = '' 
}: DiagramRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Get diagram data
  const diagramData = diagram || (diagramId ? sampleDiagrams[diagramId] : null);

  useEffect(() => {
    if (!diagramData || !svgRef.current) return;

    const renderMermaidDiagram = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Initialize Mermaid
        initializeMermaid();
        
        // Render the diagram
        const svgString = await renderDiagram(diagramData.mermaidCode, diagramData.id);
        
        // Insert the rendered SVG into the DOM
        if (svgRef.current) {
          svgRef.current.innerHTML = svgString;
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error('Error rendering diagram:', err);
        setError(err instanceof Error ? err.message : 'Failed to render diagram');
        setIsLoading(false);
      }
    };

    renderMermaidDiagram();
  }, [diagramData]);

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.2, 0.5));
  };

  const handleResetZoom = () => {
    setScale(1);
  };

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const exportSVG = () => {
    if (!svgRef.current) return;
    
    const svgElement = svgRef.current.querySelector('svg');
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${diagramData?.title || 'diagram'}.svg`;
    link.click();
    
    URL.revokeObjectURL(url);
  };

  const exportPNG = () => {
    if (!svgRef.current) return;
    
    const svgElement = svgRef.current.querySelector('svg');
    if (!svgElement) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${diagramData?.title || 'diagram'}.png`;
        link.click();
        URL.revokeObjectURL(url);
      });
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  if (!diagramData) {
    return (
      <div className={`bg-yellow-50 border border-yellow-200 rounded-lg p-6 ${className}`}>
        <div className="flex items-center gap-3">
          <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <div>
            <h4 className="font-medium text-yellow-900">Diagram not found</h4>
            <p className="text-sm text-yellow-700">
              {diagramId ? `No diagram found with ID: ${diagramId}` : 'No diagram data provided'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={`bg-gray-50 border border-gray-200 rounded-lg p-8 ${className}`}>
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Rendering diagram...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-lg p-6 ${className}`}>
        <div className="flex items-center gap-3">
          <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <div>
            <h4 className="font-medium text-red-900">Failed to render diagram</h4>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm ${isFullscreen ? 'fixed inset-4 z-50' : ''} ${className}`}>
      {/* Diagram Header */}
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h4 className="font-medium text-gray-900 flex items-center gap-2">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              {diagramData.title}
            </h4>
            <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded">
              {diagramData.type}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">
              Scale: {Math.round(scale * 100)}%
            </span>
            <button
              onClick={handleFullscreen}
              className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
              title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isFullscreen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Diagram Content */}
      <div className="relative overflow-auto" style={{ maxHeight: isFullscreen ? 'calc(100vh - 200px)' : '500px' }}>
        <div 
          ref={svgRef}
          className="flex items-center justify-center p-6 min-h-[300px]"
          style={{ 
            transform: `scale(${scale})`,
            transformOrigin: 'center center',
            transition: 'transform 0.2s ease-in-out'
          }}
        />
      </div>

      {/* Diagram Controls */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <button 
            onClick={handleZoomIn}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors" 
            title="Zoom In"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
            </svg>
          </button>
          <button 
            onClick={handleZoomOut}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors" 
            title="Zoom Out"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
            </svg>
          </button>
          <button 
            onClick={handleResetZoom}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors" 
            title="Reset Zoom"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={exportPNG}
            className="px-3 py-1 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
          >
            Export PNG
          </button>
          <button 
            onClick={exportSVG}
            className="px-3 py-1 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
          >
            Export SVG
          </button>
        </div>
      </div>

      {/* Diagram Description */}
      <div className="px-4 py-3 bg-blue-50 border-t border-blue-200">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-sm text-blue-900 font-medium mb-1">{diagramData.description}</p>
            <p className="text-sm text-blue-800">{diagramData.explanation}</p>
          </div>
        </div>
      </div>
    </div>
  );
}