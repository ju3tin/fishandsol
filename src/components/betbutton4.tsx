"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Fish } from "lucide-react"
import GameChat from "./game-chat"

// Type for cashout events
type CashoutEvent = {
    id: string
    multiplier: number
    amount: number
  }

type BetbuttonProps = {
  gameState: "idle" | "running" | "crashed";
  crashPoint: number;
  onCrash: () => void;
}

const Betbutton = ({ gameState, crashPoint, onCrash }: BetbuttonProps) => {
  const [isMobile, setIsMobile] = useState(false);
  const [currentMultiplier, setCurrentMultiplier] = useState(1)
  const [betAmount, setBetAmount] = useState("0.1")
  const [autoCashoutAt, setAutoCashoutAt] = useState("2")
  const [gameHistory, setGameHistory] = useState<number[]>([])
  const [userCashedOut, setUserCashedOut] = useState(false)
  const [userWinnings, setUserWinnings] = useState(0)
  const [pathProgress, setPathProgress] = useState(0)
  const [cashouts, setCashouts] = useState<CashoutEvent[]>([])

  // Animation refs
  const animationRef = useRef<number>(0)
  const startTimeRef = useRef<number>(0)
  const gameTimerRef = useRef<NodeJS.Timeout | null>(null)
  const pathRef = useRef<SVGPathElement | null>(null)
  const svgRef = useRef<SVGSVGElement | null>(null)
  const currentMultiplierRef = useRef<number>(1)

// Constants
const MAX_MULTIPLIER = 100
const GAME_DURATION_MS = 15000 // 15 seconds max game duration

useEffect(() => {
  const checkScreenSize = () => setIsMobile(window.innerWidth <= 768);

  checkScreenSize(); // Initial check
  window.addEventListener("resize", checkScreenSize);

  return () => window.removeEventListener("resize", checkScreenSize);
}, []);

// Update ref when state changes
useEffect(() => {
  currentMultiplierRef.current = currentMultiplier
}, [currentMultiplier])

// Generate a crash point
const generateCrashPoint = () => {
  // Random number between 1 and MAX_MULTIPLIER
  // This is a simplified version - in a real game, you'd use a provably fair algorithm
  return 1 + Math.random() * 5 // Crash between 1x and 6x for testing
}

// Start a new game
const startGame = () => {
  if (Number.parseFloat(betAmount) <= 0) {
    return
  }

  setUserCashedOut(false)
  setUserWinnings(0)
  setCashouts([])

  // Reset multiplier and start game
  setCurrentMultiplier(1)
  currentMultiplierRef.current = 1
  setPathProgress(0)
  startTimeRef.current = Date.now()

  // Start animation loop
  animateGame()

  // Set timer for game end
  gameTimerRef.current = setTimeout(() => {
    endGame(crashPoint)
  }, GAME_DURATION_MS)

  // Simulate other players cashing out at random times
  simulateOtherPlayers(crashPoint)
}

// Simulate other players cashing out
const simulateOtherPlayers = (crashPoint: number) => {
  // Create 3-5 random cashout events
  const numPlayers = 3 + Math.floor(Math.random() * 3)

  for (let i = 0; i < numPlayers; i++) {
    // Random cashout multiplier between 1.1 and crash point
    const cashoutMultiplier = 1.1 + Math.random() * (crashPoint - 1.1)

    // Random delay before cashing out
    const delay = 1000 + Math.random() * 8000

    setTimeout(() => {
      // Only add cashout if game is still running and the multiplier hasn't been reached yet
      if (crashPoint >= cashoutMultiplier) {
        // Ensure we only cash out at the current or lower multiplier
        const actualMultiplier = Math.min(cashoutMultiplier, currentMultiplierRef.current)

        // Only cash out if the multiplier is greater than 1.1
        if (actualMultiplier > 1.1) {
          addCashoutEvent(`player${i + 1}`, actualMultiplier, (0.05 + Math.random() * 0.5).toFixed(2))
        }
      }
    }, delay)
  }
}

// Animate the game
const animateGame = () => {
  const elapsed = Date.now() - startTimeRef.current
  const progress = Math.min(1, elapsed / GAME_DURATION_MS)

  // Calculate current multiplier using bezier curve for smoother acceleration
  // This creates an exponential growth curve
  const t = progress
  const multiplier = 1 + Math.pow(t, 2) * (crashPoint - 1)
  const formattedMultiplier = Number.parseFloat(multiplier.toFixed(2))

  setCurrentMultiplier(formattedMultiplier)
  currentMultiplierRef.current = formattedMultiplier

  // Calculate path progress based on multiplier
  const newPathProgress = Math.min(1, (multiplier - 1) / (crashPoint - 1))
  setPathProgress(newPathProgress)

  // Check for auto cashout
  if (multiplier >= Number.parseFloat(autoCashoutAt) && !userCashedOut) {
    cashout(formattedMultiplier)
  }

  // Check if we've reached the crash point
  if (multiplier >= crashPoint) {
    endGame(crashPoint)
    return
  }

  // Continue animation
  animationRef.current = requestAnimationFrame(animateGame)
}

// End the game
const endGame = (finalMultiplier: number) => {
  // Cancel animation and timer
  cancelAnimationFrame(animationRef.current)
  if (gameTimerRef.current) {
    clearTimeout(gameTimerRef.current)
    gameTimerRef.current = null
  }

  // Update game state
  setCurrentMultiplier(finalMultiplier)
  currentMultiplierRef.current = finalMultiplier

  // Add to history
  setGameHistory((prev) => [finalMultiplier, ...prev].slice(0, 10))

  // Reset after a delay
  setTimeout(() => {
    onCrash()
  }, 3000)
}

// Reset game to idle state
const resetGame = () => {
  onCrash()
}

// Add a cashout event
const addCashoutEvent = (id: string, multiplier: number, amount: string) => {
  // Add to cashouts
  setCashouts((prev) => [
    ...prev,
    {
      id,
      multiplier,
      amount: Number.parseFloat(amount),
    },
  ])
}

// Cash out current bet
const cashout = (exactMultiplier?: number) => {
  if (userCashedOut) return

  // Use the exact multiplier passed in, or the current multiplier ref value
  // This ensures we use the most up-to-date multiplier value
  const cashoutMultiplier = exactMultiplier || currentMultiplierRef.current

  setUserCashedOut(true)
  const winnings = Number.parseFloat(betAmount) * cashoutMultiplier
  setUserWinnings(winnings)

  // Add cashout dot for the user
  addCashoutEvent("you", cashoutMultiplier, betAmount)
}

// Clean up on unmount
useEffect(() => {
  return () => {
    cancelAnimationFrame(animationRef.current)
    if (gameTimerRef.current) {
      clearTimeout(gameTimerRef.current)
    }
  }
}, [])

// Calculate the curve path based on current multiplier
const getCurvePath = () => {
  // Start point at bottom left
  const startX = 0
  const startY = 100

  // Middle point at middle right
  const midX = 100
  const midY = 50

  // End point - moves upward based on multiplier
  // As multiplier increases, the end point moves higher
  const endX = 100
  const endY = Math.max(0, 50 - (currentMultiplier - 1) * 10)

  // For a curve that goes from bottom left to middle right, then curves upward,
  // we'll use a cubic bezier curve (C command in SVG path)
  // We need two control points for a cubic bezier
  const control1X = 50 // First control point, halfway horizontally
  const control1Y = 100 // Keep it at the bottom for a flat initial segment

  const control2X = 100 // Second control point, at the right edge
  const control2Y = 75 // Slightly above the middle point for a smooth curve

  return `M ${startX},${startY} C ${control1X},${control1Y} ${control2X},${control2Y} ${midX},${midY} L ${endX},${endY}`
}

// Get point at a specific progress along the path
const getPointAtProgress = (progress: number) => {
  if (!pathRef.current) return { x: 0, y: 100 }

  const pathLength = pathRef.current.getTotalLength()
  const point = pathRef.current.getPointAtLength(progress * pathLength)
  return { x: point.x, y: point.y }
}

// Calculate multiplier progress
const getMultiplierProgress = (multiplier: number) => {
  return Math.min(1, (multiplier - 1) / (crashPoint - 1))
}

// Get rocket position along the path
const getRocketPosition = () => {
  return getPointAtProgress(pathProgress)
}

// Get rocket rotation based on position on the path
const getRocketRotation = () => {
  if (!pathRef.current) return 0

  const pathLength = pathRef.current.getTotalLength()
  const distance = pathProgress * pathLength

  // Get points slightly before and after current position to determine direction
  const pointBefore = pathRef.current.getPointAtLength(Math.max(0, distance - 1))
  const pointAfter = pathRef.current.getPointAtLength(Math.min(pathLength, distance + 1))

  // Calculate angle based on direction
  const angle = Math.atan2(pointAfter.y - pointBefore.y, pointAfter.x - pointBefore.x)

  // Convert to degrees and adjust (0 degrees is right, 90 is down)
  return angle * (180 / Math.PI) + 90
}

    return (

    <div className="lg:col-span-2">
    <Card className="bg-black border-black">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="bet-amount" className="text-white">
              Bet Amount (SOL)
            </Label>
            <Input
              id="bet-amount"
              type="number"
              value={betAmount}
              onChange={(e) => setBetAmount(e.target.value)}
              disabled={userCashedOut}
              className="bg-gray-700 border-gray-600 text-white"
              min="0.01"
              step="0.01"
            />
          </div>

          <div>
            <Label htmlFor="auto-cashout" className="text-white">
              Auto Cashout At
            </Label>
            <Input
              id="auto-cashout"
              type="number"
              value={autoCashoutAt}
              onChange={(e) => setAutoCashoutAt(e.target.value)}
              disabled={userCashedOut}
              className="bg-gray-700 border-gray-600 text-white"
              min="1.01"
              step="0.01"
            />
          </div>

          {userCashedOut ? (
            <Button disabled className="w-full bg-red-600">
              Crashed
            </Button>
          ) : (
            <Button onClick={startGame} className="w-full bg-green-600 hover:bg-green-700">
              Place Bet
            </Button>
          )}
        </div>

        {/* Active players */}
        {userCashedOut && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-400 mb-2">Active Players</h3>
            <div className="space-y-2">
              {cashouts.length === 0 && (
                <div className="text-xs text-gray-500">Waiting for players to cash out...</div>
              )}
              {cashouts.map((cashout) => (
                <div key={cashout.id} className="flex justify-between items-center text-xs">
                  <span className="font-medium text-white">{cashout.id === "you" ? "You" : cashout.id}</span>
                  <span className="text-yellow-400">
                    {cashout.amount.toFixed(2)} SOL @ {cashout.multiplier.toFixed(2)}x
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  </div>
    )

}

export default Betbutton