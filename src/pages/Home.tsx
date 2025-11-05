import { type ReactElement } from 'react';
import { NavigationBottom } from '../components/NavigationBottom';

/**
 * 홈 페이지
 */
export function Home(): ReactElement {
  return (
    <div className="min-h-screen bg-white pb-[60px]">
      <div className="p-4">
        <h1 className="text-2xl font-bold text-gray-700">홈</h1>
        {/* TODO: 홈 페이지 컨텐츠 추가 */}
      </div>
      <NavigationBottom />
    </div>
  );
}

