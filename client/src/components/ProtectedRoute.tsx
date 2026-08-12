// 'use client';

// import { useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { useAppSelector } from '@/src/redux/hooks';

// export function ProtectedRoute({ children }: { children: React.ReactNode }) {
//   const router = useRouter();
//   const { isAuthenticated } = useAppSelector((state) => state.auth);

//   useEffect(() => {
//     if (!isAuthenticated) router.replace('/login');
//   }, [isAuthenticated, router]);

//   if (!isAuthenticated) return null;
//   return <>{children}</>;
// }

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/src/redux/hooks';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.replace('/login');
    }
  }, [mounted, isAuthenticated, router]);

  // don't render anything until after mount — keeps server & first client render identical
  if (!mounted || !isAuthenticated) return null;

  return <>{children}</>;
}