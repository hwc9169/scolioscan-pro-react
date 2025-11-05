import { type ReactElement } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

type NavItem = {
  path: string;
  label: string;
  icon?: string; // TODO: 아이콘 추가 예정
};

const navItems: NavItem[] = [
  { path: '/home', label: '홈' },
  { path: '/analysis', label: '분석' },
  { path: '/hospital', label: '병원' },
  { path: '/shopping', label: '쇼핑' },
  { path: '/my', label: '마이' },
];

/**
 * 하단 네비게이션 바 컴포넌트
 */
export function NavigationBottom(): ReactElement {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (path: string) => {
    navigate(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex justify-around items-center h-[60px]">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => handleNavClick(item.path)}
              className={`
                flex flex-col items-center justify-center
                flex-1 h-full
                transition-colors
                ${isActive ? 'text-primary-500' : 'text-gray-400'}
              `}
            >
              {/* TODO: 아이콘 추가 */}
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

