'use client';

import { useState } from 'react';
import { ProtectedRoute } from '@/src/components/ProtectedRoute';
import { Sidebar } from './Sidebar';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="flex-1 flex flex-col min-w-0">
          {/* mobile top bar */}
          <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-slate-600 dark:text-slate-300 text-2xl leading-none"
              aria-label="Open menu"
            >
              ☰
            </button>
            <span className="font-semibold text-slate-800 dark:text-slate-100">Inventory</span>
            <div className="w-6" />
          </div>

          <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-x-hidden">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}