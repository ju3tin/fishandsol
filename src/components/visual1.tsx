import React, { useRef, useEffect } from 'react';

const Visualization = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dots = useRef<{ createdAt: number }[]>([]);
  const TOTAL_SIMULATION_TIME = 10000; // 10 seconds

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 400;

    let startTime = Date.now();
    let animationFrameId: number;

    const startX = 50;
    const endX = 750;
    const startY = 200;

    const getYPosition = (x: number) => {
      // Simulate a line or a curve
      return startY + Math.sin((x / 800) * 2 * Math.PI) * 50;
    };

    const addDot = () => {
      dots.current.push({ createdAt: Date.now() });
    };

    const render = () => {
      const now = Date.now();
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw main line
      ctx.beginPath();
      ctx.moveTo(startX, getYPosition(startX));
      for (let x = startX; x <= endX; x += 5) {
        ctx.lineTo(x, getYPosition(x));
      }
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw dots
      dots.current.forEach((dot) => {
        const elapsed = now - dot.createdAt;
        const percent = elapsed / TOTAL_SIMULATION_TIME;

        if (percent > 1) return; // Ignore dots that finished

        const x = startX + (endX - startX) * percent;
        const y = getYPosition(x);

        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = 'red';
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // Simulate betting every 2 seconds
    const intervalId = setInterval(addDot, 2000);

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div>
      <canvas ref={canvasRef} style={{ border: '1px solid black' }} />
    </div>
  );
};

export default Visualization;
