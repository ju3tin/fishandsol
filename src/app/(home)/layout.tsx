import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Analytics } from "@vercel/analytics/react";
import { Sidebar } from '@/components/sidebar';
import { Suspense } from 'react';
import WalletContextProvider from "@/providers/WalletContextProvider";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogClose } from '@radix-ui/react-dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";


const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
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
    <SessionProvider>
    <html lang='en' className='dark'>
      <body className={inter.className}>
      <Analytics/>
        <Sidebar />
        <main className='mx-5 mt-16 sm:ml-[300px] sm:mt-3'>{children}</main>
      </body>
    </html>
    </SessionProvider>
  );
}
