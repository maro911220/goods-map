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

// Kakao Maps SDK 네임스페이스
export interface KakaoMapsNamespace {
  LatLng: new (lat: number, lng: number) => KakaoLatLng;
  Map: new (container: HTMLElement, options: KakaoMapOptions) => KakaoMap;
  CustomOverlay: new (options: KakaoCustomOverlayOptions) => KakaoCustomOverlay;
  services: {
    Geocoder: new () => KakaoGeocoder;
    Status: KakaoGeocoderStatus;
  };
  load(callback: () => void): void;
}

// Hook 타입
export interface UseKakaoMapProps {
  containerRef: RefObject<HTMLDivElement | null>;
  selectedMarker: Marker | null;
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
