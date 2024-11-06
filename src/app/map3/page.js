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


  const customIcon = L.icon({
    iconUrl: '/path/to/your/custom-icon.png', // Adjust the path as needed
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

// Fetch markers from a JSON file
fetch('/markers1.json') // Ensure this path is correct
    .then((response) => response.json())
    .then((data) => {
        data.forEach((marker) => {
            L.marker([marker.lat, marker.lng], { icon: customIcon })
                .addTo(map)
                .bindPopup(marker.popupText);
        });
    })
    .catch((error) => console.error('Error loading markers:', error));




  return (
    <div>
    <MapContainer
      whenReady={setMap}
      center={center}
      zoom={8}
      scrollWheelZoom={false}
      style={{ height: '100vh', width: '100%' }}
    >
      <TileLayer ref={tileRef} {...tileLayer} />
    </MapContainer>
    </div>
  );
};

export default MapWrapper;