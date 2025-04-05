import { usePathname } from 'next/navigation';

import { Bell, Briefcase, Home, Settings, User,WalletCards, BookOpenCheck, Fish,
  Bookmark,
  List,
  Mail,
  MoreHorizontal,
  Users,
  Gamepad2,
  BadgeInfo,
  Info, } from 'lucide-react';

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
      name: 'About',
      href: '/about',
      icon: <Bell size={20} />,
      active: isNavItemActive(pathname, '/about'),
      position: 'top',
    },
    {
      name: 'free Chippie Friday',
      href: '/chippyfriday',
      icon: <Briefcase size={20} />,
      active: isNavItemActive(pathname, '/chippyfriday'),
      position: 'top',
    },
    {
      name: 'Stake',
      href: '/stable',
      icon: <WalletCards size={20} />,
      active: isNavItemActive(pathname, '/stable'),
      position: 'top',
    },
    {
      name: 'Solana Information',
      href: '/solana',
      icon: <Briefcase size={20} />,
      active: isNavItemActive(pathname, '/solana'),
      position: 'top',
    },
    {
      name: 'Leaderboards',
      href: '/leaderboard',
      icon: <User size={20} />,
      active: isNavItemActive(pathname, '/leaderboard'),
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