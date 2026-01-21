


import React, { useMemo, useCallback } from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

const mapStyles = [
  { featureType: "poi.business", stylers: [{ visibility: "off" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ lightness: 10 }] },
  { featureType: "water", stylers: [{ color: "#e9f3f8" }] },
];

export default function MapPicker({ value, onChange }) {
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  const { isLoaded } = useLoadScript({ googleMapsApiKey: apiKey });

  const center = useMemo(
    () => ({
      lat: value?.lat ?? 25.2048,
      lng: value?.lng ?? 55.2708,
    }),
    [value?.lat, value?.lng]
  );

  const update = useCallback(
    (lat, lng) => onChange?.({ lat, lng }),
    [onChange]
  );

  if (!isLoaded) return <div>Loading map…</div>;

  return (
    <div
      style={{
        borderRadius: 20,
        overflow: "hidden",
        boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
      }}
    >
      <GoogleMap
        center={center}
        zoom={15}
        mapContainerStyle={{ height: 500, width: "100%" }}
        options={{
          disableDefaultUI: true,
          zoomControl: true,
          clickableIcons: true,
          gestureHandling: "greedy",
          mapTypeId: "roadmap",
          styles: mapStyles,
        }}
        onClick={(e) => update(e.latLng.lat(), e.latLng.lng())}
      >
        <Marker
          position={center}
          draggable
          onDragEnd={(e) => update(e.latLng.lat(), e.latLng.lng())}
        />
      </GoogleMap>
    </div>
  );
}
