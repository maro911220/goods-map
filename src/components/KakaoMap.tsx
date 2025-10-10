"use client";
import { useRef } from "react";
import { useKakaoMap } from "@/hooks/useKakaoMap";
import PlaceModal from "@/components/PlaceModal";
import { Marker } from "@/types/kakao.maps";

interface KakaoMapProps {
  selectedMarker: Marker | null;
}

const KakaoMap = ({ selectedMarker }: KakaoMapProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { isModalOpen, modalContent, closeModal } = useKakaoMap({
    containerRef,
    selectedMarker,
  });

  return (
    <section className="w-full h-full">
      <h2 className="hidden">지도 영역</h2>
      <div
        id="map"
        ref={containerRef}
        aria-label="Kakao 지도"
        className="w-full h-full"
      />
      <PlaceModal
        isModalOpen={isModalOpen}
        modalContent={modalContent}
        closeModal={closeModal}
      />
    </section>
  );
};

export default KakaoMap;
