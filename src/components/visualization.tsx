"use client";

import { useEffect, useRef } from "react";
import { useGameStore, GameState } from "../store/gameStore";

const GameVisual = () => {
  const gameState5 = useGameStore((gameState5: GameState) => gameState5);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fishRef = useRef<HTMLDivElement | null>(null);
  const curveAnimationRef = useRef<number>(0);

  // Updated controlPoints: includes cp1, cp2, and pointB
  const controlPoints = [
    { cp1: { x: 0, y: 120 }, cp2: { x: 0, y: 120 }, pointB: { x: 0, y: 120 } },
    { cp1: { x: 120, y: 0 }, cp2: { x: 120, y: 120 }, pointB: { x: 200, y: 100 } },
    { cp1: { x: 120, y: 90 }, cp2: { x: 200, y: 200 }, pointB: { x: 250, y: 150 } },
    { cp1: { x: 120, y: 20 }, cp2: { x: 200, y: 100 }, pointB: { x: 300, y: 120 } },
    { cp1: { x: 80, y: 80 }, cp2: { x: 200, y: 200 }, pointB: { x: 350, y: 200 } },
  ];

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

    function animate() {
      if (!canvas || !ctx || !fish) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.moveTo(0, 120);

      // Interpolating control points and pointB
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

      const fishPos = getBezierPoint(t, { x: 0, y: 120 }, { x: cp1x, y: cp1y }, { x: cp2x, y: cp2y }, { x: pointBx, y: pointBy });
      fish.style.transform = `translate(${fishPos.x - 10}px, ${fishPos.y - 10}px)`;

      const angle = getBezierTangent(t, { x: 0, y: 120 }, { x: cp1x, y: cp1y }, { x: cp2x, y: cp2y }, { x: pointBx, y: pointBy });
      fish.style.transform += ` rotate(${angle}rad)`;

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
            width={400}
            height={200}
            className="w-full h-full"
          />
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
