"use client";
import { useEffect, useRef } from "react";
import Two from "two.js";

export default function CrashGraph() {
  const mountRef = useRef(null);

  useEffect(() => {
    // Ensure mountRef is defined and not null
    if (mountRef.current) {
      // Two.js Setup
      const params = { width: window.innerWidth, height: window.innerHeight };
      const two = new Two(params).appendTo(mountRef.current);

      // Graph Variables
      let t = 0; // Time step
      const speed = 0.05; // Growth speed
      const maxTime = 5; // Max time limit
      const crashTime = Math.random() * (maxTime - 1.5) + 1.5; // Random crash point
      const scaleX = 100; // Scale factor for x-axis
      const scaleY = 50; // Scale factor for y-axis
      let crashed = false;

      // Create Path for Curve
      const points: Two.Vector[] = [];
      const path = new Two.Path(points, false, false);
      path.stroke = "red";
      path.linewidth = 3;
      path.noFill();
      two.add(path);

      // Create Multiplier Label
      const label = new Two.Text("1.00x", 100, two.height - 50);
      label.fill = "white";
      label.size = 20;
      two.add(label);

      // Crash Explosion Effect
      const explosion = new Two.Circle(0, 0, 10);
      explosion.fill = "orange";
      explosion.noStroke();
      explosion.visible = false;
      two.add(explosion);

      // Animation Loop
      function animate() {
        if (crashed) return;

        t += speed;
        if (t >= crashTime) {
          crashed = true;
          explosion.translation.set(points[points.length - 1].x, points[points.length - 1].y);
          explosion.visible = true;
          explosion.scale = 1.5;
          two.update();
          return;
        }

        // Add new point following y = exp(t / 2) curve
        const x = t * scaleX;
        const y = two.height - Math.exp(t / 2) * scaleY; // Inverted Y-axis for Two.js

        points.push(new Two.Anchor(x, y));
        path.vertices = points;

        // Update multiplier label
        label.value = `${(Math.exp(t / 2)).toFixed(2)}x`;
        label.translation.set(x + 20, y - 10);

        two.update();
        requestAnimationFrame(animate);
      }

      animate();

      // Cleanup on unmount
      return () => {
        two.clear();
      };
    } else {
      console.error('mountRef.current is null. Ensure the ref is attached to a valid DOM element.');
    }
  }, []);

  return <div ref={mountRef} className="w-full h-screen bg-black" />;
}