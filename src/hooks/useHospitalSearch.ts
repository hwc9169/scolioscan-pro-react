import { useState } from 'react';
import type { Hospital, KakaoSearchResponse } from '../types/hospital';

/**
 * 병원 검색을 위한 커스텀 훅
 */
export function useHospitalSearch() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Kakao Local API를 사용한 병원 검색
  const searchHospitals = async (query: string, lat?: number, lng?: number) => {
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const REST_API_KEY = 'YOUR_KAKAO_REST_API_KEY';
      let url = `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(query + ' 병원')}&category_group_code=HP8`;
      
      if (lat && lng) {
        url += `&x=${lng}&y=${lat}&radius=3000&sort=distance`;
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `KakaoAK ${REST_API_KEY}`,
        },
      });

      if (!response.ok) {
        throw new Error('검색 실패');
      }

      const data: KakaoSearchResponse = await response.json();
      
      const hospitalList: Hospital[] = data.documents.map((place) => ({
        id: place.id,
        name: place.place_name,
        category: place.category_name.split('>').pop()?.trim() || '병원',
        phone: place.phone || '전화번호 없음',
        address: place.address_name,
        roadAddress: place.road_address_name || place.address_name,
        x: place.x,
        y: place.y,
        distance: place.distance,
        placeUrl: place.place_url,
      }));

      setHospitals(hospitalList);
    } catch (err) {
      setError(err instanceof Error ? err.message : '검색 중 오류가 발생했습니다');
      setHospitals([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 주변 병원 검색 (현재 위치 기준)
  const searchNearbyHospitals = async (lat: number, lng: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const REST_API_KEY = 'YOUR_KAKAO_REST_API_KEY';
      const url = `https://dapi.kakao.com/v2/local/search/category.json?category_group_code=HP8&x=${lng}&y=${lat}&radius=3000&sort=distance`;

      const response = await fetch(url, {
        headers: {
          Authorization: `KakaoAK ${REST_API_KEY}`,
        },
      });

      if (!response.ok) {
        throw new Error('주변 병원 검색 실패');
      }

      const data: KakaoSearchResponse = await response.json();
      
      const hospitalList: Hospital[] = data.documents.map((place) => ({
        id: place.id,
        name: place.place_name,
        category: place.category_name.split('>').pop()?.trim() || '병원',
        phone: place.phone || '전화번호 없음',
        address: place.address_name,
        roadAddress: place.road_address_name || place.address_name,
        x: place.x,
        y: place.y,
        distance: place.distance,
        placeUrl: place.place_url,
      }));

      setHospitals(hospitalList);
    } catch (err) {
      setError(err instanceof Error ? err.message : '주변 병원 검색 중 오류가 발생했습니다');
      setHospitals([]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    hospitals,
    isLoading,
    error,
    searchHospitals,
    searchNearbyHospitals,
  };
}

