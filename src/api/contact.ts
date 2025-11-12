import { SERVER_URL } from '../utils/server';
import { getCookie } from '../utils/common';

/**
 * 고객센터 문의 발송 요청 데이터 타입
 * POST /api/contact/
 */
export interface SendContactRequest {
  email: string;
  inquiry_type: string;
  inquiry_content: string;
}

/**
 * 고객센터 문의 발송 API
 * POST /api/contact/
 * 
 * @param contactData - 문의 발송 데이터 (email, inquiry_type, inquiry_content)
 * @returns 성공 응답 (string)
 */
export async function sendContact(contactData: SendContactRequest): Promise<Response> {
  const accessToken = getCookie('userAccessToken');
  const response = await fetch(`${SERVER_URL}/api/contact/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken || ''}`,
    },
    credentials: 'include',
    body: JSON.stringify(contactData),
  });
  return response;
}

