'use client';

import React, { useEffect, useState } from 'react';
import { HeadingItem } from '../../lib/utils/markdown-headings';

interface TableOfContentsProps {
  headings: HeadingItem[];
  className?: string;
}

export default function TableOfContents({ headings, className = '' }: TableOfContentsProps) {
  const [activeHeading, setActiveHeading] = useState<string>('');

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the heading that's most visible
        const visibleEntries = entries.filter(entry => entry.isIntersecting);
        
        if (visibleEntries.length > 0) {
          // Sort by intersection ratio and position
          const mostVisible = visibleEntries.sort((a, b) => {
            // Prefer headings that are higher up on the page
            const aRect = a.boundingClientRect;
            const bRect = b.boundingClientRect;
            
            // If both are in view, prefer the one closer to the top
            if (aRect.top >= 0 && bRect.top >= 0) {
              return aRect.top - bRect.top;
            }
            
            // Otherwise prefer the one with higher intersection ratio
            return b.intersectionRatio - a.intersectionRatio;
          })[0];
          
          setActiveHeading(mostVisible.target.id);
        }
      },
      {
        rootMargin: '-20% 0% -35% 0%',
        threshold: [0, 0.25, 0.5, 0.75, 1]
      }
    );

    // Observe all heading elements
    headings.forEach((heading) => {
      const element = document.getElementById(heading.anchor);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [headings]);

  const scrollToHeading = (anchor: string) => {
    const element = document.getElementById(anchor);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start',
        inline: 'nearest'
      });
    }
  };

  if (headings.length === 0) {
    return null;
  }

  return (
    <nav className={`bg-white rounded-lg shadow-sm border ${className}`}>
      <div className="p-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
          <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
          On This Page
        </h3>
        
        <div className="space-y-1 max-h-96 overflow-y-auto">
          {headings.map((heading) => (
            <button
              key={heading.id}
              onClick={() => scrollToHeading(heading.anchor)}
              className={`block w-full text-left px-2 py-1.5 text-sm rounded transition-colors hover:bg-gray-50 ${
                activeHeading === heading.anchor
                  ? 'text-blue-600 bg-blue-50 font-medium border-l-2 border-blue-600 -ml-2 pl-4'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
              style={{ 
                paddingLeft: `${Math.max(8, (heading.level - 1) * 12 + 8)}px`,
                marginLeft: activeHeading === heading.anchor ? '-2px' : '0'
              }}
              title={heading.title}
            >
              <span className="truncate block">
                {heading.title}
              </span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}

interface FloatingTableOfContentsProps {
  headings: HeadingItem[];
  className?: string;
}

export function FloatingTableOfContents({ headings, className = '' }: FloatingTableOfContentsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeHeading, setActiveHeading] = useState<string>('');

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter(entry => entry.isIntersecting);
        
        if (visibleEntries.length > 0) {
          const mostVisible = visibleEntries.sort((a, b) => {
            const aRect = a.boundingClientRect;
            const bRect = b.boundingClientRect;
            
            if (aRect.top >= 0 && bRect.top >= 0) {
              return aRect.top - bRect.top;
            }
            
            return b.intersectionRatio - a.intersectionRatio;
          })[0];
          
          setActiveHeading(mostVisible.target.id);
        }
      },
      {
        rootMargin: '-20% 0% -35% 0%',
        threshold: [0, 0.25, 0.5, 0.75, 1]
      }
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.anchor);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [headings]);

  const scrollToHeading = (anchor: string) => {
    const element = document.getElementById(anchor);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start',
        inline: 'nearest'
      });
      setIsOpen(false); // Close on mobile after selection
    }
  };

  if (headings.length === 0) {
    return null;
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 lg:hidden ${className}`}>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        aria-label="Toggle table of contents"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
      </button>

      {/* Floating Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-25 -z-10"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Content Panel */}
          <div className="absolute bottom-16 right-0 w-80 max-w-[calc(100vw-3rem)] bg-white rounded-lg shadow-xl border max-h-96 overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900">On This Page</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-4 overflow-y-auto max-h-80">
              <div className="space-y-1">
                {headings.map((heading) => (
                  <button
                    key={heading.id}
                    onClick={() => scrollToHeading(heading.anchor)}
                    className={`block w-full text-left px-2 py-1.5 text-sm rounded transition-colors hover:bg-gray-50 ${
                      activeHeading === heading.anchor
                        ? 'text-blue-600 bg-blue-50 font-medium'
                        : 'text-gray-600 hover:text-blue-600'
                    }`}
                    style={{ paddingLeft: `${Math.max(8, (heading.level - 1) * 12 + 8)}px` }}
                  >
                    <span className="truncate block">
                      {heading.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}