"use client"
import { useRef, useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import tileLayer from "../../../util/tileLayer";
import '../../../public/leaflet.css';
import '../../../public/css/leaflet.draw.css';

const center = [52.22977, 21.01178];

const MyMarkers = ({ data }) => {
  return data.map(({ lat, lng, title }, index) => (
    <Marker key={index} position={{ lat, lng }}>
      <Popup>{title}</Popup>
    </Marker>
  ));
};

const MapWrapper = () => {
  const [map, setMap] = useState(null);
  const [points, setPoints] = useState([]); // State to hold points from JSON
  const tileRef = useRef(null);

  useEffect(() => {
    // Fetch data from an external JSON file

    if (typeof window !== 'undefined') { // Check if running in the browser
    
  
    async function fetchPoints() {
      try {
        const res = await fetch('data.json');
        const data = await res.json();
        setPoints(data); // Set points from JSON data
      } catch (error) {
        console.error("Failed to load points:", error);
      }
    }

    fetchPoints();
  }
  }, []); // Run only once on mount

  useEffect(() => {
    if (!map) return;
    tileRef.current.getContainer().style.setProperty("filter", `grayscale(1)`);
  }, [map]);

  if (typeof window === 'undefined') return null;

  return (
    <div>
      <MapContainer
        whenReady={setMap}
        center={center}
        zoom={18}
        scrollWheelZoom={false}
        style={{ height: '100vh', width: '100%' }}
      >
        <TileLayer ref={tileRef} {...tileLayer} /> 
        <MyMarkers data={points} />
      </MapContainer>
    </div>
  );
};

export default MapWrapper;