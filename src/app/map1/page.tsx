// pages/index.tsx
import React from 'react';
import MapComponent from '../components/page';

const Home: React.FC = () => {
    return (
        <div>
            <h1>My Leaflet Map with Grayscale Tiles</h1>
            <MapComponent />
        </div>
    );
};

export default Home;