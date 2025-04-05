"use client";

import { useEffect, useRef } from "react";
import { useGameStore, GameState } from "../store/gameStore";

const GameVisual = () => {
  const gameState5 = useGameStore((gameState5: GameState) => gameState5);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
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
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let t = 0;
    let transitionIndex = 0;

    let currentCP1 = { x: 20, y: 20 };
    let currentCP2 = { x: 200, y: 200 };
    let targetCP1 = controlPoints[0].cp1;
    let targetCP2 = controlPoints[0].cp2;

    function animate() {
      if (!canvas || !ctx) return;

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

      t += 0.01; // Speed of the animation

      if (t <= 1) {
        curveAnimationRef.current = requestAnimationFrame(animate);
      } else {
        // Move to next transition
        transitionIndex = (transitionIndex + 1) % controlPoints.length; // Loop forever
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
        </div>
      )}
    </div>
  );
};

export default GameVisual;
