'use client';

import { useEffect } from 'react';
import { DashboardLayout } from '@/src/components/layout/DashboardLayout';
import { Spinner } from '@/src/components/ui/Spinner';
import { useAppDispatch, useAppSelector } from '@/src/redux/hooks';
import { fetchDashboardStats } from '@/src/thunks/dashboard.thunks';

const CARDS = [
  { key: 'totalProducts', label: 'Total Products', color: 'from-indigo-500 to-indigo-600' },
  { key: 'totalCategories', label: 'Total Categories', color: 'from-violet-500 to-violet-600' },
  { key: 'totalStockQuantity', label: 'Total Stock Quantity', color: 'from-sky-500 to-sky-600' },
  { key: 'lowStockItems', label: 'Low Stock Items', color: 'from-amber-500 to-amber-600' },
  { key: 'outOfStockItems', label: 'Out of Stock Items', color: 'from-red-500 to-red-600' },
] as const;

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const { stats, loading } = useAppSelector((state) => state.dashboard);
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => { dispatch(fetchDashboardStats()); }, [dispatch]);

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-semibold text-slate-800 mb-1">Welcome, {user?.name} 👋</h1>
      <p className="text-slate-500 mb-8">Here&apos;s an overview of your inventory</p>

      {loading || !stats ? (
        <Spinner />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {CARDS.map((card) => (
           <div key={card.key} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-5">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${card.color} mb-3`} />
              <p className="text-2xl font-semibold text-slate-800">{stats[card.key]}</p>
              <p className="text-sm text-slate-500 mt-1">{card.label}</p>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}