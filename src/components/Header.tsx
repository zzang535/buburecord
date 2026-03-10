'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Header() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        router.push('/login');
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-black/80 backdrop-blur-md text-white border-b border-white/10 z-50">
      <div className="flex items-center justify-between h-16 px-6">
        <Link href="/" className="text-xl font-semibold hover:opacity-80 transition-opacity">
          buburecord
        </Link>

        <button
          onClick={handleLogout}
          className="px-4 py-2 text-sm font-medium border border-white/20 rounded hover:bg-white/5 transition-colors"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
