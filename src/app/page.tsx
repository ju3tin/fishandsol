// tester1/src/app/page.tsx
"use client";
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

export default function Home() {
  const [showFirstDiv, setShowFirstDiv] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    // Play the video when the component mounts
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.error('Error playing video:', error);
      });
    }

    // Optional: Pause the video when the component unmounts
    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
      }
    };
  }, []);

  return (
    <div style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
      <video
        ref={videoRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: -1,
        }} 
        className="shadow-lg w-full h-auto" 
        src="/container07.mp4" // Path to the video file in the public folder
        autoPlay 
        loop 
        muted
        playsInline // Added for mobile compatibility
      >
        Your browser does not support the video tag.
      </video>
      <h1 className='text-3xl font-semibold' style={{ position: 'relative', zIndex: 1 }}>Home Page</h1>

      <div className="wrapper" style={{ width: '30%', margin: 'auto', position: 'relative', zIndex: 1 }}>
        <div className="inner">
          <div id="image05" className="image" style={{ opacity: '1', filter: 'none' }}>
            <span className="frame deferred" style={{}}>
              <Image src="/image05.png" width={100} height={100} data-src="done" alt="" style={{ width: '100%' }} />
            </span>
          </div>
          <div id="image07" className="image" style={{}}>
            <span className="frame deferred" style={{}}>
              <Image src="/image07.png" width={300} height={300} data-src="done" alt="" style={{}} />
            </span>
          </div>
          <ul id="buttons03" className="buttons" style={{}}>
            <li>
              <a onClick={() => setShowFirstDiv(!showFirstDiv)} href="#enter" className="button n01">ENTER SITE</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}