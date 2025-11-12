import { type ReactElement } from 'react';
import { createPortal } from 'react-dom';
import { useToastContext } from '../../contexts/ToastContext';
import { AnimatePresence, motion } from 'framer-motion';

// Figma에서 제공한 아이콘
const imgIcon24SolidExclamationCircle = "http://localhost:3845/assets/19af6a48a1af76be5ff7ea16e6b62115ccb2191e.svg";

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
            className="backdrop-blur-[5px] backdrop-filter bg-[rgba(0,0,0,0.7)] box-border content-stretch flex gap-[10px] items-center justify-center pl-[18px] pr-[22px] py-[8px] relative rounded-[22px]"
          >
            {/* 아이콘 */}
            <div className="relative shrink-0 size-[24px]">
              <img alt="" className="block max-w-none size-full" src={imgIcon24SolidExclamationCircle} />
            </div>
            {/* 텍스트 */}
            <p className="font-['Pretendard_Variable',sans-serif] font-normal leading-[18px] relative shrink-0 text-[13px] text-nowrap text-white whitespace-pre">
              {toast.message}
            </p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>,
    document.body
  );
}

