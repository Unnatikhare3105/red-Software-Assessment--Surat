'use client';

import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { store } from '@/src/redux/store';
import { initTheme } from '@/src/redux/slices/theme.slice';

function ThemeInit() {
  useEffect(() => { store.dispatch(initTheme()); }, []);
  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeInit />
      {children}
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
    </Provider>
  );
}