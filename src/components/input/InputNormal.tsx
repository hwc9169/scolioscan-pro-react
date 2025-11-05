import { useMemo, forwardRef } from 'react';
import { DefaultInput } from './DefaultInput';
import type { BaseInputProps } from '../../types/input';

/**
 * InputNormal 컴포넌트
 * 기본 Input 컴포넌트를 확장한 일반적인 Input variant입니다.
 */
export const InputNormal = forwardRef<HTMLInputElement, BaseInputProps & { maxLength?: number }>(function InputNormal({
  value = '',
  placeholder = 'Placeholder',
  state = 'keyout-empty',
  errorMessage,
  disabled = false,
  type = 'text',
  maxLength,
  className = '',
  onChange,
  onFocus,
  onBlur,
  onClear,
}, ref) {
  // state에 따라 자동으로 적절한 상태로 변경
  const normalizedState = useMemo(() => {
    if (state === 'keyout-error') return 'keyout-error';
    if (disabled) return 'keyout-empty';

    const hasValue = Boolean(value);
    const isFocused = state === 'keyin-empty' || state === 'keyin-typing';

    if (isFocused) {
      return hasValue ? 'keyin-typing' : 'keyin-empty';
    }
    return hasValue ? 'keyout-typed' : 'keyout-empty';
  }, [state, value]);

  return (
    <DefaultInput
      ref={ref}
      value={value}
      placeholder={placeholder}
      state={normalizedState}
      errorMessage={errorMessage}
      disabled={disabled}
      type={type}
      maxLength={maxLength}
      className={className}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
      onClear={onClear}
    />
  );
});

