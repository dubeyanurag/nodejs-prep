'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import MainNavigation from './MainNavigation';
import SidebarNavigation from './SidebarNavigation';
import Breadcrumbs from './Breadcrumbs';
import { getNavigationManager } from '../../lib/navigation-sync';
import { BreadcrumbItem } from '../../types/content';

interface AppLayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
  breadcrumbs?: BreadcrumbItem[];
  className?: string;
}

export default function AppLayout({ 
  children, 
  showSidebar = true, 
  breadcrumbs,
  className = '' 
}: AppLayoutProps) {
  const pathname = usePathname();
  
  // Parse current route to determine context
  const pathSegments = pathname.split('/').filter(Boolean);
  const isHome = pathSegments.length === 0;
  const isCategory = pathSegments.length === 1;
  const isTopic = pathSegments.length === 2;
  
  const currentCategory = pathSegments[0];
  const currentTopic = pathSegments[1];

  // Generate breadcrumbs if not provided
  const navigationManager = getNavigationManager();
  const displayBreadcrumbs = breadcrumbs || (
    isTopic ? navigationManager.generateBreadcrumbs(currentTopic) : []
  );

  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      {/* Main Navigation */}
      <MainNavigation />

      {/* Main Content Area */}
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumbs */}
        {displayBreadcrumbs.length > 0 && (
          <div className="mb-6">
            <Breadcrumbs items={displayBreadcrumbs} />
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          {showSidebar && !isHome && (
            <aside className="lg:w-80 flex-shrink-0">
              <div className="sticky top-6 space-y-6">
                <SidebarNavigation currentCategory={currentCategory} />
              </div>
            </aside>
          )}

          {/* Main Content */}
          <main className={`flex-1 min-w-0 ${showSidebar && !isHome ? '' : 'max-w-4xl mx-auto'}`}>
            <div className="bg-white rounded-lg shadow-sm">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

interface ContentLayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export function ContentLayout({ 
  children, 
  sidebar, 
  header, 
  footer, 
  className = '' 
}: ContentLayoutProps) {
  return (
    <div className={`${className}`}>
      {/* Header */}
      {header && (
        <div className="border-b border-gray-200 bg-white">
          <div className="px-6 py-4">
            {header}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row">
        {/* Primary Content */}
        <div className="flex-1 min-w-0">
          <div className="p-6">
            {children}
          </div>
        </div>

        {/* Sidebar */}
        {sidebar && (
          <div className="lg:w-80 flex-shrink-0 border-l border-gray-200 bg-gray-50">
            <div className="p-6">
              {sidebar}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      {footer && (
        <div className="border-t border-gray-200 bg-white">
          <div className="px-6 py-4">
            {footer}
          </div>
        </div>
      )}
    </div>
  );
}

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  className?: string;
}

export function PageHeader({ 
  title, 
  description, 
  actions, 
  breadcrumbs, 
  className = '' 
}: PageHeaderProps) {
  return (
    <div className={`${className}`}>
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <div className="mb-4">
          <Breadcrumbs items={breadcrumbs} />
        </div>
      )}

      {/* Header Content */}
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            {title}
          </h1>
          {description && (
            <p className="mt-2 text-lg text-gray-600">
              {description}
            </p>
          )}
        </div>

        {/* Actions */}
        {actions && (
          <div className="flex-shrink-0 ml-4">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}