import { SERVER_URL } from '../utils/server';
import { getCookie } from '../utils/common';

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
  name: string;
  phone: string;
  address: string;
  detail_address: string;
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
  const accessToken = getCookie('userAccessToken');
  const response = await fetch(`${SERVER_URL}/api/users/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken || ''}`,
    },
    credentials: 'include',
  });
  return response;
}

/**
 * 사용자 프로필 업데이트 API
 * PUT /api/users/me
 * 
 * @param profileData - 사용자 프로필 업데이트 데이터 (name, phone, address, detail_address)
 * @returns Response
 */
export async function updateUserProfile(profileData: UpdateUserProfileRequest): Promise<Response> {
  const accessToken = getCookie('userAccessToken');
  const response = await fetch(`${SERVER_URL}/api/users/me`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken || ''}`,
    },
    credentials: 'include',
    body: JSON.stringify(profileData),
  });
  return response;
}

/**
 * 사용자 설정 업데이트 API
 * PUT /api/users/me/settings
 * 
 * @param settingsData - 사용자 설정 업데이트 데이터
 * @returns Response
 */
export async function updateUserSettings(settingsData: UpdateUserSettingsRequest): Promise<Response> {
  const accessToken = getCookie('userAccessToken');
  const response = await fetch(`${SERVER_URL}/api/users/me/settings`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken || ''}`,
    },
    credentials: 'include',
    body: JSON.stringify(settingsData),
  });
  return response;
}

