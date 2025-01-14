// pages/index.tsx
import React from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the MapComponent with no SSR
const MapComponent = dynamic(() => import('../../components/map'), { ssr: false });

const Home: React.FC = () => {
    return (
        <div>
            <h1>My Leaflet Map with Grayscale Tiles</h1>
            <MapComponent />
        </div>
    );
};

export default Home;