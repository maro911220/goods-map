import { useEffect, useRef, useCallback, useState } from "react";
import {
  Marker,
  KakaoMap,
  KakaoCustomOverlay,
  KakaoCustomOverlayOptions,
  UseKakaoMapProps,
  UseKakaoMapReturn,
} from "@/types/kakao.maps";
import { debounce } from "@/utils/debounce";
import markersData from "@/data/markers.json";

// 카카오맵 설정
const MAP_CONFIG = {
  CENTER: { lat: 37.555, lng: 126.92501 },
  INITIAL_LEVEL: 3,
  MIN_LEVEL: 1,
  MAX_LEVEL: 4,
  DRAGGABLE: true,
};

export const useKakaoMap = ({
  containerRef,
  selectedMarker,
}: UseKakaoMapProps): UseKakaoMapReturn => {
  const mapRef = useRef<KakaoMap | null>(null);
  const overlaysRef = useRef<KakaoCustomOverlay[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<Marker | null>(null);

  // JSON 파일에서 마커 데이터 로드
  const markers = markersData as Marker[];

  // 마커 관련 함수
  const openModal = useCallback((place: Marker) => {
    setModalContent(place);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setModalContent(null);
  }, []);

  // 커스텀 마커
  const createOverlayElement = useCallback(
    (title: string, onClick: () => void): HTMLElement => {
      const element = document.createElement("div");
      element.classList.value =
        "px-1.5 py-1 bg-rose-500 text-white rounded font-bold text-xs shadow-lg whitespace-nowrap border-2 border-white cursor-pointer ";
      element.textContent = title;
      element.onclick = onClick;
      return element;
    },
    []
  );

  // 마커 생성 및 지도에 추가
  const createMarkers = useCallback(
    (map: KakaoMap) => {
      const { kakao } = window;
      if (!kakao?.maps) return;

      // 기존 오버레이 제거 (중복 방지)
      overlaysRef.current.forEach((overlay) => overlay.setMap(null));
      overlaysRef.current = [];

      markers.forEach((marker) => {
        const position = new kakao.maps.LatLng(marker.lat, marker.lng);
        const content = createOverlayElement(marker.title, () =>
          openModal(marker)
        );

        const overlayOptions: KakaoCustomOverlayOptions = {
          position,
          content,
        };

        const overlay = new kakao.maps.CustomOverlay(overlayOptions);
        overlay.setMap(map);
        overlaysRef.current.push(overlay);
      });
    },
    [markers, createOverlayElement, openModal]
  );

  // 지도 초기화
  useEffect(() => {
    if (!window.kakao?.maps) {
      console.error("Kakao Maps SDK is not loaded");
      return;
    }

    window.kakao.maps.load(() => {
      const container = containerRef.current;
      if (!container) return;

      const { kakao } = window;
      if (!kakao?.maps) return;

      const centerPosition = new kakao.maps.LatLng(
        MAP_CONFIG.CENTER.lat,
        MAP_CONFIG.CENTER.lng
      );

      const map = new kakao.maps.Map(container, {
        center: centerPosition,
        level: MAP_CONFIG.INITIAL_LEVEL,
        draggable: MAP_CONFIG.DRAGGABLE,
      });

      map.setMinLevel(MAP_CONFIG.MIN_LEVEL);
      map.setMaxLevel(MAP_CONFIG.MAX_LEVEL);

      mapRef.current = map;
      createMarkers(map);
    });

    return () => {
      // 컴포넌트 언마운트 시 오버레이 정리
      overlaysRef.current.forEach((overlay) => overlay.setMap(null));
      overlaysRef.current = [];
    };
  }, [containerRef, createMarkers]);

  // 선택된 마커로 지도 이동
  useEffect(() => {
    if (!mapRef.current || !selectedMarker) return;

    const { kakao } = window;
    if (!kakao?.maps) return;

    const position = new kakao.maps.LatLng(
      selectedMarker.lat,
      selectedMarker.lng
    );
    mapRef.current.panTo(position);
  }, [selectedMarker]);

  // 지도 컨테이너 리사이즈 처리
  useEffect(() => {
    const map = mapRef.current;
    const container = containerRef.current;
    if (!map || !container) return;

    const handleResize = debounce(() => {
      map.relayout();
      map.setCenter(map.getCenter());
    }, 100);

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, [containerRef]);

  return { isModalOpen, modalContent, closeModal };
};
