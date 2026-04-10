"use client";

import { useEffect, useRef, useState } from "react";
import { Place } from "@/types";
import BoardPanel from "./BoardPanel";

const CATEGORY_COLORS: Record<string, string> = {
  bar: "#e74c3c",
  club: "#9b59b6",
  cafe: "#e67e22",
  sauna: "#3498db",
  other: "#2ecc71",
};

declare global {
  interface Window {
    google: typeof google;
    initMap: () => void;
  }
}

export default function MapView() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [places, setPlaces] = useState<Place[]>([]);
  const [mapReady, setMapReady] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);

  useEffect(() => {
    fetch("/api/places")
      .then((r) => r.json())
      .then((data) => setPlaces(Array.isArray(data) ? data : []));
  }, []);

  // Google Maps 스크립트 로드
  useEffect(() => {
    if (document.getElementById("google-maps-script")) {
      if (window.google) setMapReady(true);
      return;
    }
    window.initMap = () => setMapReady(true);
    const script = document.createElement("script");
    script.id = "google-maps-script";
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&callback=initMap`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }, []);

  // 지도 초기화
  useEffect(() => {
    if (!mapReady || !mapRef.current) return;

    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat: 35.5, lng: 133 },
      zoom: 5,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      zoomControlOptions: {
        position: window.google.maps.ControlPosition.RIGHT_CENTER,
      },
    });
    mapInstance.current = map;

    // GPS 현위치 표시
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const userPos = { lat: pos.coords.latitude, lng: pos.coords.longitude };

          new window.google.maps.Marker({
            position: userPos,
            map,
            title: "내 위치",
            icon: {
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 10,
              fillColor: "#4285F4",
              fillOpacity: 1,
              strokeColor: "#fff",
              strokeWeight: 3,
            },
            zIndex: 999,
          });
        },
        () => {} // 거부해도 에러 없이 무시
      );
    }
  }, [mapReady]);

  // 장소 마커
  useEffect(() => {
    if (!mapInstance.current || places.length === 0 || !mapReady) return;

    places.forEach((place) => {
      if (!place.lat || !place.lng) return;
      const marker = new window.google.maps.Marker({
        position: { lat: place.lat, lng: place.lng },
        map: mapInstance.current!,
        title: place.name,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: CATEGORY_COLORS[place.category] ?? "#2ecc71",
          fillOpacity: 0.9,
          strokeColor: "#fff",
          strokeWeight: 2,
        },
      });

      marker.addListener("click", () => {
        setSelectedPlace(place);
        setPanelOpen(true);
      });
    });
  }, [places, mapReady]);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <div ref={mapRef} className="w-full h-full" />

      {/* 범례 - 모바일에서 작게 */}
      <div className="absolute top-3 left-3 bg-white rounded-lg shadow-lg p-2 md:p-3 text-xs md:text-sm z-10">
        <p className="font-bold mb-1 md:mb-2 text-gray-700">장소 유형</p>
        {Object.entries(CATEGORY_COLORS).map(([cat, color]) => (
          <div key={cat} className="flex items-center gap-1.5 mb-0.5 md:mb-1">
            <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
            <span className="text-gray-600 capitalize">{cat}</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5 mt-1 border-t pt-1">
          <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full flex-shrink-0 bg-[#4285F4] border-2 border-white shadow" />
          <span className="text-gray-600">내 위치</span>
        </div>
      </div>

      {/* 게시판 패널 - 모바일은 하단에서 올라옴, 데스크탑은 우측 */}
      {selectedPlace && (
        <BoardPanel
          place={selectedPlace}
          open={panelOpen}
          onClose={() => { setPanelOpen(false); setSelectedPlace(null); }}
        />
      )}
    </div>
  );
}
