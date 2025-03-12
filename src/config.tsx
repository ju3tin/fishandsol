import { usePathname } from 'next/navigation';

import { Bell, Briefcase, Home, Settings, User, BookOpenCheck } from 'lucide-react';

export const NavItems = () => {
  const pathname = usePathname() || '';

  function isNavItemActive(pathname: string, nav: string) {
    return pathname.includes(nav);
  }

  return [
    {
      name: 'Home',
      href: '/',
      icon: <Home size={20} />,
      active: pathname === '/',
      position: 'top',
    },
    {
      name: 'Whitepaper',
      href: '/profile',
      icon: <BookOpenCheck size={20} />,
      active: isNavItemActive(pathname, '/profile'),
      position: 'top',
    },
    {
      name: 'Notifications',
      href: '/notifications',
      icon: <Bell size={20} />,
      active: isNavItemActive(pathname, '/notifications'),
      position: 'top',
    },
    {
      name: 'Projects',
      href: '/projects',
      icon: <Briefcase size={20} />,
      active: isNavItemActive(pathname, '/projects'),
      position: 'top',
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: <Settings size={20} />,
      active: isNavItemActive(pathname, '/settings'),
      position: 'bottom',
    },
  ];
};