"use client"
import CrashGame from "@/components/crash-game4"
import Image from 'next/image'; // Import the Image component

export default function Home() {
  return (
    
    <main className="flex flex-col items-center justify-center p-4 bg-black">
      
      <CrashGame />
    </main>
  )
}
