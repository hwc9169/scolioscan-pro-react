import { SERVER_URL } from '../utils/server';
import { fetchDataAsync } from '../utils/common';

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
 * @returns 분석 결과 목록 배열 또는 Response (에러 시)
 */
export async function getAnalyses(limit?: number): Promise<Analysis[] | Response> {
  const url = `${SERVER_URL}/api/analysis/`;
  const queryData: any = {};
  
  if (limit !== undefined) {
    queryData.limit = String(limit);
  }
  
  try {
    const result = await fetchDataAsync(url, 'GET', queryData, false, true);
    
    console.log('getAnalyses - fetchDataAsync 결과:', result, '타입:', typeof result, 'isArray:', Array.isArray(result));
    
    // fetchDataAsync는 성공 시 파싱된 데이터를 반환하고, 에러 시 Response를 반환
    if (result instanceof Response) {
      // 에러 응답인 경우
      console.error('getAnalyses - 에러 응답:', result.status, result.statusText);
      return result;
    }
    
    // 성공 시: 배열인지 확인
    if (Array.isArray(result)) {
      console.log('getAnalyses - 배열 데이터 반환:', result.length, '개');
      return result as Analysis[];
    }
    
    // 배열이 아닌 경우 (예상치 못한 형식)
    console.warn('getAnalyses - 배열이 아닌 데이터:', result);
    return [];
  } catch (error) {
    console.error('분석 결과 목록 조회 실패:', error);
    throw error;
  }
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
export async function createAnalysis(analysisData: CreateAnalysisRequest): Promise<CreateAnalysisSuccessResponse | Response> {
  const url = `${SERVER_URL}/api/analysis/`;
  
  try {
    const result = await fetchDataAsync(url, 'POST', analysisData, false, true);
    
    if (result instanceof Response) {
      return result;
    }
    
    return result as CreateAnalysisSuccessResponse;
  } catch (error) {
    console.error('분석 결과 생성 실패:', error);
    throw error;
  }
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
export async function getAnalysis(analysisId: string): Promise<Analysis | Response> {
  const url = `${SERVER_URL}/api/analysis/${analysisId}`;
  
  try {
    const result = await fetchDataAsync(url, 'GET', {}, false, true);
    
    if (result instanceof Response) {
      return result;
    }
    
    return result as Analysis;
  } catch (error) {
    console.error('분석 결과 상세 조회 실패:', error);
    throw error;
  }
}

/**
 * 분석 타입 목록 조회 API
 * GET /api/analysis/types/
 * 
 * @returns 분석 타입 목록 배열 또는 Response (에러 시)
 */
export async function getAnalysisTypes(): Promise<AnalysisType[] | Response> {
  const url = `${SERVER_URL}/api/analysis/types/`;
  
  try {
    const result = await fetchDataAsync(url, 'GET', {}, false, true);
    
    if (result instanceof Response) {
      return result;
    }
    
    // 성공 시: 배열인지 확인
    if (Array.isArray(result)) {
      return result;
    }
    
    return [];
  } catch (error) {
    console.error('분석 타입 목록 조회 실패:', error);
    throw error;
  }
}

