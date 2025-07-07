'use client';

import React, { useState, useMemo } from 'react';
import { CheatSheet, CheatSheetSection, DifficultyLevel } from '@/types/content';

interface QuickReferenceProps {
  cheatSheets: CheatSheet[];
  selectedCategory?: string;
  onCategoryChange?: (category: string) => void;
}

export default function QuickReference({ 
  cheatSheets, 
  selectedCategory, 
  onCategoryChange 
}: QuickReferenceProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | 'all'>('all');
  const [expandedSheets, setExpandedSheets] = useState<Set<string>>(new Set());

  const categories = useMemo(() => {
    const cats = Array.from(new Set(cheatSheets.map(sheet => sheet.category)));
    return cats.sort();
  }, [cheatSheets]);

  const filteredSheets = useMemo(() => {
    return cheatSheets.filter(sheet => {
      const matchesSearch = searchTerm === '' || 
        sheet.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sheet.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sheet.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = !selectedCategory || sheet.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === 'all' || sheet.difficulty === selectedDifficulty;
      
      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [cheatSheets, searchTerm, selectedCategory, selectedDifficulty]);

  const toggleSheetExpansion = (sheetId: string) => {
    const newExpanded = new Set(expandedSheets);
    if (newExpanded.has(sheetId)) {
      newExpanded.delete(sheetId);
    } else {
      newExpanded.add(sheetId);
    }
    setExpandedSheets(newExpanded);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Quick Reference & Cheat Sheets
        </h1>
        <p className="text-gray-600">
          Interactive cheat sheets and quick lookup tables for backend engineering concepts
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <input
              id="search"
              type="text"
              placeholder="Search cheat sheets..."
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

          {/* Difficulty Filter */}
          <div>
            <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-2">
              Difficulty
            </label>
            <select
              id="difficulty"
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value as DifficultyLevel | 'all')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="expert">Expert</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Showing {filteredSheets.length} of {cheatSheets.length} cheat sheets
        </p>
      </div>

      {/* Cheat Sheets Grid */}
      <div className="space-y-6">
        {filteredSheets.map(sheet => (
          <CheatSheetCard
            key={sheet.id}
            sheet={sheet}
            isExpanded={expandedSheets.has(sheet.id)}
            onToggleExpansion={() => toggleSheetExpansion(sheet.id)}
          />
        ))}
      </div>

      {filteredSheets.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No cheat sheets found</h3>
          <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
        </div>
      )}
    </div>
  );
}

interface CheatSheetCardProps {
  sheet: CheatSheet;
  isExpanded: boolean;
  onToggleExpansion: () => void;
}

function CheatSheetCard({ sheet, isExpanded, onToggleExpansion }: CheatSheetCardProps) {
  const getDifficultyColor = (difficulty: DifficultyLevel) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-orange-100 text-orange-800';
      case 'expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* Header */}
      <div 
        className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={onToggleExpansion}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl font-semibold text-gray-900">
                {sheet.title}
              </h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(sheet.difficulty)}`}>
                {sheet.difficulty}
              </span>
            </div>
            <p className="text-gray-600 mb-3">{sheet.description}</p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>{sheet.category}</span>
              <span>•</span>
              <span>{sheet.estimatedReadTime} min read</span>
              <span>•</span>
              <span>{sheet.sections.length} sections</span>
            </div>
          </div>
          <div className="ml-4">
            <svg 
              className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Tags */}
        {sheet.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {sheet.tags.map(tag => (
              <span 
                key={tag}
                className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-md"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t">
          {sheet.sections.map(section => (
            <CheatSheetSectionComponent
              key={section.id}
              section={section}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface CheatSheetSectionComponentProps {
  section: CheatSheetSection;
}

function CheatSheetSectionComponent({ section }: CheatSheetSectionComponentProps) {
  return (
    <div className="p-6 border-b last:border-b-0">
      <div className="flex items-center gap-2 mb-4">
        <h4 className="text-lg font-medium text-gray-900">{section.title}</h4>
        <span className={`px-2 py-1 rounded text-xs font-medium ${
          section.priority === 'high' ? 'bg-red-100 text-red-700' :
          section.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
          'bg-gray-100 text-gray-700'
        }`}>
          {section.priority} priority
        </span>
      </div>

      {/* Render content based on type */}
      {section.type === 'table' && section.content.table && (
        <TableContent table={section.content.table} />
      )}
      
      {section.type === 'list' && section.content.list && (
        <ListContent list={section.content.list} />
      )}
      
      {section.type === 'code' && section.content.code && (
        <CodeContent code={section.content.code} />
      )}
      
      {section.type === 'comparison' && section.content.comparison && (
        <ComparisonContent comparison={section.content.comparison} />
      )}
      
      {section.type === 'flowchart' && section.content.flowchart && (
        <FlowchartContent flowchart={section.content.flowchart} />
      )}
    </div>
  );
}

// Individual content type components will be implemented in separate files
function TableContent({ table }: { table: NonNullable<any['table']> }) {
  const [sortColumn, setSortColumn] = useState<number | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [searchTerm, setSearchTerm] = useState('');

  const handleSort = (columnIndex: number) => {
    if (sortColumn === columnIndex) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnIndex);
      setSortDirection('asc');
    }
  };

  const filteredAndSortedRows = useMemo(() => {
    let rows = [...table.rows];

    // Filter rows if searchable
    if (table.searchable && searchTerm) {
      rows = rows.filter(row => 
        row.some(cell => 
          cell.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Sort rows if sortable
    if (table.sortable && sortColumn !== null) {
      rows.sort((a, b) => {
        const aVal = a[sortColumn];
        const bVal = b[sortColumn];
        const comparison = aVal.localeCompare(bVal, undefined, { numeric: true });
        return sortDirection === 'asc' ? comparison : -comparison;
      });
    }

    return rows;
  }, [table.rows, table.searchable, table.sortable, searchTerm, sortColumn, sortDirection]);

  return (
    <div>
      {table.searchable && (
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search table..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {table.headers.map((header, index) => (
                <th
                  key={index}
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    table.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
                  }`}
                  onClick={() => table.sortable && handleSort(index)}
                >
                  <div className="flex items-center gap-1">
                    {header}
                    {table.sortable && (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                      </svg>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAndSortedRows.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50">
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ListContent({ list }: { list: NonNullable<any['list']> }) {
  const ListTag = list.ordered ? 'ol' : 'ul';
  
  return (
    <ListTag className={`space-y-3 ${list.ordered ? 'list-decimal list-inside' : 'list-disc list-inside'}`}>
      {list.items.map((item, index) => (
        <li key={index} className="text-gray-900">
          <div className="inline-block w-full ml-2">
            <div className="font-medium">{item.title}</div>
            <div className="text-gray-600 mt-1">{item.description}</div>
            {item.code && (
              <pre className="bg-gray-100 p-2 rounded mt-2 text-sm overflow-x-auto">
                <code>{item.code}</code>
              </pre>
            )}
            {item.example && (
              <div className="bg-blue-50 p-2 rounded mt-2 text-sm">
                <strong>Example:</strong> {item.example}
              </div>
            )}
            {item.notes && item.notes.length > 0 && (
              <ul className="mt-2 text-sm text-gray-600 list-disc list-inside ml-4">
                {item.notes.map((note, noteIndex) => (
                  <li key={noteIndex}>{note}</li>
                ))}
              </ul>
            )}
          </div>
        </li>
      ))}
    </ListTag>
  );
}

function CodeContent({ code }: { code: NonNullable<any['code']> }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (code.copyable) {
      await navigator.clipboard.writeText(code.snippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div>
      <p className="text-gray-600 mb-3">{code.description}</p>
      <div className="relative">
        <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
          <code className={`language-${code.language}`}>{code.snippet}</code>
        </pre>
        {code.copyable && (
          <button
            onClick={handleCopy}
            className="absolute top-2 right-2 px-2 py-1 bg-gray-700 text-white text-xs rounded hover:bg-gray-600 transition-colors"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        )}
      </div>
    </div>
  );
}

function ComparisonContent({ comparison }: { comparison: NonNullable<any['comparison']> }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Technology
            </th>
            {comparison.criteria.map(criterion => (
              <th key={criterion} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {criterion}
              </th>
            ))}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Use Case
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {comparison.items.map((item, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                {item.name}
              </td>
              {comparison.criteria.map(criterion => (
                <td key={criterion} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.values[criterion]}
                </td>
              ))}
              <td className="px-6 py-4 text-sm text-gray-900">
                {item.useCase}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function FlowchartContent({ flowchart }: { flowchart: NonNullable<any['flowchart']> }) {
  return (
    <div>
      <p className="text-gray-600 mb-4">{flowchart.description}</p>
      <div className="bg-gray-50 p-4 rounded-lg">
        <pre className="text-sm">{flowchart.mermaidCode}</pre>
        <p className="text-xs text-gray-500 mt-2">
          Note: Mermaid diagram rendering would be implemented with the mermaid library
        </p>
      </div>
    </div>
  );
}