import { useEffect, useRef, useState } from 'react';
import type { Hospital } from '../types/hospital';

/**
 * Kakao Map을 사용하기 위한 커스텀 훅
 */
export function useKakaoMap() {
  const mapRef = useRef<any>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // Kakao Maps SDK 로드
  useEffect(() => {
    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=YOUR_KAKAO_APP_KEY&autoload=false&libraries=services`;
    script.async = true;
    
    script.onload = () => {
      window.kakao.maps.load(() => {
        setIsMapLoaded(true);
      });
    };
    
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  // 지도 초기화
  const initMap = (container: HTMLElement, lat: number = 37.5665, lng: number = 126.978) => {
    if (!window.kakao || !window.kakao.maps) return;

    const options = {
      center: new window.kakao.maps.LatLng(lat, lng),
      level: 4, // 확대 레벨
    };

    const map = new window.kakao.maps.Map(container, options);
    mapInstanceRef.current = map;
    mapRef.current = container;

    return map;
  };

  // 마커 추가
  const addMarkers = (hospitals: Hospital[], onMarkerClick?: (hospital: Hospital) => void) => {
    if (!mapInstanceRef.current) return;

    // 기존 마커 제거
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    const bounds = new window.kakao.maps.LatLngBounds();

    hospitals.forEach((hospital) => {
      const position = new window.kakao.maps.LatLng(
        parseFloat(hospital.y),
        parseFloat(hospital.x)
      );

      // 마커 이미지 설정 (병원 아이콘)
      const imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png';
      const imageSize = new window.kakao.maps.Size(40, 42);
      const imageOption = { offset: new window.kakao.maps.Point(20, 42) };
      const markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);

      const marker = new window.kakao.maps.Marker({
        position,
        image: markerImage,
        title: hospital.name,
      });

      marker.setMap(mapInstanceRef.current);
      markersRef.current.push(marker);
      bounds.extend(position);

      // 마커 클릭 이벤트
      if (onMarkerClick) {
        window.kakao.maps.event.addListener(marker, 'click', () => {
          onMarkerClick(hospital);
        });
      }
    });

    // 모든 마커가 보이도록 지도 범위 조정
    if (hospitals.length > 0) {
      mapInstanceRef.current.setBounds(bounds);
    }
  };

  // 현재 위치로 이동
  const moveToLocation = (lat: number, lng: number) => {
    if (!mapInstanceRef.current) return;

    const moveLatLon = new window.kakao.maps.LatLng(lat, lng);
    mapInstanceRef.current.setCenter(moveLatLon);
  };

  return {
    isMapLoaded,
    initMap,
    addMarkers,
    moveToLocation,
    mapInstance: mapInstanceRef.current,
  };
}

