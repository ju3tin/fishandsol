"use client";

import { useEffect, useRef } from "react";
import { useGameStore, GameState } from "../store/gameStore";
import { controlPoints } from "./controlPoints";

interface GameVisualProps {
  currentMultiplier: number;
  onCashout: (multiplier: number) => void;
  dude55: boolean;
  dude56: string;
  betAmount: string;
}

const GameVisual: React.FC<GameVisualProps> = ({ currentMultiplier, dude55, dude56, betAmount }) => {
  const gameState5 = useGameStore((gameState5: GameState) => gameState5);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fishRef = useRef<HTMLDivElement | null>(null);
  const curveAnimationRef = useRef<number>(0);

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

    const tValues = [0.2, 0.5, 0.8];
    const svgPaths = ["/demo.svg", "/sol.svg", "/eth.svg"]; // or imported SVGs
    const svgImagesRef = useRef<HTMLImageElement[]>([]);

    // Load SVGs once
    useEffect(() => {
      const loadSVGs = async () => {
        const images = await Promise.all(
          svgPaths.map(
            (src) =>
              new Promise<HTMLImageElement>((resolve) => {
                const img = new Image();
                img.src = src;
                img.onload = () => resolve(img);
              })
          )
        );
        svgImagesRef.current = images;
      };

      loadSVGs();
    }, []);


    function animate() {
      if (!canvas || !ctx || !fish) return;
    
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
    
      // 🟠 Add dots here
    
      // Render SVGs instead of drawing on canvas
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

                  {/* 🛑 Draw SVG dots moving based on multiplier */}
                  {dude55 && tValues.map((dotT, index) => {
                    const { x, y } = getBezierPoint(dotT, { x: 0, y: 120 }, { x: cp1x, y: cp1y }, { x: cp2x, y: cp2y }, { x: pointBx, y: pointBy });
                    return (
                      <img
                        key={index}
                        src={svgImagesRef.current[index]?.src}
                        alt={`dot-${index}`}
                        className="absolute"
                        style={{
                          left: `${x}px`,
                          top: `${y}px`,
                          width: '8px', // Adjust size as needed
                          height: '8px', // Adjust size as needed
                          transform: "translate(-50%, -50%)",
                        }}
                      />
                    );
                  })}
                </>
              )}
              <div ref={fishRef} className="absolute w-6 h-6">
                <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-blue-400">
                  <path
                    d="M2 12c2-4 6-8 10-8s8 4 10 8c-2 4-6 8-10 8s-8-4-10-8z"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="currentColor"
                  />
                </svg>
              </div>
            </div>
          )}
        </div>
      );
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
          <div ref={fishRef} className="absolute w-6 h-6">
            <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-blue-400">
              <path
                d="M2 12c2-4 6-8 10-8s8 4 10 8c-2 4-6 8-10 8s-8-4-10-8z"
                stroke="currentColor"
                strokeWidth="2"
                fill="currentColor"
              />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameVisual;
