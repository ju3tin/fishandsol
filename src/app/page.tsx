"use client"
import { useState } from 'react';
export default function Home() {
  const [showFirstDiv, setShowFirstDiv] = useState(true);
  return (
    <div>
       <video 
        className="rounded-lg shadow-lg w-full h-auto" 
        src="container07.mp4" // Path to the video file in the public folder
        controls 
        autoPlay 
        loop 
        muted
      >
        Your browser does not support the video tag.
      </video>
      <h1 className='text-3xl font-semibold'>Home Page</h1>

      <div className="wrapper" style={{width:'30%', margin: 'auto'}}>
        <div className="inner">
          <div id="image05" className="image" style={{opacity: '1', filter: 'none'}}>
            <span className="frame deferred" style={{}}>
            <img src="image05.png" data-src="done" alt="" style={{}} />
            </span>
            </div>
            <div id="image07" className="image" style={{}}>
              <span className="frame deferred" style={{}}>
              <img src="image07.png?v=4d5dd3d7" data-src="done" alt="" style={{}} />
              </span></div>
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
