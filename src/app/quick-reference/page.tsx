'use client';

import React, { useState, useEffect } from 'react';
import QuickReference from '@/components/content/QuickReference';
import PerformanceBenchmarks from '@/components/content/PerformanceBenchmarks';
import { cheatSheets, performanceBenchmarks } from '@/lib/cheat-sheet-data';

export default function QuickReferencePage() {
  const [activeTab, setActiveTab] = useState<'cheatsheets' | 'benchmarks'>('cheatsheets');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const cheatSheetCategories = Array.from(new Set(cheatSheets.map(sheet => sheet.category)));
  const benchmarkCategories = Array.from(new Set(performanceBenchmarks.map(benchmark => benchmark.category)));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile-optimized header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <h1 className={`font-bold text-gray-900 ${isMobile ? 'text-lg' : 'text-xl'}`}>
              Quick Reference
            </h1>
            
            {/* Tab Navigation */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('cheatsheets')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'cheatsheets'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Cheat Sheets
              </button>
              <button
                onClick={() => setActiveTab('benchmarks')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'benchmarks'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Benchmarks
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter for Mobile */}
      {isMobile && (
        <div className="bg-white border-b px-4 py-3">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            {(activeTab === 'cheatsheets' ? cheatSheetCategories : benchmarkCategories).map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Content */}
      <div className="pb-6">
        {activeTab === 'cheatsheets' ? (
          <QuickReference
            cheatSheets={cheatSheets}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        ) : (
          <PerformanceBenchmarks
            benchmarks={performanceBenchmarks}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        )}
      </div>

      {/* Mobile-optimized floating action button */}
      {isMobile && (
        <div className="fixed bottom-6 right-6">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
