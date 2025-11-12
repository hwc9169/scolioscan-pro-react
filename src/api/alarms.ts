import { SERVER_URL } from '../utils/server';
import { getCookie } from '../utils/common';

/**
 * 알림 정보 타입
 * GET /api/alarms/
 */
export interface Alarm {
  id: number;
  user_uuid: string;
  alarm_type: number;
  title: string;
  content: string;
  read_at: string | null; // ISO 8601 형식 (예: "2025-11-12T09:49:05.764Z") 또는 null
  created_at: string; // ISO 8601 형식
}

/**
 * 알림 읽음 처리 성공 응답 (200)
 */
export interface MarkAlarmReadSuccessResponse {
  status: 200;
  data: string;
}

/**
 * 알림 읽음 처리 검증 에러 응답 (422)
 */
export interface MarkAlarmReadValidationErrorResponse {
  status: 422;
  detail: Array<{
    loc: (string | number)[];
    msg: string;
    type: string;
  }>;
}

/**
 * 알림 목록 조회 API
 * GET /api/alarms/
 * 
 * @returns 알림 목록 배열
 */
export async function getAlarms(): Promise<Response> {
  const accessToken = getCookie('userAccessToken');
  const response = await fetch(`${SERVER_URL}/api/alarms/`, {
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
 * 읽지 않은 알림 개수 조회 API
 * GET /api/alarms/unread-count
 * 
 * @returns 읽지 않은 알림 개수 (string)
 */
export async function getUnreadAlarmCount(): Promise<Response> {
  const accessToken = getCookie('userAccessToken');
  const response = await fetch(`${SERVER_URL}/api/alarms/unread-count`, {
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
 * 알림 읽음 처리 API
 * POST /api/alarms/{alarm_id}/read
 * 
 * @param alarmId - 알림 ID (integer)
 * @returns 
 * - 200: 성공 응답 (string)
 * - 422: 검증 에러 응답
 */
export async function markAlarmAsRead(alarmId: number): Promise<Response> {
  const accessToken = getCookie('userAccessToken');
  const response = await fetch(`${SERVER_URL}/api/alarms/${alarmId}/read`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken || ''}`,
    },
    credentials: 'include',
  });
  return response;
}

/**
 * 모든 알림 읽음 처리 API
 * POST /api/alarms/read-all
 * 
 * @returns 성공 응답 (string)
 */
export async function markAllAlarmsAsRead(): Promise<Response> {
  const accessToken = getCookie('userAccessToken');
  const response = await fetch(`${SERVER_URL}/api/alarms/read-all`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken || ''}`,
    },
    credentials: 'include',
  });
  return response;
}

