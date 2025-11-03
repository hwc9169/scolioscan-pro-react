export type InputState = 
  | 'keyout-empty'      // 포커스 없음, 빈 상태
  | 'keyout-typed'      // 포커스 없음, 입력된 상태
  | 'keyin-empty'       // 포커스 있음, 빈 상태
  | 'keyin-typing'      // 포커스 있음, 입력 중
  | 'keyout-error';     // 에러 상태

export interface BaseInputProps {
  value?: string;
  placeholder?: string;
  state?: InputState;
  errorMessage?: string;
  disabled?: boolean;
  type?: 'text' | 'email' | 'password' | 'number';
  className?: string;
  onChange?: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onClear?: () => void;
}

export interface InputProps extends BaseInputProps {
  type?: 'text' | 'email' | 'password' | 'number';
  name?: string;
  id?: string;
  autoFocus?: boolean;
  maxLength?: number;
}

