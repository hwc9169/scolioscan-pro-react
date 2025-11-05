import { type ChangeEvent, useCallback, forwardRef } from 'react';
import type { InputProps } from '../../types/input';

/**
 * 기본 Input 컴포넌트
 * 다른 Input variant들이 이를 확장하여 사용합니다.
 */
export const DefaultInput = forwardRef<HTMLInputElement, InputProps>(function DefaultInput({
  value = '',
  placeholder = '',
  state = 'keyout-empty',
  errorMessage,
  disabled = false,
  type = 'text',
  name,
  id,
  autoFocus = false,
  maxLength,
  className = '',
  onChange,
  onFocus,
  onBlur,
  onClear,
}, ref) {
  const isFocused = state === 'keyin-empty' || state === 'keyin-typing';
  const hasValue = Boolean(value);
  // 비밀번호 타입일 때는 삭제 버튼 표시 안 함
  const showClearButton = (state === 'keyout-typed' || state === 'keyin-typing') && hasValue && type !== 'password';
  const isError = state === 'keyout-error';

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (!disabled && onChange) {
        onChange(e.target.value);
      }
    },
    [disabled, onChange]
  );

  const handleFocus = useCallback(() => {
    if (!disabled && onFocus) {
      onFocus();
    }
  }, [disabled, onFocus]);

  const handleBlur = useCallback(() => {
    if (!disabled && onBlur) {
      onBlur();
    }
  }, [disabled, onBlur]);

  const handleClear = useCallback(() => {
    if (!disabled && onClear) {
      onClear();
    }
  }, [disabled, onClear]);

  return (
    <div className={`flex flex-col ${isError ? 'gap-[4px]' : 'gap-[8px]'} items-start w-full ${className}`}>
      <div
        className={`
          relative flex items-center h-[52px] w-full
          pl-[16px] pr-[12px] py-0 rounded-[6px]
          bg-gray-50
          border border-gray-100 border-solid
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${isFocused && !isError ? 'border-primary-500' : ''}
          transition-colors
        `}
      >
        <input
          ref={ref}
          type={type}
          id={id}
          name={name}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          autoFocus={autoFocus}
          maxLength={maxLength}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={`
            flex-1 min-w-0
            font-['Pretendard_Variable',sans-serif] font-medium
            text-[15px] leading-[20px]
            ${hasValue ? 'text-gray-800' : 'text-gray-200'}
          placeholder:text-gray-200
            bg-transparent border-0 outline-0
          `}
        />

        {showClearButton && (
          <button
            type="button"
            onClick={handleClear}
            className="
              flex items-center justify-center
              w-8 h-8 shrink-0
              text-gray-400
              hover:bg-gray-75 rounded
              transition-colors
            "
            aria-label="입력 내용 지우기"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 4L4 12M4 4L12 12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
      </div>

      {isError && errorMessage && (
        <div className="pl-[16px] pr-[12px] w-full">
          <p className="text-12r text-red-400">{errorMessage}</p>
        </div>
      )}
    </div>
  );
});

