// components/MapComponent.tsx
"use client"
import React, { useEffect } from 'react';
import L from 'leaflet';
import '../../../public/leaflet.css'; // Ensure Leaflet CSS is imported


// Import the grayscale tile layer script
import '../../../public/TileLayer.Grayscale'; // Adjust the path as necessary

const MapComponent: React.FC = () => {
    useEffect(() => {
        // Check if the window object is available
        if (typeof window !== 'undefined') {
            const map = L.map('map', { fadeAnimation: false }).setView([25, -4], 3);
            
            // Use the grayscale tile layer
            L.tileLayer.grayscale('http://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: 'Map data &copy; <a href="http://openstreetmap.org/">OpenStreetMap</a> contributors',
                maxZoom: 14,
                minZoom: 2,
            }).addTo(map);

            // Define a custom icon
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
                    data.forEach((marker: { lat: number; lng: number; popupText: string }) => {
                        L.marker([marker.lat, marker.lng], { icon: customIcon })
                            .addTo(map)
                            .bindPopup(marker.popupText);
                    });
                })
                .catch((error) => console.error('Error loading markers:', error));

            // Cleanup on unmount
            return () => {
                map.remove();
            };
        }
    }, []);

    return <div id="map" style={{ height: '100vh', width: '100%' }} />;
};

export default MapComponent;