import { SERVER_URL } from '../utils/server';
import { getCookie } from '../utils/common';

/**
 * 분석 결과 타입
 */
export interface Analysis {
  id: string; // UUID
  user_uuid: string; // UUID
  analysis_type: number;
  main_thoracic: number;
  lumbar: number;
  score: number;
  image_url: string;
  created_at: string; // ISO 8601 형식 (예: "2025-11-12T09:50:04.735Z")
}

/**
 * 분석 결과 생성 요청 데이터 타입
 * POST /api/analysis/
 */
export interface CreateAnalysisRequest {
  user_uuid: string; // UUID
  analysis_type: number;
  main_thoracic: number;
  lumbar: number;
  score: number;
  image_url: string;
}

/**
 * 분석 결과 생성 성공 응답 (201)
 */
export interface CreateAnalysisSuccessResponse {
  id: string; // UUID
  user_uuid: string; // UUID
  analysis_type: number;
  main_thoracic: number;
  lumbar: number;
  score: number;
  image_url: string;
  created_at: string; // ISO 8601 형식
}

/**
 * 검증 에러 응답 (422)
 */
export interface ValidationErrorResponse {
  detail: Array<{
    loc: (string | number)[];
    msg: string;
    type: string;
  }>;
}

/**
 * 분석 타입 정보 타입
 * GET /api/analysis/types/
 */
export interface AnalysisType {
  [key: string]: unknown;
}

/**
 * 분석 결과 목록 조회 API
 * GET /api/analysis/
 * 
 * @param limit - 조회할 결과 개수 제한 (optional)
 * @returns 분석 결과 목록 배열
 */
export async function getAnalyses(limit?: number): Promise<Response> {
  const accessToken = getCookie('userAccessToken');
  
  // 쿼리 파라미터 구성
  const queryParams = new URLSearchParams();
  if (limit !== undefined) {
    queryParams.append('limit', String(limit));
  }
  
  const url = `${SERVER_URL}/api/analysis/${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  
  const response = await fetch(url, {
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
 * 분석 결과 생성 API
 * POST /api/analysis/
 * 
 * @param analysisData - 분석 결과 생성 데이터
 * @returns 
 * - 201: 생성된 분석 결과
 * - 422: 검증 에러 응답
 */
export async function createAnalysis(analysisData: CreateAnalysisRequest): Promise<Response> {
  const accessToken = getCookie('userAccessToken');
  const response = await fetch(`${SERVER_URL}/api/analysis/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken || ''}`,
    },
    credentials: 'include',
    body: JSON.stringify(analysisData),
  });
  return response;
}

/**
 * 특정 분석 결과 상세 조회 API
 * GET /api/analysis/{analysis_id}
 * 
 * @param analysisId - 분석 결과 ID (UUID)
 * @returns 
 * - 200: 분석 결과 상세 정보
 * - 422: 검증 에러 응답
 */
export async function getAnalysis(analysisId: string): Promise<Response> {
  const accessToken = getCookie('userAccessToken');
  const response = await fetch(`${SERVER_URL}/api/analysis/${analysisId}`, {
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
 * 분석 타입 목록 조회 API
 * GET /api/analysis/types/
 * 
 * @returns 분석 타입 목록 배열
 */
export async function getAnalysisTypes(): Promise<Response> {
  const accessToken = getCookie('userAccessToken');
  const response = await fetch(`${SERVER_URL}/api/analysis/types/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken || ''}`,
    },
    credentials: 'include',
  });
  return response;
}

