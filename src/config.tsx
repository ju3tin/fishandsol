import { usePathname } from 'next/navigation';
import Image from "next/image";

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
      href: '/whitepaper',
      icon: <BookOpenCheck size={20} />,
      active: isNavItemActive(pathname, '/whitepaper'),
      position: 'top',
    },
    {
      name: 'About',
      href: '/about',
      icon: <BadgeInfo size={20} />,
      active: isNavItemActive(pathname, '/about'),
      position: 'top',
    },
    {
      name: 'Free Chippy Friday',
      href: '/chippyfriday',
      icon: <Image src="/images/logo1.png" alt="Chippy" width={20} height={20} />,
      active: isNavItemActive(pathname, '/chippyfriday'),
      position: 'top',
    },
    {
      name: 'Buy Chippy',
      href: '/stable',
      icon: <Image src="/images/token.svg" alt="Buy Chippy" width={20} height={20} />,
      active: isNavItemActive(pathname, '/stable'),
      position: 'top',
    },
    {
      name: 'Solana Information',
      href: '/solana',
      icon: <Image src="/images/solanalogo.svg" alt="Solana Logo" height={20} width={20} />, // Adjust the path and size as needed
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