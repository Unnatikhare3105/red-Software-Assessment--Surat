'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '@/src/redux/hooks';
import { logoutUser } from '@/src/thunks/auth.thunks';
import { ThemeToggle } from '@/src/components/ui/ThemeToggle';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/products', label: 'Products', icon: '📦' },
  { href: '/categories', label: 'Categories', icon: '🏷️' },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    toast.success('Logged out');
    router.push('/login');
  };

  return (
    <>
      {/* mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-sm md:hidden"
        />
      )}

      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-64 min-h-screen bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 flex flex-col transition-transform duration-200 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 text-white flex items-center justify-center font-bold text-sm">
              IM
            </div>
            <span className="font-semibold text-slate-800 dark:text-slate-100">Inventory</span>
          </div>
          <button onClick={onClose} className="md:hidden text-slate-400 hover:text-slate-600 text-xl leading-none">
            &times;
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                  active
                    ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <p className="text-sm text-slate-500 dark:text-slate-400 truncate mb-2">{user?.email}</p>
          <ThemeToggle />
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2.5 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
          >
            🚪 Logout
          </button>
        </div>
      </aside>
    </>
  );
}


// 'use client';

// import Link from 'next/link';
// import { usePathname, useRouter } from 'next/navigation';
// import toast from 'react-hot-toast';
// import { useAppDispatch, useAppSelector } from '@/src/redux/hooks';
// import { logoutUser } from '@/src/thunks/auth.thunks';
// import { ThemeToggle } from '../ui/ThemeToggle';

// const NAV_ITEMS = [
//   { href: '/dashboard', label: 'Dashboard', icon: '📊' },
//   { href: '/products', label: 'Products', icon: '📦' },
//   { href: '/categories', label: 'Categories', icon: '🏷️' },
// ];

// export function Sidebar() {
//   const pathname = usePathname();
//   const router = useRouter();
//   const dispatch = useAppDispatch();
//   const { user } = useAppSelector((state) => state.auth);

//   const handleLogout = async () => {
//     await dispatch(logoutUser());
//     toast.success('Logged out');
//     router.push('/login');
//   };

//   return (
//     <aside className="w-64 min-h-screen bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 flex flex-col">
//       <div className="p-6 border-b border-slate-100">
//         <div className="flex items-center gap-2">
//           <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 text-white flex items-center justify-center font-bold text-sm">
//             IM
//           </div>
//           <span className="font-semibold text-slate-800">Inventory</span>
//         </div>
//       </div>

//       <nav className="flex-1 p-4 space-y-1">
//         {NAV_ITEMS.map((item) => {
//           const active = pathname.startsWith(item.href);
//           return (
//             <Link
//               key={item.href}
//               href={item.href}
//               className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition ${
//                 active ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
//               }`}
//             >
//               <span>{item.icon}</span>
//               {item.label}
//             </Link>
//           );
//         })}
//       </nav>

//       <div className="p-4 border-t border-slate-100 dark:border-slate-800">
//   <p className="text-sm text-slate-500 dark:text-slate-400 truncate mb-2">{user?.email}</p>
//   <ThemeToggle />
//   <button
//     onClick={handleLogout}
//     className="w-full text-left px-4 py-2.5 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
//   >
//     🚪 Logout
//   </button>
// </div>

//       {/* <div className="p-4 border-t border-slate-100">
//         <p className="text-sm text-slate-500 truncate mb-2">{user?.email}</p>
//         <button
//           onClick={handleLogout}
//           className="w-full text-left px-4 py-2.5 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition"
//         >
//           🚪 Logout
//         </button>
//       </div> */}
//     </aside>
//   );
// }