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


const MyMarkers = ({ data }) => {
  return data.map(({ lat, lng, title }, index) => (
    <Marker
      key={index}
      position={{ lat, lng }}
    >
      <Popup>{title}</Popup>
    </Marker>
  ));
}

const MapWrapper = () => {
  const [map, setMap] = useState(null);
  const [points, setPoints] = useState([]); // State to hold the fetched points
  const tileRef = useRef(null);

  useEffect(() => {
    // Fetch external JSON data
    const fetchData = async () => {
      try {
        const response = await fetch('data.json'); // Replace with your JSON URL
        const data = await response.json();
        setPoints(data); // Assuming the JSON structure matches your points format
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []); // Empty dependency array to run once on mount

  useEffect(() => {
    if (!map || !tileRef.current) return;
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
          
          <MyMarkers data={points} /> {/* Use fetched points */}
        </MapContainer>
      </div>
    );
  }
};

export default MapWrapper;