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
  Fish,
  Gamepad2,
  WalletCards,
  BookOpenCheck,
  BadgeInfo,
  Info,
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

import WalletContextProvider from "@/providers/WalletContextProvider";
{/*import Header from "../components/Header" */}


const handleLoginClick = () => {
  // Handle login logic here
  alert('Login button clicked!');
};
  const wallets = [new PhantomWalletAdapter()];

const sidebarItems: SidebarItems = {
  links: [
    { label: 'Home', href: '/', icon: Home },
      { label: 'Whitepaper', href: '/whitepaper', icon: BookOpenCheck },
      { label: 'About', href: '/about', icon: BadgeInfo },
      { label: 'Free Chippy Friday', href: '/chippyfriday', icon: Fish },
      { href: '/game', icon: Gamepad2, label: 'Game',},
  
      {
        href: '/stable',
        icon: WalletCards,
        label: 'Stake',
      },
      { href: '/solana', icon: Info, label: 'Solana Information',},
  
  
      { href: '/leaderboard', icon: User, label: 'Leaderboards', },
  ],
  extras: (
    <div style={{backgroundColor:'black'}} className='flex flex-col gap-2'>
    
   
    <WalletContextProvider>
         

    <LoginButton />
   {/* <Header /> */} 
         </WalletContextProvider>
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
