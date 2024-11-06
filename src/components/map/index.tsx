// src/components/map/index.tsx

"use client"

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { LatLngExpression, LatLngTuple } from 'leaflet';
import markerData from '../../../public/markers.json';

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

interface MapProps {
    posix: LatLngExpression | LatLngTuple,
    zoom?: number,
}

const defaults = {
    zoom: 5,
}

const Map = (Map: MapProps) => {
    const { zoom = defaults.zoom, posix } = Map

    return (
        <MapContainer
            center={posix}
            zoom={zoom}
            scrollWheelZoom={false}
            style={{ height: "100%", width: "100%" }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
               {markerData.map((marker, index) => {
                   const position: LatLngTuple = Array.isArray(marker.position) && marker.position.length === 2
                       ? marker.position as LatLngTuple
                       : [0, 0]; // Fallback to a default position if invalid
                   return (
                       <Marker
                           key={index}
                           position={position}
                           draggable={marker.draggable}
                       >
                           <Popup>{marker.popup}</Popup>
                       </Marker>
                   );
               })}
        </MapContainer>
    )
}

export default Map