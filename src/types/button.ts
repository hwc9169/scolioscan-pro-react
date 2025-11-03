import type { ReactNode } from 'react';

// Button Types
export type ButtonVariant = 
  | 'filled'      // 채워진 버튼
  | 'text';       // 텍스트 버튼

export type ButtonColor = 
  | 'primary'     // 기본 색상 (파란색)
  | 'white'       // 흰색
  | 'gray';       // 회색

export type ButtonSize = 
  | 'regular'     // 일반 크기 (h-10)
  | 'big';        // 큰 크기 (h-12)

export type ButtonState = 
  | 'enabled'     // 활성화
  | 'disabled'    // 비활성화
  | 'loading'      // 로딩 중
  | 'pressed'      // 눌림
  | 'selected';   // 선택됨

export interface BaseButtonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  color?: ButtonColor;
  size?: ButtonSize;
  state?: ButtonState;
  disabled?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export interface ButtonProps extends BaseButtonProps {
  href?: string;
  target?: string;
  ariaLabel?: string;
}

