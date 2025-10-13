"use client";
import { useState, useRef } from "react";
import KakaoMap from "@/components/KakaoMap";
import SearchPanel from "@/components/SearchPanel";
import { Marker } from "@/types/kakao.maps";
import { useKakaoMap } from "@/hooks/useKakaoMap";
import PlaceModal from "@/components/PlaceModal";

export default function Home() {
  const [selectedMarker, setSelectedMarker] = useState<Marker | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const { markers, isLoading, error, isModalOpen, modalContent, closeModal } =
    useKakaoMap({
      containerRef: mapContainerRef,
      selectedMarker,
    });

  const handleMarkerClick = (marker: Marker) => {
    setSelectedMarker(marker);
  };

  if (isLoading) {
    return (
      <main className="main flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-semibold">로딩 중...</div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="main flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-semibold text-red-500">
            에러가 발생했습니다
          </div>
          <div className="text-sm text-gray-600 mt-2">{error}</div>
        </div>
      </main>
    );
  }

  return (
    <main className="main">
      <h1 className="hidden">홍대 굿즈샵 지도</h1>
      <SearchPanel
        markers={markers}
        onMarkerClick={handleMarkerClick}
        selectedMarker={selectedMarker}
      />
      <KakaoMap ref={mapContainerRef} />
      {isModalOpen && modalContent && (
        <PlaceModal
          isModalOpen={isModalOpen}
          modalContent={modalContent}
          closeModal={closeModal}
        />
      )}
    </main>
  );
}
