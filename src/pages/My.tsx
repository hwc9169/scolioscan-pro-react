import { type ReactElement } from 'react';
import { NavigationBottom } from '../components/NavigationBottom';

/**
 * 마이 페이지
 */
export function My(): ReactElement {
  return (
    <div className="min-h-screen bg-white pb-[60px]">
      <div className="p-4">
        <h1 className="text-2xl font-bold text-gray-700">마이</h1>
        {/* TODO: 마이 페이지 컨텐츠 추가 */}
      </div>
      <NavigationBottom />
    </div>
  );
}

