import React, { useRef, useEffect } from 'react';

const Visualization = () => {
  const [dots, setDots] = React.useState<{ createdAt: number }[]>([]);
  const TOTAL_SIMULATION_TIME = 10000; // 10 seconds

  useEffect(() => {
    let startTime = Date.now();
    const addDot = () => {
      setDots((prevDots) => [...prevDots, { createdAt: Date.now() }]);
    };

    const intervalId = setInterval(addDot, 2000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const startX = 50;
  const endX = 750;
  const startY = 200;

  const getYPosition = (x: number) => {
    return startY + Math.sin((x / 800) * 2 * Math.PI) * 50;
  };

  const renderLine = () => {
    let path = `M ${startX} ${getYPosition(startX)}`;
    for (let x = startX; x <= endX; x += 5) {
      path += ` L ${x} ${getYPosition(x)}`;
    }
    return path;
  };

  return (
    <svg width="800" height="400" style={{ border: '1px solid black' }}>
      <path d={renderLine()} stroke="#000" strokeWidth="2" fill="none" />
      {dots.map((dot, index) => {
        const elapsed = Date.now() - dot.createdAt;
        const percent = elapsed / TOTAL_SIMULATION_TIME;

        if (percent > 1) return null; // Ignore dots that finished

        const x = startX + (endX - startX) * percent;
        const y = getYPosition(x);

        return <circle key={index} cx={x} cy={y} r="5" fill="red" />;
      })}
    </svg>
  );
};

export default Visualization;
