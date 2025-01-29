'use client';

//import RootProvider from '../providers/RootProvider';

import { Toaster } from "@/components/ui/sonner"

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Sidebar } from '@/components/sidebar';
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

import { WalletProvider } from '@solana/wallet-adapter-react';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { ConnectionProvider } from '@solana/wallet-adapter-react';
import { clusterApiUrl } from '@solana/web3.js';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
require('@solana/wallet-adapter-react-ui/styles.css');

const inter = Inter({ subsets: ["latin"] });

import PageHeader from '../components/PageHeader';
import PageFooter from '../components/PageFooter';
import Head from "next/head";

const wallets = [new PhantomWalletAdapter()];
const endpoint = clusterApiUrl('devnet');

const metadata: Metadata = {
  title: 'Chippy',
  description: 'Play and Earn with Our New Game Hooked',
  openGraph: {
    images: ["https://fishandsol.vercel.app/images/logo3.png"],
    url: "https://fishandsol.vercel.app",
  }
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
    <html lang='en' className='dark'>
      <Head>
				<title>Chippy</title>
				<meta name="description" content="Play and Earn with Our New Game Hooked" />
				<meta property="og:title" content="Chippy" />
				<meta property="og:description" content="Play and Earn with Our New Game Hooked" />
				<meta property="og:image" content="https://fishandsol.vercel.app/images/logo3.png" />
				<meta property="og:url" content="https://fishandsol.vercel.app" />
				{/* Add more meta tags as needed */}
			</Head>
				<body className={inter.className}>
        <ConnectionProvider endpoint={endpoint}>
          <WalletProvider wallets={wallets} autoConnect>
            <WalletModalProvider>
              <Sidebar />
				
              <main className='mx-5 mt-16 sm:ml-[300px] sm:mt-3'>{children}
                <Toaster /></main>
				
            </WalletModalProvider>
          </WalletProvider>
        </ConnectionProvider>
				</body>
			</html>
	);
}
