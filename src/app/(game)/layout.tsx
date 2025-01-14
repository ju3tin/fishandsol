//import RootProvider from '../providers/RootProvider';

import { Toaster } from "@/components/ui/sonner"

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Sidebar } from '@/components/sidebar';
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

import PageHeader from '../components/PageHeader';
import PageFooter from '../components/PageFooter';

export const metadata: Metadata = {
	title: "Crash",
	description: "Crash",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
			<html lang="en">
				<body className={inter.className}>
        <Sidebar />
				
        <main className='mx-5 mt-16 sm:ml-[300px] sm:mt-3'>{children}
					<Toaster /></main>
				
				</body>
			</html>
	);
}
