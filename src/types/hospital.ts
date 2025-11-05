/**
 * 병원 관련 타입 정의
 */

export interface Hospital {
  id: string;
  name: string;
  category: string;
  phone: string;
  address: string;
  roadAddress: string;
  x: string; // 경도 (longitude)
  y: string; // 위도 (latitude)
  distance?: string;
  placeUrl?: string;
  imageUrl?: string; // 병원 이미지
}

export interface KakaoPlace {
  id: string;
  place_name: string;
  category_name: string;
  phone: string;
  address_name: string;
  road_address_name: string;
  x: string;
  y: string;
  distance: string;
  place_url: string;
}

export interface KakaoSearchResponse {
  documents: KakaoPlace[];
  meta: {
    total_count: number;
    pageable_count: number;
    is_end: boolean;
  };
}

declare global {
  interface Window {
    kakao: any;
  }
}

