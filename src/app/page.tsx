"use client";
import { useState, useRef, useEffect } from "react";
import KakaoMap from "@/components/KakaoMap";
import SearchPanel from "@/components/SearchPanel";
import CategoryFilter from "@/components/CategoryFilter";
import PlaceModal from "@/components/PlaceModal";
import { Marker } from "@/types/kakao.maps";
import { useKakaoMap } from "@/hooks/useKakaoMap";

export default function Home() {
  const [selectedMarker, setSelectedMarker] = useState<Marker | null>(null);
  const [filteredMarkers, setFilteredMarkers] = useState<Marker[]>([]);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // 데이터 가져오기
  const { markers, isLoading, error, isModalOpen, modalContent, closeModal } =
    useKakaoMap({
      containerRef: mapContainerRef,
      selectedMarker,
      filteredMarkers,
    });

  // 초기 표시 마커
  useEffect(() => {
    setFilteredMarkers(markers);
  }, [markers]);

  // 리스트 마커 클릭
  const handleMarkerClick = (marker: Marker) => {
    setSelectedMarker(marker);
  };

  // 필터 변경
  const handleFilterChange = (filtered: Marker[]) => {
    setFilteredMarkers(filtered);
  };

  // 로딩
  if (isLoading || !markers) {
    return (
      <main className="main log">
        <p>로딩 중...</p>
      </main>
    );
  }

  // 에러
  if (error) {
    return (
      <main className="main log">
        <p className="text-red-500">에러가 발생했습니다</p>
        <span>{error}</span>
      </main>
    );
  }

  return (
    <main className="main">
      <h1 className="hidden">홍대 굿즈샵 지도</h1>
      {/* 검색창 */}
      <SearchPanel
        markers={filteredMarkers}
        onMarkerClick={handleMarkerClick}
        selectedMarker={selectedMarker}
      />
      {/* 지도 & 필터 */}
      <section className="relative w-full h-full">
        <h2 className="hidden">카카오 지도</h2>
        <KakaoMap ref={mapContainerRef} />
        <CategoryFilter markers={markers} onFilterChange={handleFilterChange} />
      </section>
      {/* 모달 */}
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
