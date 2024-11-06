"use client"
import { useRef, useState, useEffect } from "react";
import {  MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import tileLayer from "../../../util/tileLayer";
import '../../../public/leaflet.css'; // Ensure Leaflet CSS is imported
import '../../../public/css/leaflet.draw.css'



const center = [52.22977, 21.01178];


const points = [
  {
    lat: 52.230020586193795,
    lng: 21.01083755493164,
    title: 'point 1'
  },
  {
    lat: 52.22924516170657,
    lng: 21.011320352554325,
    title: 'point 2'
  },
  {
    lat: 52.229511304688444,
    lng: 21.01270973682404,
    title: 'point 3'
  },
  {
    lat: 52.23040500771883,
    lng: 21.012146472930908,
    title: 'point 4'
  },
];


// -------------------------------------------

// The best way to add the following code to your style

// .leaflet-tile-container {
//   filter: grayscale(1)
// }

// Or -----------------------------------------

const MapWrapper = () => {
  const [map, setMap] = useState(null);
  const tileRef = useRef(null);

  useEffect(() => {
    
    if (!map) return;
    tileRef.current.getContainer().style.setProperty("filter", `grayscale(1)`);
  }, [map]);
  if (typeof window !== 'undefined') {
            
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
    </MapContainer>
    </div>
  );
}};

export default MapWrapper;