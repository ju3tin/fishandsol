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
import LoginButton from './login-buton';

import { SidebarItems } from '@/types';
import { SidebarButton } from './sidebar-button';
import { useMediaQuery } from 'usehooks-ts';
import { SidebarMobile } from './sidebar-mobile';
import { useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
//import "./App.css";

// Default styles that can be overridden by your app
import "@solana/wallet-adapter-react-ui/styles.css";


const handleLoginClick = () => {
  // Handle login logic here
  alert('Login button clicked!');
};
  const wallets = [new PhantomWalletAdapter()];

const sidebarItems: SidebarItems = {
  links: [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Whitepaper', href: '/whitepaper', icon: Bell },
    { label: 'Roadmap', href: '/roadmap', icon: Mail },
    { href: '/item/lists', icon: List, label: 'Stake', },
    { href: '/item/solana', icon: Bookmark, label: 'Solana Information',},
    { href: '/game', icon: Users, label: 'Game',},
    { href: '/leaderboard', icon: User, label: 'Leaderboards', },
    /*{ href: '/map', icon: User, label: 'Maps', },*/
    { href: '/map3', icon: User, label: 'Maps', },
    { href: '/social', icon: User, label: 'Social Media', },
    { href: '/item/gameinstruct', icon: User, label: 'Game Instructions', },
  ],
  extras: (
    <div style={{backgroundColor:'black'}} className='flex flex-col gap-2'>
    
    <LoginButton />
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
