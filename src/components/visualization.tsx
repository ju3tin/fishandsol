"use client";

import { useState, useEffect, useRef } from "react";
import { useGameStore, GameState } from "../store/gameStore";

const GameVisual = () => {
  const gameState5 = useGameStore((gameState5: GameState) => gameState5);

  // States
  const [pathProgress, setPathProgress] = useState(0);

  // Refs
  
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const curveAnimationRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let t = 0;
    let transitions = 0;
    const maxTransitions = 5;

    let currentCP1 = { x: 20, y: 20 };
    let currentCP2 = { x: 200, y: 200 };
    let targetCP1 = randomControlPoint();
    let targetCP2 = randomControlPoint();

    function randomControlPoint() {
      if (canvas) {
        return {
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
        };
      } else {
        return { x: 0, y: 0 };
      }
    }

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

      t += 0.01;

      if (t <= 1) {
        curveAnimationRef.current = requestAnimationFrame(animate);
      } else {
        transitions++;
        if (transitions < maxTransitions) {
          t = 0;
          currentCP1 = targetCP1;
          currentCP2 = targetCP2;
          targetCP1 = randomControlPoint();
          targetCP2 = randomControlPoint();
          curveAnimationRef.current = requestAnimationFrame(animate);
        }
      }
    }

    if (gameState5.status === "Running") {
      animate();
    } else {
      if (curveAnimationRef.current) {
        cancelAnimationFrame(curveAnimationRef.current);
      }
    }

    // Cleanup
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
      <div>Fuck you</div> {/* you can replace this 😅 */}
    </div>
  );
};

export default GameVisual;
