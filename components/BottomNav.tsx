'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiHome, FiBook, FiAward, FiUser } from 'react-icons/fi';

export default function BottomNav() {
  const pathname = usePathname();

  const links = [
    { href: '/', icon: FiHome, label: 'Home' },
    { href: '/tracks', icon: FiBook, label: 'Learn' },
    { href: '/exams', icon: FiAward, label: 'Exams' },
    { href: '/dashboard', icon: FiUser, label: 'Profile' },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 glass border-t border-white/10 z-50 pb-safe">
      <div className="flex justify-around items-center h-16 px-4">
        {links.map((link) => {
          const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
          const Icon = link.icon;
          
          return (
            <Link key={link.href} href={link.href} className="flex flex-col items-center justify-center w-full h-full">
              <div className={`p-2 rounded-xl transition-all duration-300 ${isActive ? 'bg-primary/20 text-primary' : 'text-gray-400 hover:text-white'}`}>
                <Icon size={22} className={isActive ? 'drop-shadow-[0_0_8px_rgba(79,70,229,0.8)]' : ''} />
              </div>
              <span className={`text-[10px] mt-1 font-medium ${isActive ? 'text-primary' : 'text-gray-400'}`}>
                {link.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
