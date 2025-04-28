"use client";

import { useEffect, useRef } from "react";
import { useGameStore, GameState } from "../store/gameStore";
import { controlPoints } from "./controlPoints";
import { color } from "framer-motion";

interface GameVisualProps {
  currentMultiplier: number;
  onCashout: (multiplier: number) => void;
  dude55: boolean;
  dude56: string;
  betAmount: string;
  tValues: {
    number: number;
    color: string;
    svg: string;
  }[];
}

const GameVisual: React.FC<GameVisualProps> = ({ currentMultiplier, dude55, dude56, betAmount, tValues }) => {
  const gameState5 = useGameStore((gameState5: GameState) => gameState5);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fishRef = useRef<HTMLDivElement | null>(null);
  const curveAnimationRef = useRef<number>(0);
  const backgroundImage = useRef<HTMLDivElement | null>(null);

  const pointBRef = useRef<{ x: number; y: number }>({ x: 0, y: 120 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const fish = fishRef.current;
    if (!canvas || !fish) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let t = 0;
    let transitionIndex = 0;

    let currentCP1 = { x: 0, y: 120 };
    let currentCP2 = { x: 0, y: 120 };
    let currentPointB = { x: 0, y: 120 };
    let targetCP1 = controlPoints[0].cp1;
    let targetCP2 = controlPoints[0].cp2;
    let targetPointB = controlPoints[0].pointB;

    function getBezierPoint(t: number, p0: any, p1: any, p2: any, p3: any) {
      const u = 1 - t;
      const tt = t * t;
      const uu = u * u;
      const uuu = uu * u;
      const ttt = tt * t;

      const x = uuu * p0.x + 3 * uu * t * p1.x + 3 * u * tt * p2.x + ttt * p3.x;
      const y = uuu * p0.y + 3 * uu * t * p1.y + 3 * u * tt * p2.y + ttt * p3.y;
      return { x, y };
    }

    function getBezierTangent(t: number, p0: any, p1: any, p2: any, p3: any) {
      const u = 1 - t;
      const tt = t * t;
      const uu = u * u;

      const dx = -3 * uu * p0.x + 3 * (uu - 2 * u * t) * p1.x + 3 * (2 * t * u - tt) * p2.x + 3 * tt * p3.x;
      const dy = -3 * uu * p0.y + 3 * (uu - 2 * u * t) * p1.y + 3 * (2 * t * u - tt) * p2.y + 3 * tt * p3.y;
      return Math.atan2(dy, dx);
    }

    let logged = false; // 👈 add this at top of useEffect

    let loggednum = 0;
/*
    const tValues = [
      { number: 0.2, color: 'blue', svg: '/31832.png' },
      { number: 0.5, color: 'red', svg: '/sol.svg' },
      { number: 0.75, color: 'orange', svg: '/demo.svg' }
    ];
*/

const fish1 = new Image();
fish1.src = "/images/chippy.svg"; // Use your actual path
fish1.onload = () => {
  requestAnimationFrame(animate);
};


function animate() {
  if (!canvas || !ctx || !fish1.complete) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.moveTo(0, 120);

  const cp1x = currentCP1.x + (targetCP1.x - currentCP1.x) * t;
  const cp1y = currentCP1.y + (targetCP1.y - currentCP1.y) * t;
  const cp2x = currentCP2.x + (targetCP2.x - currentCP2.x) * t;
  const cp2y = currentCP2.y + (targetCP2.y - currentCP2.y) * t;
  const pointBx = currentPointB.x + (targetPointB.x - currentPointB.x) * t;
  const pointBy = currentPointB.y + (targetPointB.y - currentPointB.y) * t;

  ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, pointBx, pointBy);
  ctx.strokeStyle = "white";
  ctx.lineWidth = 2;
  ctx.stroke();

  // 🟠 Draw dots
  tValues.forEach((dotT) => {
    const { x, y } = getBezierPoint(
      dotT.number,
      { x: 0, y: 120 },
      { x: cp1x, y: cp1y },
      { x: cp2x, y: cp2y },
      { x: pointBx, y: pointBy }
    );

    const img = new Image();
    img.src = dotT.svg;

    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fillStyle = dotT.color;
    ctx.fill();

    img.onload = () => {
      ctx.drawImage(img, x - 8, y - 8, 20, 20);
    };
  });

  // 🐟 Draw fish1 at the end of the curve (pointB)
  ctx.save();
  ctx.translate(pointBx, pointBy);
  ctx.drawImage(fish1, -25, -25, 50, 50); // Adjust position/size as needed
  ctx.restore();

  pointBRef.current = { x: pointBx, y: pointBy };

  t += 0.01;

  if (t <= 1) {
    curveAnimationRef.current = requestAnimationFrame(animate);
  } else {
    transitionIndex = (transitionIndex + 1) % controlPoints.length;
    t = 0;
    currentCP1 = targetCP1;
    currentCP2 = targetCP2;
    currentPointB = targetPointB;
    targetCP1 = controlPoints[transitionIndex].cp1;
    targetCP2 = controlPoints[transitionIndex].cp2;
    targetPointB = controlPoints[transitionIndex].pointB;
    curveAnimationRef.current = requestAnimationFrame(animate);
  }
}



    if (dude55 && !logged) {
      console.log("Recording t because dude55 is true:", t.toFixed(4));
      logged = true; // prevent multiple logs
      loggednum = t;
    }

    if (gameState5.status === "Running") {
      animate();
    } else {
      if (curveAnimationRef.current) {
        cancelAnimationFrame(curveAnimationRef.current);
      }
    }

    return () => {
      if (curveAnimationRef.current) {
        cancelAnimationFrame(curveAnimationRef.current);
      }
    };
  }, [gameState5.status]); // ❗ do NOT need dude55 here

  return (
    <div className="relative h-64 bg-gray-900 rounded-lg overflow-hidden mb-4">
      {gameState5.status !== "Waiting" && (
        <div className="absolute inset-0">
          <canvas
            ref={canvasRef}
            width={400}
            height={200}
            className="w-full h-full"
          />
          {gameState5.status === "Running" && (
            <>
              <span style={{ top: '100px', display: 'block', position: 'absolute' }}>
                Current Multiplier {currentMultiplier}x
              </span>

              {/* 🛑 Draw RED dot moving based on multiplier */}
              {dude55 && (
                <div
                  className="absolute w-4 h-4 bg-red-500 rounded-full"
                  style={{
                    left: pointBRef.current.x - currentMultiplier * 10, // ← move left
                    top: pointBRef.current.y + currentMultiplier * 5,   // ↓ move downward
                    transform: "translate(-50%, -50%)",
                  }}>{dude56} and your bet amount {betAmount}</div>
               
              )}
            </>
          )}
          <div style={{display:"none"}} ref={fishRef} className="absolute w-6 h-6">
          <img
  src="/images/chippy.svg"
  alt="End Fish"
  className="absolute w-6 h-6"
  style={{
    transform: `translate(${pointBRef.current.x - 12}px, ${pointBRef.current.y - 12}px))`, marginTop:`-150px`
  }}
/>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameVisual;