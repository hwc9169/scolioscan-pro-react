import { type ReactElement, useMemo } from 'react';
import type { ButtonProps } from '../../types/button';

/**
 * DefaultBtn 컴포넌트
 * variant, color, size를 조합하여 다양한 스타일을 지원합니다.
 */
export function DefaultBtn({
  children,
  variant = 'filled',
  color = 'primary',
  size = 'regular',
  state,
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  className = '',
  onClick,
  type = 'button',
  href,
  target,
  ariaLabel,
}: ButtonProps): ReactElement {
  const buttonState = useMemo(() => {
    if (disabled) return 'disabled';
    if (loading) return 'loading';
    return state || 'enabled';
  }, [disabled, loading, state]);

  const isDisabled = buttonState === 'disabled';
  const isLoading = buttonState === 'loading';
  const isPressed = buttonState === 'pressed';
  const isSelected = buttonState === 'selected';

  // Size별 스타일
  const sizeClasses = useMemo(() => {
    if (variant === 'text') {
      // 텍스트 버튼은 높이만 설정
      return 'h-[26px] px-0';
    }
    switch (size) {
      case 'big':
        return 'h-[48px] px-[14px]';
      case 'regular':
      default:
        return 'h-[40px] px-[14px]';
    }
  }, [size, variant]);

  // Color별 스타일 (variant에 따라 다름)
  const colorClasses = useMemo(() => {
    if (variant === 'text') {
      // 텍스트 버튼 - primary 색상 사용
      return {
        base: 'bg-transparent text-primary-500 p-0',
        hover: isDisabled ? '' : 'hover:text-primary-500/80',
        active: isPressed ? 'text-mint-600' : '',
      };
    }

    // Filled 버튼
    switch (color) {
      case 'white':
        return {
          base: 'bg-white text-gray-800 border border-gray-200',
          hover: isDisabled ? '' : 'hover:bg-gray-50',
          active: isPressed ? 'bg-gray-100' : '',
        };
      case 'gray':
        return {
          base: 'bg-gray-50 text-gray-500',
          hover: isDisabled ? '' : 'hover:bg-gray-75',
          active: isPressed
            ? 'bg-gray-100'
            : isSelected
            ? 'bg-primary-500 text-white'
            : '',
        };
      case 'primary':
      default:
        return {
          base: 'bg-primary-500 text-white',
          hover: isDisabled ? '' : 'hover:bg-primary-500/90',
          active: isPressed ? 'bg-primary-500/80' : '',
        };
    }
  }, [variant, color, isDisabled, isPressed, isSelected]);

  // Size별 폰트 스타일
  const fontClasses = useMemo(() => {
    if (variant === 'text') {
      return 'font-[\'Pretendard_Variable\',sans-serif] font-medium text-[15px] leading-[20px]';
    }
    switch (size) {
      case 'big':
        return 'font-[\'Pretendard_Variable\',sans-serif] font-medium text-[16px] leading-[22px]';
      case 'regular':
      default:
        return 'font-[\'Pretendard_Variable\',sans-serif] font-medium text-[14px] leading-[20px]';
    }
  }, [size, variant]);

  const baseClasses = `
    inline-flex items-center justify-center
    ${sizeClasses}
    ${variant === 'text' ? '' : 'rounded-[6px]'}
    ${fontClasses}
    transition-colors duration-200
    ${colorClasses.base}
    ${!isDisabled && !isLoading ? colorClasses.hover : ''}
    ${colorClasses.active}
    ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  const handleClick = () => {
    if (!isDisabled && !isLoading && onClick) {
      onClick();
    }
  };

  // Loading spinner
  const loadingSpinner = (
    <svg
      className="animate-spin h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  const content = (
    <>
      {isLoading ? (
        <>
          {loadingSpinner}
          <span className="ml-2">{children}</span>
        </>
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <span className="mr-2 flex items-center">{icon}</span>
          )}
          {children}
          {icon && iconPosition === 'right' && (
            <span className="ml-2 flex items-center">{icon}</span>
          )}
        </>
      )}
    </>
  );

  // Link 버튼인 경우
  if (href && !isDisabled) {
    return (
      <a
        href={href}
        target={target}
        aria-label={ariaLabel}
        className={baseClasses}
      >
        {content}
      </a>
    );
  }

  // 일반 버튼
  return (
    <button
      type={type}
      disabled={isDisabled || isLoading}
      onClick={handleClick}
      aria-label={ariaLabel}
      className={baseClasses}
    >
      {content}
    </button>
  );
}

