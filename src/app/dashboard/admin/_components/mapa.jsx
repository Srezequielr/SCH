// components/MapaUbicacion.jsx
"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";

const Mapa = dynamic(
  () =>
    import("react-leaflet").then(async (mod) => {
      const L = await import("leaflet");
      const { MapContainer, TileLayer, Marker, Popup } = mod;

      const crearIconoPersonalizado = (color = "#DC2626") => {
        // SVG del marcador - completamente local
        const svgString = `
          <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.5 0C5.596 0 0 5.596 0 12.5C0 21.5 12.5 41 12.5 41C12.5 41 25 21.5 25 12.5C25 5.596 19.404 0 12.5 0Z" fill="${color}"/>
            <circle cx="12.5" cy="12.5" r="5" fill="white"/>
          </svg>
        `;

        const shadowSvgString = `
          <svg width="41" height="41" viewBox="0 0 41 41" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="20.5" cy="38.5" rx="18.5" ry="2.5" fill="#000000" opacity="0.25"/>
          </svg>
        `;

        return new L.Icon({
          iconUrl: `data:image/svg+xml;base64,${btoa(svgString)}`,
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowUrl: `data:image/svg+xml;base64,${btoa(shadowSvgString)}`,
          shadowSize: [41, 41],
          shadowAnchor: [12, 41],
        });
      };

      const iconoRojo = crearIconoPersonalizado("#000000"); 

      return function MapComponent({ lat, lng, altura, nombre }) {
        const [map, setMap] = useState(null);

        useEffect(() => {
          if (map) {
            setTimeout(() => map.invalidateSize(), 50);
          }
        }, [map]);

        return (
          <div
            style={{ height: altura }}
            className="overflow-hidden rounded-lg border border-gray-300"
          >
            <MapContainer
              center={[lat, lng]}
              zoom={15}
              style={{ height: "100%", width: "100%" }}
              ref={setMap}
            >
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                attribution="&copy; OpenStreetMap"
              />
              <Marker
                position={[lat, lng]}
                icon={iconoRojo}
              >
                <Popup>
                  <div className="min-w-[180px] text-center">
                    <div className="text-brown-main font-semibold">
                      📍 {nombre}
                    </div>
                    <div className="mt-2 text-sm text-gray-600">
                      <div>
                        Latitud: <strong>{Number(lat).toFixed(6)}</strong>
                      </div>
                      <div>
                        Longitud: <strong>{Number(lng).toFixed(6)}</strong>
                      </div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        );
      };
    }),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-64 animate-pulse items-center justify-center rounded-lg bg-gray-200">
        <span className="text-gray-500">Cargando mapa...</span>
      </div>
    ),
  },
);

export default function MapaUbicacion({ lat, lng, altura = "300px", nombre }) {
  return (
    <div>
      <h2 className="font-body my-2 text-center text-2xl">
        Ubicacion donde empezo la jornada
      </h2>
      <Mapa lat={lat} lng={lng} altura={altura} nombre={nombre} />;
    </div>
  );
}
