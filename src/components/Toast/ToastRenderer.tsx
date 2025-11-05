import { type ReactElement } from 'react';
import { createPortal } from 'react-dom';
import { useToastContext } from '../../contexts/ToastContext';
import { AnimatePresence, motion } from 'framer-motion';

/**
 * Toast 렌더링 컴포넌트
 */
export function ToastRenderer(): ReactElement {
  const { toasts } = useToastContext();

  return createPortal(
    <div className="fixed bottom-[24px] left-1/2 -translate-x-1/2 z-[9999] pointer-events-none flex flex-col items-center gap-2">
      <AnimatePresence mode="wait">
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ 
              duration: 0.3,
              ease: 'easeOut'
            }}
            className="
              bg-gray-900/95
              backdrop-blur-sm
              text-white
              px-4 py-3
              rounded-xl
              text-sm
              font-medium
              max-w-[calc(100vw-48px)]
              sm:max-w-md
              truncate
              text-center
              shadow-lg
              shadow-black/20
              border
              border-gray-800/50
              min-w-[120px]
              whitespace-nowrap
            "
          >
            {toast.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>,
    document.body
  );
}

