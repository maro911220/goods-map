"use client";
import { useState } from "react";
import KakaoMap from "@/components/KakaoMap";
import SearchPanel from "@/components/SearchPanel";
import { Marker } from "@/types/kakao.maps";

export default function Home() {
  const [selectedMarker, setSelectedMarker] = useState<Marker | null>(null);

  const handleMarkerClick = (marker: Marker) => {
    setSelectedMarker(marker);
  };

  return (
    <main className="main">
      <h1 className="hidden">홍대 굿즈샵 지도</h1>
      <SearchPanel
        onMarkerClick={handleMarkerClick}
        selectedMarker={selectedMarker}
      />
      <KakaoMap selectedMarker={selectedMarker} />
    </main>
  );
}
