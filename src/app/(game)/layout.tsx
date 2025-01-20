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

const wallets = [new PhantomWalletAdapter()];
const endpoint = clusterApiUrl('devnet');

const metadata: Metadata = {
	title: "Crash",
	description: "Crash",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
    <html lang='en' className='dark'>
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
