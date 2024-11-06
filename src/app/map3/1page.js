"use client"
import { useRef, useState, useEffect } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import tileLayer from "../../../util/tileLayer";
import '../../../public/leaflet.css'; // Ensure Leaflet CSS is imported
import '../../../public/css/leaflet.draw.css'



const center = [52.22977, 21.01178];

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

  return (
    <div>
    <MapContainer
      whenReady={setMap}
      center={center}
      zoom={18}
      scrollWheelZoom={false}
    >
      <TileLayer ref={tileRef} {...tileLayer} />
    </MapContainer>
    </div>
  );
};

export default MapWrapper;