"use client"
import { useEffect, useRef } from 'react';
import Timeline from '@knight-lab/timelinejs';
import '@knight-lab/timelinejs/dist/css/timeline.css';

export default function Home() {
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (timelineRef.current) {
      const timelineData = {
        title: {
          text: {
            headline: "A Sample Timeline",
            text: "A demonstration of TimelineJS embedded in a Next.js page."
          }
        },
        events: [
          {
            start_date: { year: "2020", month: "1", day: "1" },
            text: {
              headline: "New Decade Begins",
              text: "The year 2020 marks the start of a new decade."
            }
          },
          {
            start_date: { year: "2021", month: "6", day: "15" },
            text: {
              headline: "Mid-Decade Marker",
              text: "A point somewhere in the middle of the 2020s."
            }
          }
        ]
      };

      new Timeline(timelineRef.current, timelineData);
    }
  }, []);

  return (
    <main className="flex flex-col items-center justify-center p-4 bg-black min-h-screen">
      <div ref={timelineRef} id="timeline-embed" style={{ width: '100%', height: '600px' }} />
    </main>
  );
}