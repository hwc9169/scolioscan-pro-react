import { SERVER_URL } from '../utils/server';

/**
 * Root API
 * GET /
 * 
 * @returns 성공 응답 (string)
 */
export async function getRoot(): Promise<Response> {
  const response = await fetch(`${SERVER_URL}/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
  return response;
}

/**
 * Health Check API
 * GET /health
 * 
 * @returns 성공 응답 (string)
 */
export async function healthCheck(): Promise<Response> {
  const response = await fetch(`${SERVER_URL}/health`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
  return response;
}

