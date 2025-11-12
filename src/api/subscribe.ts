import { SERVER_URL } from '../utils/server';
import { getCookie } from '../utils/common';

/**
 * 구독 플랜 타입 정보
 * GET /api/subscribe/types
 */
export interface SubscribeType {
  id: number;
  name: string;
  price: number;
  description: string;
  created_at: string; // ISO 8601 형식 (예: "2025-11-12T09:51:48.332Z")
}

/**
 * 구독 정보 타입
 */
export interface Subscription {
  id: string; // UUID
  user_uuid: string; // UUID
  subscribe_card: string; // UUID
  subscribe_type: number;
  started_at: string; // ISO 8601 형식
  ended_at: string; // ISO 8601 형식
  terminated_at: string | null; // ISO 8601 형식 또는 null
  created_at: string; // ISO 8601 형식
}

/**
 * 구독 생성 요청 데이터 타입
 * POST /api/subscribe/
 */
export interface CreateSubscriptionRequest {
  user_uuid: string; // UUID
  subscribe_card: string; // UUID
  subscribe_type: number;
  started_at: string; // ISO 8601 형식 (예: "2025-11-12T09:52:05.712Z")
  ended_at: string; // ISO 8601 형식
}

/**
 * 구독 생성 성공 응답 (201)
 */
export interface CreateSubscriptionSuccessResponse {
  id: string; // UUID
  user_uuid: string; // UUID
  subscribe_card: string; // UUID
  subscribe_type: number;
  started_at: string; // ISO 8601 형식
  ended_at: string; // ISO 8601 형식
  terminated_at: string; // ISO 8601 형식
  created_at: string; // ISO 8601 형식
}

/**
 * 구독 플랜 목록 조회 API
 * GET /api/subscribe/types
 * 
 * @returns 구독 플랜 목록 배열
 */
export async function getSubscribeTypes(): Promise<Response> {
  const accessToken = getCookie('userAccessToken');
  const response = await fetch(`${SERVER_URL}/api/subscribe/types`, {
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
 * 현재 구독 정보 조회 API
 * GET /api/subscribe/current
 * 
 * @returns 현재 구독 정보
 */
export async function getCurrentSubscription(): Promise<Response> {
  const accessToken = getCookie('userAccessToken');
  const response = await fetch(`${SERVER_URL}/api/subscribe/current`, {
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
 * 구독 생성 API
 * POST /api/subscribe/
 * 
 * @param subscriptionData - 구독 생성 데이터
 * @returns 
 * - 201: 생성된 구독 정보
 */
export async function createSubscription(subscriptionData: CreateSubscriptionRequest): Promise<Response> {
  const accessToken = getCookie('userAccessToken');
  const response = await fetch(`${SERVER_URL}/api/subscribe/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken || ''}`,
    },
    credentials: 'include',
    body: JSON.stringify(subscriptionData),
  });
  return response;
}

/**
 * 구독 해지 API
 * POST /api/subscribe/cancel
 * 
 * @returns 성공 응답 (string)
 */
export async function cancelSubscription(): Promise<Response> {
  const accessToken = getCookie('userAccessToken');
  const response = await fetch(`${SERVER_URL}/api/subscribe/cancel`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken || ''}`,
    },
    credentials: 'include',
  });
  return response;
}

