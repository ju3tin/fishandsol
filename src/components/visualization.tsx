"use client";

import { useEffect, useRef } from "react";
import { useGameStore, GameState } from "../store/gameStore";

const GameVisual = () => {
  const gameState5 = useGameStore((gameState5: GameState) => gameState5);

  // Refs to the canvas and fish elements
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fishRef = useRef<HTMLDivElement | null>(null);
  const curveAnimationRef = useRef<number>(0);

  // Predefined control points for the Bezier curve
  const controlPoints = [
    { cp1: { x: 0, y: 120 }, cp2: { x: 200, y: 120 } }, // Start at {0, 120}, move straight
    { cp1: { x: 120, y: 0 }, cp2: { x: 120, y: 120 } }, // Transition into curve
    { cp1: { x: 120, y: 90 }, cp2: { x: 200, y: 200 } },
    { cp1: { x: 120, y: 20 }, cp2: { x: 200, y: 100 } },
    { cp1: { x: 80, y: 80 }, cp2: { x: 200, y: 200 } },
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    const fish = fishRef.current;
    if (!canvas || !fish) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let t = 0;  // Time factor, controls progress along the Bezier curve
    let transitionIndex = 0;

    // Initial control points for the curve
    let currentCP1 = { x: 0, y: 120 }; // Point A - Starting Point
    let currentCP2 = { x: 200, y: 120 };
    let targetCP1 = controlPoints[0].cp1;
    let targetCP2 = controlPoints[0].cp2;

    // Function to calculate the point on the Bezier curve at time t
    function getBezierPoint(t: number, p0: any, p1: any, p2: any, p3: any) {
      const u = 1 - t;
      const tt = t * t;
      const uu = u * u;
      const uuu = uu * u;
      const ttt = tt * t;

      const x = uuu * p0.x
              + 3 * uu * t * p1.x
              + 3 * u * tt * p2.x
              + ttt * p3.x;
      const y = uuu * p0.y
              + 3 * uu * t * p1.y
              + 3 * u * tt * p2.y
              + ttt * p3.y;
      return { x, y };
    }

    // Function to calculate the tangent (angle) of the curve at time t
    function getBezierTangent(t: number, p0: any, p1: any, p2: any, p3: any) {
      const u = 1 - t;
      const tt = t * t;
      const uu = u * u;

      const dx = -3 * uu * p0.x + 3 * (uu - 2 * u * t) * p1.x + 3 * (2 * t * u - tt) * p2.x + 3 * tt * p3.x;
      const dy = -3 * uu * p0.y + 3 * (uu - 2 * u * t) * p1.y + 3 * (2 * t * u - tt) * p2.y + 3 * tt * p3.y;
      return Math.atan2(dy, dx);  // Returns angle in radians
    }

    // The animation function that moves the fish and draws the curve
    function animate() {
      if (!canvas || !ctx || !fish) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);  // Clear the canvas
      ctx.beginPath();
      ctx.moveTo(0, 120);  // Point A - Starting point of the curve

      // Interpolate control points for smooth transitions between them
      const cp1x = currentCP1.x + (targetCP1.x - currentCP1.x) * t;
      const cp1y = currentCP1.y + (targetCP1.y - currentCP1.y) * t;
      const cp2x = currentCP2.x + (targetCP2.x - currentCP2.x) * t;
      const cp2y = currentCP2.y + (targetCP2.y - currentCP2.y) * t;

      // Move Point B (final destination) dynamically based on t
      const pointB = { x: 200 + (t * 100), y: 120 + (t * 40) };  // Point B moving over time

      // Draw the Bezier curve on the canvas, with updated Point B
      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, pointB.x, pointB.y);
      ctx.strokeStyle = "white";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Calculate the position of the fish at the current t along the curve
      const fishPos = getBezierPoint(t, { x: 0, y: 120 }, { x: cp1x, y: cp1y }, { x: cp2x, y: cp2y }, pointB);
      fish.style.transform = `translate(${fishPos.x - 10}px, ${fishPos.y - 10}px)`;  // Adjust offset if needed

      // Calculate the angle to rotate the fish based on the tangent (direction of the curve)
      const angle = getBezierTangent(t, { x: 0, y: 120 }, { x: cp1x, y: cp1y }, { x: cp2x, y: cp2y }, pointB);
      fish.style.transform += ` rotate(${angle}rad)`;  // Rotate the fish to face the curve

      t += 0.01;  // Increment t to move the fish along the curve

      // Continue the animation if t <= 1, otherwise, switch to the next control points
      if (t <= 1) {
        curveAnimationRef.current = requestAnimationFrame(animate);
      } else {
        transitionIndex = (transitionIndex + 1) % controlPoints.length;  // Move to the next control point set
        t = 0;
        currentCP1 = targetCP1;
        currentCP2 = targetCP2;
        targetCP1 = controlPoints[transitionIndex].cp1;
        targetCP2 = controlPoints[transitionIndex].cp2;
        curveAnimationRef.current = requestAnimationFrame(animate);
      }
    }

    // Start animation if the game is running
    if (gameState5.status === "Running") {
      animate();
    } else {
      if (curveAnimationRef.current) {
        cancelAnimationFrame(curveAnimationRef.current);  // Cancel animation if not running
      }
    }

    // Cleanup the animation on component unmount or when the status changes
    return () => {
      if (curveAnimationRef.current) {
        cancelAnimationFrame(curveAnimationRef.current);
      }
    };
  }, [gameState5.status]);  // Re-run the effect when the game state changes

  return (
    <div className="relative h-64 bg-gray-900 rounded-lg overflow-hidden mb-4">
      {gameState5.status !== "Waiting" && (
        <div className="absolute inset-0">
          <canvas
            ref={canvasRef}
            width={300}
            height={150}
            className="w-full h-full"
          />
          {/* Fish SVG */}
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
