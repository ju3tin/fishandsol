'use client';

import {
  Bell,
  Bookmark,
  Home,
  List,
  Mail,
  MoreHorizontal,
  User,
  Users,
} from 'lucide-react';
import { SidebarDesktop } from './sidebar-desktop';
import { SidebarItems } from '@/types';
import { SidebarButton } from './sidebar-button';
import { useMediaQuery } from 'usehooks-ts';
import { SidebarMobile } from './sidebar-mobile';

const sidebarItems: SidebarItems = {
  links: [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Whitepaper', href: '/item/notifications', icon: Bell },
    { label: 'Roadmap', href: '/item/messages', icon: Mail },
    { href: '/item/lists', icon: List, label: 'Stake', },
    { href: '/item/solana', icon: Bookmark, label: 'Solana Information',},
    { href: '/game', icon: Users, label: 'Game',},
    { href: '/leaderboard', icon: User, label: 'Leaderboards', },
    { href: '/map', icon: User, label: 'Maps', },
    { href: '/social', icon: User, label: 'Social Media', },
    { href: '/item/gameinstruct', icon: User, label: 'Game Instructions', },
  ],
  extras: (
    <div className='flex flex-col gap-2'>
    
      <SidebarButton
        className='w-full justify-center text-white'
        variant='default'
      >
        Login
      </SidebarButton>
    </div>
  ),
};

export function Sidebar() {
  const isDesktop = useMediaQuery('(min-width: 640px)', {
    initializeWithValue: false,
  });

  if (isDesktop) {
    return <SidebarDesktop sidebarItems={sidebarItems} />;
  }

  return <SidebarMobile sidebarItems={sidebarItems} />;
}
