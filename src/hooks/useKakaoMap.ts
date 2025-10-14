import { useEffect, useRef, useCallback, useState } from "react";
import {
  Marker,
  KakaoMap,
  KakaoCustomOverlay,
  UseKakaoMapProps,
  UseKakaoMapReturn,
} from "@/types/kakao.maps";
import { debounce } from "@/utils/debounce";

// 카카오맵 설정
const MAP_CONFIG = {
  CENTER: { lat: 37.555, lng: 126.92501 },
  INITIAL_LEVEL: 3,
  MIN_LEVEL: 1,
  MAX_LEVEL: 6,
  DRAGGABLE: true,
  CLUSTER_LEVEL: 4,
};

export const useKakaoMap = ({
  containerRef,
  selectedMarker,
  filteredMarkers,
}: UseKakaoMapProps): UseKakaoMapReturn => {
  const mapRef = useRef<KakaoMap | null>(null);
  const overlaysRef = useRef<KakaoCustomOverlay[]>([]);
  const clustererRef = useRef<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<Marker | null>(null);
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // API에서 데이터 가져오기
  useEffect(() => {
    const fetchMarkers = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch("https://maroapi.vercel.app/api/goods");

        if (!response.ok) {
          throw new Error(`Failed to fetch markers: ${response.status}`);
        }

        const data = await response.json();
        setMarkers(data);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load markers";
        setError(errorMessage);
        console.error("Error fetching markers:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMarkers();
  }, []);

  // 마커 모달 오픈 및 클로즈 핸들러
  const openModal = useCallback((place: Marker) => {
    setModalContent(place);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setModalContent(null);
  }, []);

  // 커스텀 마커 이미지 생성
  const createCustomMarkerImage = useCallback((title: string) => {
    const { kakao } = window;
    if (!kakao?.maps) return null;

    // SVG로 커스텀 마커 생성
    const width = title.length * 8 + 36;
    const svgContent = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="30">
        <rect x="2" y="2" width="${width - 4}" height="26" 
              fill="#f43f5e" stroke="white" stroke-width="2" rx="4"/>
        <text x="${width / 2}" y="20" 
              font-family="Arial" font-size="12" font-weight="bold" 
              fill="white" text-anchor="middle">${title}</text>
      </svg>
    `;

    const svgBlob = new Blob([svgContent], { type: "image/svg+xml" });
    const url = URL.createObjectURL(svgBlob);

    const imageSize = new kakao.maps.Size(width, 30);
    const imageOption = {
      offset: new kakao.maps.Point(width / 2, 15),
    };

    return new kakao.maps.MarkerImage(url, imageSize, imageOption);
  }, []);

  // 마커 생성 및 지도에 추가
  const createMarkers = useCallback(
    (map: KakaoMap) => {
      const { kakao } = window;
      if (!kakao?.maps) return;

      // 기존 클러스터러 제거
      if (clustererRef.current) {
        clustererRef.current.clear();
      }

      // 기존 오버레이 제거
      overlaysRef.current.forEach((overlay) => overlay.setMap(null));
      overlaysRef.current = [];

      // 필터링된 마커가 있으면 사용, 없으면 전체 마커 사용
      const markersToDisplay =
        filteredMarkers && filteredMarkers.length > 0
          ? filteredMarkers
          : markers;

      // 카카오 마커 객체 생성
      const kakaoMarkers = markersToDisplay.map((marker) => {
        const position = new kakao.maps.LatLng(marker.lat, marker.lng);
        const markerImage = createCustomMarkerImage(marker.title);

        const markerOptions: any = {
          position,
          clickable: true,
        };

        if (markerImage) {
          markerOptions.image = markerImage;
        }

        const kakaoMarker = new kakao.maps.Marker(markerOptions);
        // 마커 클릭 이벤트
        kakao.maps.event.addListener(kakaoMarker, "click", () => {
          openModal(marker);
        });

        return kakaoMarker;
      });

      // 클러스터러 생성
      if (!clustererRef.current) {
        clustererRef.current = new kakao.maps.MarkerClusterer({
          map: map,
          minLevel: MAP_CONFIG.CLUSTER_LEVEL,
          averageCenter: true,
          disableClickZoom: false,
          styles: [
            {
              color: "#fff",
              width: "60px",
              height: "60px",
              display: "flex",
              fontSize: "16px",
              fontWeight: "bold",
              textAlign: "center",
              borderRadius: "30px",
              alignItems: "center",
              justifyContent: "center",
              border: "3px solid white",
              background: "rgba(244, 63, 94, 0.8)",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            },
          ],
        });
      }

      clustererRef.current.addMarkers(kakaoMarkers);
    },
    [markers, filteredMarkers, createCustomMarkerImage, openModal]
  );

  // 지도 초기화
  useEffect(() => {
    if (!window.kakao?.maps) {
      console.error("Kakao Maps SDK is not loaded");
      return;
    }

    // 마커 데이터가 로드될 때까지 대기
    if (isLoading || markers.length === 0) return;

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
      if (clustererRef.current) {
        clustererRef.current.clear();
      }
      overlaysRef.current.forEach((overlay) => overlay.setMap(null));
      overlaysRef.current = [];
    };
  }, [containerRef, isLoading, markers.length]);

  // 필터링으로 인한 지도 업데이트
  useEffect(() => {
    const map = mapRef.current;
    if (!map || markers.length === 0) return;

    createMarkers(map);
  }, [filteredMarkers, markers, openModal]);

  // 리스트 선택 시 지도 이동
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

  return {
    isModalOpen,
    modalContent,
    closeModal,
    isLoading,
    error,
    markers,
  };
};
