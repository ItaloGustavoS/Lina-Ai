'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { navLinks } from '@/lib/navLinks';
import { useSession } from '@/hooks/useSession';
import { Button } from './ui/button';
import { LogOut } from 'lucide-react';

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useSession();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <aside className="w-64 bg-gray-900 text-white p-4 flex flex-col justify-between">
      <div>
        <h2 className="text-2xl font-bold mb-6">Lina AI</h2>
        <nav className="flex flex-col space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'block p-3 rounded-lg hover:bg-gray-800 transition-colors',
                {
                  'bg-gray-800': pathname === link.href,
                }
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
      <Button
        onClick={handleLogout}
        variant="ghost"
        className="w-full justify-start text-left p-3 hover:bg-gray-800"
      >
        <LogOut className="mr-2 h-4 w-4" />
        Logout
      </Button>
    </aside>
  );
};

export default Sidebar;
