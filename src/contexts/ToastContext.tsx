import { createContext, useContext, useState, useCallback, type ReactElement, type ReactNode } from 'react';

export interface ToastState {
  message: string;
  id: number;
}

interface ToastContextType {
  showToast: (message: string) => void;
  toasts: ToastState[];
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps): ReactElement {
  const [toasts, setToasts] = useState<ToastState[]>([]);

  const showToast = useCallback((message: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { message, id }]);

    // 2초 후 자동 제거
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 2000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, toasts }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast(): Omit<ToastContextType, 'toasts'> {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  const { showToast } = context;
  return { showToast };
}

export function useToastContext(): ToastContextType {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToastContext must be used within ToastProvider');
  }
  return context;
}

