import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { WalletProvider } from "../test5/wallet-provider"
import { ErrorBoundary } from "../../../components/error-boundary"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Solana Staking App",
  description: "Stake your Solana tokens and earn rewards",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ErrorBoundary>
          <WalletProvider>{children}</WalletProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
