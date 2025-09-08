"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

// Assuming controlPoints is defined elsewhere with this structure
interface ControlPoint {
  cp1: { x: number; y: number };
  cp2: { x: number; y: number };
  pointB: { x: number; y: number };
}

const controlPoints: ControlPoint[] = [
  // Example structure, replace with your actual controlPoints
  { cp1: { x: 0, y: 100 }, cp2: { x: 100, y: 50 }, pointB: { x: 200, y: 0 } },
  // Add more control points as needed
];

const startx = -50;
const starty = 170;

interface GameVisualProps {
  currentMultiplier: number;
  onCashout: (multiplier: number) => void;
  dude55: boolean;
  dude56: string;
  betAmount: string;
  Gametimeremaining: number;
  GameStatus: string;
  tValues: {
    number: number;
    color: string;
    svg: string;
  }[];
}

const GameVisual: React.FC<GameVisualProps> = ({
  Gametimeremaining,
  GameStatus,
  currentMultiplier,
  dude55,
  dude56,
  betAmount,
  tValues,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fishRef = useRef<HTMLDivElement | null>(null);
  const curveAnimationRef = useRef<number>(0);
  const pointBRef = useRef<{ x: number; y: number }>({ x: startx, y: starty });
  const [previousTimeRemaining, setPreviousTimeRemaining] = useState<number | null>(null);
  const [redDotPosition, setRedDotPosition] = useState<{ x: number; y: number } | null>(null);
  const tValuesRef = useRef(tValues);
  const dude55Ref = useRef(dude55);

  useEffect(() => {
    tValuesRef.current = tValues;
    dude55Ref.current = dude55;
  }, [tValues, dude55]);

  useEffect(() => {
    if (!isNaN(Gametimeremaining)) {
      setPreviousTimeRemaining(Gametimeremaining);
    }
  }, [Gametimeremaining]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const fish = fishRef.current;
    if (!canvas || !fish) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let t = 0;
    let transitionIndex = 0;
    let logged = false;

    let currentCP1 = { x: startx, y: starty };
    let currentCP2 = { x: startx, y: starty };
    let currentPointB = { x: startx, y: starty };
    let targetCP1 = controlPoints[0].cp1;
    let targetCP2 = controlPoints[0].cp2;
    let targetPointB = controlPoints[0].pointB;

    function getBezierPoint(t: number, p0: { x: number; y: number }, p1: { x: number; y: number }, p2: { x: number; y: number }, p3: { x: number; y: number }) {
      const u = 1 - t;
      const tt = t * t;
      const uu = u * u;
      const uuu = uu * u;
      const ttt = tt * t;

      const x = uuu * p0.x + 3 * uu * t * p1.x + 3 * u * tt * p2.x + ttt * p3.x;
      const y = uuu * p0.y + 3 * uu * t * p1.y + 3 * u * tt * p2.y + ttt * p3.y;
      return { x, y };
    }

    const fish1 = new window.Image();
    fish1.src = "/images/chippy.svg";

    function animate() {
      if (!canvas || !ctx || !fish1.complete) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.moveTo(startx, starty);

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

      tValuesRef.current.forEach((dotT) => {
        const { x, y } = getBezierPoint(
          dotT.number,
          { x: startx, y: starty },
          { x: cp1x, y: cp1y },
          { x: cp2x, y: cp2y },
          { x: pointBx, y: pointBy }
        );

        const img = new window.Image();
        img.src = dotT.svg;
        img.onload = () => {
          ctx.drawImage(img, x - 8, y - 8, 20, 20);
        };

        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = dotT.color;
        ctx.fill();
      });

      ctx.save();
      ctx.translate(pointBx, pointBy);
      ctx.drawImage(fish1, -25, -25, 50, 50);
      ctx.restore();

      pointBRef.current = { x: pointBx, y: pointBy };

      if (dude55Ref.current && !logged) {
        setRedDotPosition({
          x: pointBx - currentMultiplier * 10,
          y: pointBy + currentMultiplier * 5,
        });
        console.log("Recording t because dude55 is true:", t.toFixed(4));
        logged = true;
      }

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

    fish1.onload = () => {
      if (GameStatus === "Running") {
        curveAnimationRef.current = requestAnimationFrame(animate);
      }
    };

    return () => {
      if (curveAnimationRef.current) {
        cancelAnimationFrame(curveAnimationRef.current);
      }
    };
  }, [GameStatus]);

  return (
    <div className="relative h-64 bg-gray-900 rounded-lg overflow-hidden mb-4">
      <Image
        src="/images/123.png"
        alt="Background image"
        fill
        className="relative rounded-lg overflow-hidden"
      />
      {GameStatus !== "Waiting" && GameStatus !== "Crashed" && (
        <div className="absolute inset-0">
          <canvas
            ref={canvasRef}
            width={400}
            height={200}
            className="w-full h-full"
          />
          {GameStatus === "Running" && (
            <>
              <span
                style={{
                  top: "100px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  display: "block",
                  position: "absolute",
                  color:
                    currentMultiplier > 5
                      ? "red"
                      : currentMultiplier > 2
                      ? "yellow"
                      : "white",
                  fontSize: "2rem",
                }}
              >
                {currentMultiplier}x
              </span>
              {dude55 && redDotPosition && (
                <div
                  className="absolute w-4 h-4 bg-red-500 rounded-full"
                  style={{
                    left: redDotPosition.x,
                    top: redDotPosition.y,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  {dude56} and your bet amount {betAmount}
                </div>
              )}
            </>
          )}
          <div style={{ display: "none" }} ref={fishRef} className="absolute w-6 h-6">
            <Image
              src="/images/chippy.svg"
              alt="End Fish"
              width={24}
              height={24}
              className="absolute w-6 h-6"
              style={{
                transform: `translate(${pointBRef.current.x - 12}px, ${pointBRef.current.y - 12}px)`,
                marginTop: `-150px`,
              }}
            />
          </div>
        </div>
      )}
      {GameStatus === "Crashed" && (
        <>
          <span
            style={{
              left: "50%",
              transform: "translateX(-50%)",
              display: "block",
              position: "absolute",
            }}
          >
            <Image
              width={275}
              height={275}
              src="/explode1.svg"
              alt="Explosion effect"
            />
          </span>
          <span
            style={{
              top: "100px",
              left: "50%",
              transform: "translateX(-50%)",
              display: "block",
              position: "absolute",
              color:
                currentMultiplier > 5
                  ? "red"
                  : currentMultiplier > 2
                  ? "yellow"
                  : "white",
              fontSize: "2rem",
            }}
          >
            {currentMultiplier}x
          </span>
        </>
      )}
      {GameStatus === "Waiting" && (
        <span
          style={{
            top: "100px",
            left: "50%",
            transform: "translateX(-50%)",
            display: "block",
            position: "absolute",
            color: "white",
            fontSize: "2rem",
            width: "100%",
            textAlign: "center",
          }}
        >
          Launch in{" "}
          {typeof Gametimeremaining === "number" && !isNaN(Gametimeremaining) ? (
            <>
              {Gametimeremaining} {Gametimeremaining > 1 ? "secs" : "sec"}
            </>
          ) : (
            <>
              {previousTimeRemaining}{" "}
              {previousTimeRemaining != null && previousTimeRemaining > 1 ? "secs" : "sec"}
            </>
          )}
        </span>
      )}
    </div>
  );
};

export default GameVisual;