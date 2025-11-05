import { type ReactElement } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
// 비활성화 아이콘
import HomeIcon from '../assets/icon_svg/Home.svg';
import SearchIcon from '../assets/icon_svg/Search.svg';
import Search2Icon from '../assets/icon_svg/Search2.svg';
import CartIcon from '../assets/icon_svg/Cart.svg';
import BurgerIcon from '../assets/icon_svg/Burger.svg';
// 활성화 아이콘
import ActiveHomeIcon from '../assets/icon_svg/ActiveHome.svg';
import ActiveSearchIcon from '../assets/icon_svg/ActiveSearch.svg';
import ActiveSearch2Icon from '../assets/icon_svg/ActiveSearch2.svg';
import ActiveCartIcon from '../assets/icon_svg/ActiveCart.svg';
import ActiveBurgerIcon from '../assets/icon_svg/ActiveBurger.svg';

type NavItem = {
  path: string;
  label: string;
  icon: string;
  activeIcon: string;
};

const navItems: NavItem[] = [
  { path: '/home', label: '홈', icon: HomeIcon, activeIcon: ActiveHomeIcon },
  { path: '/analysis', label: '분석', icon: SearchIcon, activeIcon: ActiveSearchIcon },
  { path: '/hospital', label: '병원', icon: Search2Icon, activeIcon: ActiveSearch2Icon },
  { path: '/shopping', label: '쇼핑', icon: CartIcon, activeIcon: ActiveCartIcon },
  { path: '/my', label: '마이', icon: BurgerIcon, activeIcon: ActiveBurgerIcon },
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
    <div className="fixed bg-white bottom-0 box-border flex items-center justify-center gap-[42px] left-0 px-4 py-[8px] right-0 rounded-tl-[20px] rounded-tr-[20px] shadow-[0px_0px_16px_0px_rgba(0,0,0,0.1)] w-full z-50">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <button
            key={item.path}
            onClick={() => handleNavClick(item.path)}
            className="flex flex-col gap-[2px] items-center justify-center"
          >
            <div className="flex items-center justify-center h-[30px] w-[30px]">
              <img 
                alt={item.label}
                className="w-full h-full object-contain"
                src={isActive ? item.activeIcon : item.icon}
              />
            </div>
            <div className={`text-[11px] text-center leading-[16px] ${isActive ? 'text-[#007af5]' : 'text-[#7e89a0]'}`}>
              {item.label}
            </div>
          </button>
        );
      })}
    </div>
  );
}

