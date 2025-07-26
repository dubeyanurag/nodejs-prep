'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useIntersectionObserver } from '../../lib/lazy-loading';
import { PerformanceBenchmark, BenchmarkMetric } from '@/types/content';

interface PerformanceBenchmarksProps {
  benchmarks: PerformanceBenchmark[];
  selectedCategory?: string;
  onCategoryChange?: (category: string) => void;
}

export default function PerformanceBenchmarks({ 
  benchmarks, 
  selectedCategory, 
  onCategoryChange 
}: PerformanceBenchmarksProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'operation' | 'category' | 'lastUpdated'>('category');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const categories = useMemo(() => {
    const cats = Array.from(new Set(benchmarks.map(benchmark => benchmark.category)));
    return cats.sort();
  }, [benchmarks]);

  const filteredAndSortedBenchmarks = useMemo(() => {
    let filtered = benchmarks.filter(benchmark => {
      const matchesSearch = searchTerm === '' || 
        benchmark.operation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        benchmark.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        benchmark.context.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = !selectedCategory || benchmark.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });

    // Sort benchmarks
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'operation':
          comparison = a.operation.localeCompare(b.operation);
          break;
        case 'category':
          comparison = a.category.localeCompare(b.category);
          break;
        case 'lastUpdated':
          comparison = new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime();
          break;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [benchmarks, searchTerm, selectedCategory, sortBy, sortDirection]);

  const handleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('asc');
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Performance Benchmarks
        </h1>
        <p className="text-gray-600">
          Comprehensive performance comparisons and benchmarks for backend technologies
        </p>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <input
              id="search"
              type="text"
              placeholder="Search benchmarks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Category Filter */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              id="category"
              value={selectedCategory || ''}
              onChange={(e) => onCategoryChange?.(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-2">
              Sort By
            </label>
            <select
              id="sortBy"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="category">Category</option>
              <option value="operation">Operation</option>
              <option value="lastUpdated">Last Updated</option>
            </select>
          </div>

          {/* Sort Direction */}
          <div>
            <label htmlFor="sortDirection" className="block text-sm font-medium text-gray-700 mb-2">
              Order
            </label>
            <select
              id="sortDirection"
              value={sortDirection}
              onChange={(e) => setSortDirection(e.target.value as 'asc' | 'desc')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Showing {filteredAndSortedBenchmarks.length} of {benchmarks.length} benchmarks
        </p>
      </div>

      {/* Benchmarks Grid */}
      <div className="space-y-6">
        {filteredAndSortedBenchmarks.map(benchmark => (
          <BenchmarkCard key={benchmark.id} benchmark={benchmark} />
        ))}
      </div>

      {filteredAndSortedBenchmarks.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No benchmarks found</h3>
          <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
        </div>
      )}
    </div>
  );
}

interface BenchmarkCardProps {
  benchmark: PerformanceBenchmark;
}

function BenchmarkCard({ benchmark }: BenchmarkCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  // Find the best and worst performing metrics
  const sortedMetrics = [...benchmark.metrics].sort((a, b) => {
    // Assuming lower values are better for most metrics (like response time)
    // This could be made configurable per metric type
    return a.value - b.value;
  });

  const bestMetric = sortedMetrics[0];
  const worstMetric = sortedMetrics[sortedMetrics.length - 1];

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* Header */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl font-semibold text-gray-900">
                {benchmark.operation}
              </h3>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                {benchmark.category}
              </span>
            </div>
            <p className="text-gray-600 mb-2">{benchmark.context}</p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>Last updated: {new Date(benchmark.lastUpdated).toLocaleDateString()}</span>
              {benchmark.source && (
                <>
                  <span>•</span>
                  <span>Source: {benchmark.source}</span>
                </>
              )}
            </div>
          </div>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            {showDetails ? 'Hide Details' : 'Show Details'}
          </button>
        </div>

        {/* Quick Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="text-sm text-green-600 font-medium">Best Performance</div>
            <div className="text-lg font-semibold text-green-900">
              {bestMetric.technology}
            </div>
            <div className="text-sm text-green-700">
              {bestMetric.value} {bestMetric.unit}
            </div>
          </div>
          
          <div className="bg-red-50 p-3 rounded-lg">
            <div className="text-sm text-red-600 font-medium">Slowest Performance</div>
            <div className="text-lg font-semibold text-red-900">
              {worstMetric.technology}
            </div>
            <div className="text-sm text-red-700">
              {worstMetric.value} {worstMetric.unit}
            </div>
          </div>
          
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="text-sm text-blue-600 font-medium">Performance Ratio</div>
            <div className="text-lg font-semibold text-blue-900">
              {(worstMetric.value / bestMetric.value).toFixed(1)}x
            </div>
            <div className="text-sm text-blue-700">
              difference
            </div>
          </div>
        </div>

        {/* Metrics Bar Chart */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Performance Comparison</h4>
          <div className="space-y-2">
            {benchmark.metrics.map((metric, index) => {
              const percentage = (metric.value / worstMetric.value) * 100;
              const isWorst = metric.value === worstMetric.value;
              const isBest = metric.value === bestMetric.value;
              
              return (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-24 text-sm text-gray-600 truncate">
                    {metric.technology}
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                    <div
                      className={`h-6 rounded-full flex items-center justify-end pr-2 text-xs font-medium text-white ${
                        isBest ? 'bg-green-500' : isWorst ? 'bg-red-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    >
                      {metric.value} {metric.unit}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Detailed Information */}
      {showDetails && (
        <div className="border-t p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Detailed Metrics</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Technology
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Conditions
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {benchmark.metrics.map((metric, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                      {metric.technology}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {metric.value} {metric.unit}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <ul className="list-disc list-inside">
                        {metric.conditions.map((condition, condIndex) => (
                          <li key={condIndex}>{condition}</li>
                        ))}
                      </ul>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {metric.notes || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}