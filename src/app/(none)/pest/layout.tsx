import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import "/style5.css"
import { ThemeProvider } from "@/components/theme-provider"
import ContextProvider from '@/components/context-provider';
import Header from './header';

import SideNav from '../../../components/side-nav1';

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Solana Crash Game",
  description: "A crash game with Solana betting",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body style={{backgroundColor:'black !important'}} className={inter.className}>
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
      </body>
    </html>
  )
}
