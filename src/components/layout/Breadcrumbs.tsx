'use client';

import React from 'react';
import Link from 'next/link';
import { BreadcrumbItem } from '../../types/content';

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <nav className={`flex ${className}`} aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        {/* Home breadcrumb */}
        <li className="inline-flex items-center">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
            </svg>
            Home
          </Link>
        </li>

        {/* Dynamic breadcrumb items */}
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const href = item.type === 'category' ? `/${item.slug}` : `/${items[0]?.slug}/${item.slug}`;

          return (
            <li key={`${item.type}-${item.slug}`}>
              <div className="flex items-center">
                <svg
                  className="w-6 h-6 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                {isLast ? (
                  <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">
                    {item.title}
                  </span>
                ) : (
                  <Link
                    href={href}
                    className="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2 transition-colors"
                  >
                    {item.title}
                  </Link>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

interface BreadcrumbsWithProgressProps extends BreadcrumbsProps {
  currentProgress?: number;
  totalItems?: number;
}

export function BreadcrumbsWithProgress({ 
  items, 
  currentProgress, 
  totalItems, 
  className = '' 
}: BreadcrumbsWithProgressProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      <Breadcrumbs items={items} />
      
      {currentProgress !== undefined && totalItems !== undefined && (
        <div className="flex items-center space-x-3">
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentProgress / totalItems) * 100}%` }}
            ></div>
          </div>
          <span className="text-sm text-gray-600 font-medium">
            {currentProgress} of {totalItems}
          </span>
        </div>
      )}
    </div>
  );
}