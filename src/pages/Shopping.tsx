import { type ReactElement } from 'react';
import { NavigationBottom } from '../components/NavigationBottom';

/**
 * 쇼핑 페이지
 */
export function Shopping(): ReactElement {
  return (
    <div className="min-h-screen bg-white pb-[60px]">
      <div className="p-4">
        <h1 className="text-2xl font-bold text-gray-700">쇼핑</h1>
        {/* TODO: 쇼핑 페이지 컨텐츠 추가 */}
      </div>
      <NavigationBottom />
    </div>
  );
}

