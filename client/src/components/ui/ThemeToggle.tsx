'use client';

import { useAppDispatch, useAppSelector } from '@/src/redux/hooks';
import { toggleTheme } from '@/src/redux/slices/theme.slice';

export function ThemeToggle() {
  const dispatch = useAppDispatch();
  const mode = useAppSelector((state) => state.theme.mode);

  return (
    <button
      onClick={() => dispatch(toggleTheme())}
      className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
    >
      {mode === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
    </button>
  );
}