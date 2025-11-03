import { type ReactElement, useState, useRef, useEffect, useMemo } from 'react';
import type { InputState } from '../../types/input';

interface BirthSelectProps {
  value: string;
  placeholder: string;
  state?: InputState;
  options: string[];
  disabled?: boolean;
  className?: string;
  onChange?: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

/**
 * 생년월일 선택을 위한 셀렉트 박스 컴포넌트
 */
export function BirthSelect({
  value,
  placeholder,
  state = 'keyout-empty',
  options,
  disabled = false,
  className = '',
  onChange,
  onFocus,
  onBlur,
}: BirthSelectProps): ReactElement {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);
  const isFocused = state === 'keyin-empty' || state === 'keyin-typing';
  const hasValue = Boolean(value);
  const isError = state === 'keyout-error';

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen]);

  const handleToggle = () => {
    if (disabled) return;
    setIsOpen((prev) => !prev);
    if (!isOpen && onFocus) {
      onFocus();
    }
  };

  const handleSelect = (selectedValue: string) => {
    if (onChange) {
      onChange(selectedValue);
    }
    setIsOpen(false);
    if (onBlur) {
      onBlur();
    }
  };

  const displayValue = value || placeholder;
  const displayTextColor = hasValue ? 'text-gray-800' : 'text-gray-200';

  return (
    <div className={`relative ${className} w-full`} ref={selectRef}>
      <button
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        className={`
          relative flex items-center h-[52px] w-full
          pl-[16px] pr-[12px] py-0 rounded-[6px]
          bg-gray-50
          border border-gray-100 border-solid
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${isFocused && !isError ? 'border-primary-500' : ''}
          ${isError ? 'border-red-400' : ''}
          transition-colors
          text-left
        `}
      >
        <span className={`
          basis-0 grow min-h-px min-w-px
          font-['Pretendard_Variable',sans-serif] font-medium
          text-[15px] leading-[20px]
          ${displayTextColor}
          overflow-hidden overflow-ellipsis whitespace-nowrap
          relative shrink-0
        `}>
          {displayValue}
        </span>
        
        {/* 드롭다운 화살표 */}
        <svg
          className={`w-4 h-4 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
            className="text-gray-400"
          />
        </svg>
      </button>

      {/* 드롭다운 메뉴 */}
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full max-h-[200px] overflow-auto bg-white border border-gray-100 rounded-[6px] shadow-lg">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => handleSelect(option)}
              className={`
                w-full px-[16px] py-[12px] text-left
                font-['Pretendard_Variable',sans-serif] font-medium
                text-[15px] leading-[20px]
                hover:bg-gray-50
                transition-colors
                ${value === option ? 'bg-primary-50 text-primary-500' : 'text-gray-800'}
              `}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

