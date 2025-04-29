import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Head from 'next/head'
import ContextProvider from '@/components/context-provider';
import { Analytics } from "@vercel/analytics/react";

import './global.css';
import "../../../../public/style5.css"
import SideNav from '../../components/side-nav';

import Header from './header';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Chippie',
  description: 'Chippie Game',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">

<Head>
        <title>Chippie</title>
      </Head>
      
      <body className={inter.className}>
       <ContextProvider>
          <Header />
          <div className="flex">
            <SideNav />
            <div className="w-full overflow-x-auto">
              <div className="sm:h-[calc(99vh-60px)] overflow-auto ">
                <div className="">
                  <div className="">{children}</div>
                </div>
              </div>
            </div>
          </div>
        </ContextProvider>
        <Analytics />
      </body>
    </html>
  );
}