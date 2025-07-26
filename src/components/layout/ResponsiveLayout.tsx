'use client';

import React from 'react';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  className?: string;
}

export default function ResponsiveLayout({ 
  children, 
  sidebar, 
  className = '' 
}: ResponsiveLayoutProps) {
  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8 py-8">
          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <div className="bg-white rounded-lg shadow-sm">
              {children}
            </div>
          </main>

          {/* Sidebar */}
          {sidebar && (
            <aside className="lg:w-80 flex-shrink-0">
              <div className="sticky top-8 space-y-6">
                {sidebar}
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}