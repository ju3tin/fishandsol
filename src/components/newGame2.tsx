"use client"
import React, { useEffect, useRef } from "react";

const CrashGameGraph: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  let startTime = Date.now();

  const degreesToRadians = (deg: number) => (deg * Math.PI) / 180;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const drawGraph = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let elapsedTime = (Date.now() - startTime) / 1000;
      let angle;
      if (elapsedTime <= 3) {
        angle = 10 + (5 / 3) * elapsedTime; // Linear increase from 10 to 15 degrees
      } else {
        let k = 0.02; // Adjust this value for curve intensity
        angle = 15 + k * Math.pow(elapsedTime - 3, 2); // Quadratic increase
      }
      
      let radians = degreesToRadians(angle);
      let x = 0;
      let y = canvas.height - 50;
      let velocityX = Math.cos(radians) * 5;
      let velocityY = -Math.sin(radians) * 5;

      ctx.beginPath();
      ctx.moveTo(x, y);
      
      for (let t = 0; x < canvas.width; t += 1) {
        if (elapsedTime > 3) {
          let k = 0.02;
          angle = 15 + k * Math.pow(elapsedTime - 3, 2);
          radians = degreesToRadians(angle);
          velocityX = Math.cos(radians) * 5;
          velocityY = -Math.sin(radians) * 5;
        } else {
          angle = 10 + (5 / 3) * elapsedTime;
          radians = degreesToRadians(angle);
          velocityX = Math.cos(radians) * 5;
          velocityY = -Math.sin(radians) * 5;
        }
        x += velocityX;
        y += velocityY;
        ctx.lineTo(x, y);
      }

      ctx.strokeStyle = "#ff0000";
      ctx.lineWidth = 2;
      ctx.stroke();
    };

    const animate = () => {
      drawGraph();
      requestAnimationFrame(animate);
    };

    animate();
  }, []);

  return <canvas ref={canvasRef} width={800} height={400} />;
};

export default CrashGameGraph;
