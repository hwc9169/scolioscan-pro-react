import { useCacheStorageContext } from '../contexts/CacheStorageContext';
import type { CacheStorageContextType } from '../types/cacheStorage';

/**
 * 애플리케이션 전역 캐시 스토리지 훅
 * 임시 데이터 저장 및 공유를 위한 메모리 기반 스토리지
 * 
 * @example
 * ```tsx
 * const cache = useCacheStorage();
 * 
 * // 데이터 저장
 * cache.set('email', 'user@example.com');
 * cache.set('userData', { name: 'John', age: 30 });
 * 
 * // 데이터 조회
 * const email = cache.get<string>('email');
 * const userData = cache.get<{ name: string; age: number }>('userData');
 * 
 * // 데이터 삭제
 * cache.remove('email');
 * 
 * // 존재 여부 확인
 * if (cache.has('email')) {
 *   // ...
 * }
 * 
 * // 모든 데이터 삭제
 * cache.clear();
 * ```
 */
export const useCacheStorage = (): CacheStorageContextType => {
  return useCacheStorageContext();
};

