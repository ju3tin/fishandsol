"use client"
import CrashGame from "../../../components/crash-game3"
import Image from 'next/image'; // Import the Image component

export default function Home() {
  // Define the values for buttonClicked and buttonPressCount
  //const buttonClicked = false; // or true, depending on your logic
  //const buttonPressCount = 0; // Set this to the appropriate value

  return (
    <main className="flex flex-col items-center justify-center p-4 bg-black">
      <CrashGame />
    </main>
  )
}
