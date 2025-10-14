import { RefObject } from "react";

// Kakao Maps 기본 타입
export interface KakaoLatLng {
  getLat(): number;
  getLng(): number;
}

export interface KakaoMapOptions {
  center: KakaoLatLng;
  level: number;
  draggable: boolean;
}

export interface KakaoMap {
  setCenter(latlng: KakaoLatLng): void;
  getCenter(): KakaoLatLng;
  setLevel(level: number): void;
  getLevel(): number;
  setMinLevel(level: number): void;
  setMaxLevel(level: number): void;
  relayout(): void;
  panTo(latlng: KakaoLatLng): void;
}

// Kakao Maps 오버레이(마커) 타입
export interface KakaoCustomOverlayOptions {
  position: KakaoLatLng;
  content: HTMLElement | string;
  yAnchor?: number;
  zIndex?: number;
}

export interface KakaoCustomOverlay {
  setMap(map: KakaoMap | null): void;
}

export interface Marker {
  id?: number;
  title: string;
  address: string;
  lat: number;
  lng: number;
  description: string;
  link: string;
  sns?: string | null;
  category: string[];
}

// Kakao Maps Geocoding 타입
export interface KakaoAddress {
  address_name: string;
  x: string; // 경도 (Longitude)
  y: string; // 위도 (Latitude)
}

export interface KakaoGeocoder {
  addressSearch(
    address: string,
    callback: (result: KakaoAddress[], status: string) => void
  ): void;
}

export interface KakaoGeocoderStatus {
  OK: string;
  ZERO_RESULT: string;
  ERROR: string;
}

// Kakao Maps SDK

export interface KakaoMapsNamespace {
  Marker: new (options: {
    position: KakaoLatLng;
    image?: {
      url: string;
      imageSize: KakaoSize;
      imageOption?: { offset: KakaoPoint };
    };
    clickable?: boolean;
  }) => void;
  MarkerClusterer: new (options: {
    map: KakaoMap;
    averageCenter?: boolean;
    minLevel?: number;
    disableClickZoom?: boolean;
    styles?: Array<{
      width: string;
      height: string;
      background: string;
      borderRadius?: string;
      color?: string;
      textAlign?: string;
      fontWeight?: string;
      lineHeight?: string;
      fontSize?: string;
      border?: string;
      boxShadow?: string;
      display?: string;
      justifyContent?: string;
      alignItems?: string;
    }>;
  }) => {
    addMarkers: (markers: []) => void;
    clear: () => void;
  };

  MarkerImage: new (
    url: string,
    imageSize: KakaoSize,
    imageOption?: { offset: KakaoPoint }
  ) => {
    url: string;
    imageSize: KakaoSize;
    imageOption?: { offset: KakaoPoint };
  };
  Point: new (x: number, y: number) => KakaoPoint;
  Size: new (width: number, height: number) => KakaoSize;
  LatLng: new (lat: number, lng: number) => KakaoLatLng;
  Map: new (container: HTMLElement, options: KakaoMapOptions) => KakaoMap;
  CustomOverlay: new (options: KakaoCustomOverlayOptions) => KakaoCustomOverlay;
  services: {
    Geocoder: new () => KakaoGeocoder;
    Status: KakaoGeocoderStatus;
  };
  event: {
    addListener: (target: unknown, type: string, callback: () => void) => void;
    removeListener: (
      target: unknown,
      type: string,
      callback: () => void
    ) => void;
  };
  load(callback: () => void): void;
}

// 추가 인터페이스
export interface KakaoPoint {
  x: number;
  y: number;
}

export interface KakaoSize {
  width: number;
  height: number;
}

// Hook 타입
export interface UseKakaoMapProps {
  containerRef: RefObject<HTMLDivElement | null>;
  selectedMarker: Marker | null;
  filteredMarkers: Marker[];
}

export interface UseKakaoMapReturn {
  isModalOpen: boolean;
  modalContent: Marker | null;
  closeModal: () => void;
  isLoading: boolean;
  error: string | null;
  markers: Marker[];
}

// Global 타입 확장
declare global {
  interface Window {
    kakao?: {
      maps: KakaoMapsNamespace;
    };
  }
}
