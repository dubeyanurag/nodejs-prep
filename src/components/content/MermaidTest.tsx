'use client';

import React, { useEffect, useRef, useState } from 'react';

export default function MermaidTest() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState('Loading...');

  useEffect(() => {
    const testMermaid = async () => {
      try {
        setStatus('Importing mermaid...');
        const mermaid = (await import('mermaid')).default;
        
        setStatus('Initializing mermaid...');
        mermaid.initialize({
          startOnLoad: false,
          theme: 'default',
        });
        
        setStatus('Rendering diagram...');
        const diagramDefinition = `graph TD
          A[Start] --> B[End]`;
        
        const { svg } = await mermaid.render('test-diagram', diagramDefinition);
        
        if (containerRef.current) {
          containerRef.current.innerHTML = svg;
          setStatus('Success!');
        }
      } catch (error) {
        console.error('Mermaid test error:', error);
        setStatus(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    };

    testMermaid();
  }, []);

  return (
    <div className="p-4 border border-gray-300 rounded">
      <h3 className="text-lg font-bold mb-2">Mermaid Test</h3>
      <p className="mb-4">Status: {status}</p>
      <div ref={containerRef} className="border border-gray-200 p-4 min-h-[200px]">
        {/* SVG will be inserted here */}
      </div>
    </div>
  );
}