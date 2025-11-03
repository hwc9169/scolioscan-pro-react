/**
 * 애플리케이션 전역에서 사용할 수 있는 캐시 스토리지 타입 정의
 * 임시 데이터 저장 및 공유를 위한 메모리 기반 스토리지
 */

export interface CacheStorageContextType {
  /**
   * 스토리지에 데이터 저장
   * @param key 저장할 키
   * @param value 저장할 값 (어떤 타입이든 가능)
   */
  set: <T = unknown>(key: string, value: T) => void;
  
  /**
   * 스토리지에서 데이터 조회
   * @param key 조회할 키
   * @returns 저장된 값 또는 undefined
   */
  get: <T = unknown>(key: string) => T | undefined;
  
  /**
   * 스토리지에서 데이터 삭제
   * @param key 삭제할 키
   */
  remove: (key: string) => void;
  
  /**
   * 스토리지에 키가 존재하는지 확인
   * @param key 확인할 키
   * @returns 존재 여부
   */
  has: (key: string) => boolean;
  
  /**
   * 스토리지의 모든 데이터 삭제
   */
  clear: () => void;
  
  /**
   * 스토리지의 모든 키 목록 조회
   * @returns 모든 키 배열
   */
  keys: () => string[];
  
  /**
   * 스토리지의 모든 데이터 조회
   * @returns 모든 데이터 객체
   */
  getAll: () => Record<string, unknown>;
}

