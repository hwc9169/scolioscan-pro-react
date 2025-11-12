import { SERVER_URL } from '../utils/server';
import { fetchDataAsync } from '../utils/common';

/**
 * 현재 사용자 정보 응답 타입
 * GET /api/users/me
 */
export interface CurrentUserResponse {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  birthday: string; // ISO 8601 형식 (예: "2025-11-12T09:47:39.925Z")
  sex: boolean;
  address: string;
  detail_address: string;
  alarm_count: number;
  setting: Record<string, unknown>;
  created_at: string; // ISO 8601 형식
}

/**
 * 사용자 프로필 업데이트 요청 데이터 타입
 * PUT /api/users/me
 */
export interface UpdateUserProfileRequest {
  name?: string;
  phone?: string;
  address?: string;
  detail_address?: string;
  birthday?: string; // ISO 8601 형식
  sex?: boolean; // true = 여성, false = 남성
}

/**
 * 사용자 설정 업데이트 요청 데이터 타입
 * PUT /api/users/me/settings
 */
export interface UpdateUserSettingsRequest {
  [key: string]: unknown;
}

/**
 * 현재 사용자 정보 조회 API
 * GET /api/users/me
 * 
 * @returns 현재 로그인한 사용자 정보
 */
export async function getCurrentUser(): Promise<Response> {
  // fetchDataAsync 직접 사용
  const url = `${SERVER_URL}/api/users/me`;
  
  try {
    const result = await fetchDataAsync(url, 'GET', {}, false, true);
    
    // fetchDataAsync는 성공 시 파싱된 데이터를 반환하지만, Response 객체가 필요하므로
    // result가 Response 객체인지 확인 (에러 시 Response 반환)
    if (result instanceof Response) {
      return result;
    }
    
    // 성공 시: fetchDataAsync가 파싱된 데이터를 반환했으므로
    // Response 객체를 생성하여 반환
    return new Response(JSON.stringify(result), {
      status: 200,
      statusText: 'OK',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

/**
 * 사용자 프로필 업데이트 API
 * PUT /api/users/me
 * 
 * @param profileData - 사용자 프로필 업데이트 데이터 (name, phone, address, detail_address)
 * @returns Response
 */
export async function updateUserProfile(profileData: UpdateUserProfileRequest): Promise<Response> {
  // fetchDataAsync 직접 사용
  const url = `${SERVER_URL}/api/users/me`;
  
  try {
    const result = await fetchDataAsync(url, 'PUT', profileData, false, true);
    
    // fetchDataAsync는 성공 시 파싱된 데이터를 반환하지만, Response 객체가 필요하므로
    // result가 Response 객체인지 확인 (에러 시 Response 반환)
    if (result instanceof Response) {
      return result;
    }
    
    // 성공 시: fetchDataAsync가 파싱된 데이터를 반환했으므로
    // Response 객체를 생성하여 반환
    return new Response(JSON.stringify(result), {
      status: 200,
      statusText: 'OK',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

/**
 * 사용자 설정 업데이트 API
 * PUT /api/users/me/settings
 * 
 * @param settingsData - 사용자 설정 업데이트 데이터
 * @returns Response
 */
export async function updateUserSettings(settingsData: UpdateUserSettingsRequest): Promise<Response> {
  // fetchDataAsync 직접 사용
  const url = `${SERVER_URL}/api/users/me/settings`;
  
  try {
    const result = await fetchDataAsync(url, 'PUT', settingsData, false, true);
    
    // fetchDataAsync는 성공 시 파싱된 데이터를 반환하지만, Response 객체가 필요하므로
    // result가 Response 객체인지 확인 (에러 시 Response 반환)
    if (result instanceof Response) {
      return result;
    }
    
    // 성공 시: fetchDataAsync가 파싱된 데이터를 반환했으므로
    // Response 객체를 생성하여 반환
    return new Response(JSON.stringify(result), {
      status: 200,
      statusText: 'OK',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

