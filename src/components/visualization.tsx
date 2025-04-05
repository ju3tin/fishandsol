"use client";

import { useEffect, useRef } from "react";
import { useGameStore, GameState } from "../store/gameStore";

const GameVisual = () => {
  const gameState5 = useGameStore((gameState5: GameState) => gameState5);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fishRef = useRef<HTMLDivElement | null>(null);
  const curveAnimationRef = useRef<number>(0);

  // Predefined control points
  const controlPoints = [
    { cp1: { x: 50, y: 20 }, cp2: { x: 150, y: 80 } },
    { cp1: { x: 100, y: 30 }, cp2: { x: 180, y: 120 } },
    { cp1: { x: 60, y: 90 }, cp2: { x: 200, y: 50 } },
    { cp1: { x: 120, y: 20 }, cp2: { x: 160, y: 100 } },
    { cp1: { x: 80, y: 80 }, cp2: { x: 140, y: 140 } },
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    const fish = fishRef.current;
    if (!canvas || !fish) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let t = 0;
    let transitionIndex = 0;

    let currentCP1 = { x: 20, y: 20 };
    let currentCP2 = { x: 200, y: 200 };
    let targetCP1 = controlPoints[0].cp1;
    let targetCP2 = controlPoints[0].cp2;

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

    function animate() {
      if (!canvas || !ctx || !fish) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.moveTo(20, 20);

      const cp1x = currentCP1.x + (targetCP1.x - currentCP1.x) * t;
      const cp1y = currentCP1.y + (targetCP1.y - currentCP1.y) * t;
      const cp2x = currentCP2.x + (targetCP2.x - currentCP2.x) * t;
      const cp2y = currentCP2.y + (targetCP2.y - currentCP2.y) * t;

      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, 200, 200);
      ctx.strokeStyle = "white";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Move fish to current curve end
      const fishPos = getBezierPoint(t, { x: 20, y: 20 }, { x: cp1x, y: cp1y }, { x: cp2x, y: cp2y }, { x: 200, y: 200 });
      fish.style.transform = `translate(${fishPos.x - 10}px, ${fishPos.y - 10}px)`; // Adjust offset if needed

      t += 0.01;

      if (t <= 1) {
        curveAnimationRef.current = requestAnimationFrame(animate);
      } else {
        transitionIndex = (transitionIndex + 1) % controlPoints.length;
        t = 0;
        currentCP1 = targetCP1;
        currentCP2 = targetCP2;
        targetCP1 = controlPoints[transitionIndex].cp1;
        targetCP2 = controlPoints[transitionIndex].cp2;
        curveAnimationRef.current = requestAnimationFrame(animate);
      }
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
  }, [gameState5.status]);

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
