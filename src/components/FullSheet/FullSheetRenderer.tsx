import { useEffect, useRef, useState, type ReactElement } from 'react';
import { createPortal } from 'react-dom';
import { useFullSheetContext } from '../../contexts/FullSheetContext';
import { AnimatePresence, motion } from 'framer-motion';
import type { FullSheetStack, AnimationDirection } from '../../types/fullSheet';

// 애니메이션 방향에 따른 initial/animate 값 계산 (순수 함수로 외부에 정의)
const getAnimationValues = (direction: AnimationDirection = 'right', type: 'enter' | 'exit') => {
  switch (direction) {
    case 'left':
      return type === 'enter' 
        ? { initial: { x: '-100vw' }, animate: { x: 0 } }
        : { initial: { x: 0 }, animate: { x: '-100vw' } };
    case 'right':
      return type === 'enter'
        ? { initial: { x: '100vw' }, animate: { x: 0 } }
        : { initial: { x: 0 }, animate: { x: '100vw' } };
    case 'bottom':
      return type === 'enter'
        ? { initial: { y: '100vh' }, animate: { y: 0 } }
        : { initial: { y: 0 }, animate: { y: '100vh' } };
    case 'top':
      return type === 'enter'
        ? { initial: { y: '-100vh' }, animate: { y: 0 } }
        : { initial: { y: 0 }, animate: { y: '-100vh' } };
    case 'none':
    default:
      return { initial: {}, animate: {} };
  }
};

export function FullSheetRenderer(): ReactElement {
  "use memo"; // React Compiler 최적화 활성화
  const { stack, activeIndex, pendingPopOptions, closeFullSheet, resolveFullSheet } = useFullSheetContext();

  // 스냅샷 유지로 최종 닫힘 시 exit 애니메이션 재생
  const [renderedStack, setRenderedStack] = useState<FullSheetStack[]>([]);
  const [renderedActiveIndex, setRenderedActiveIndex] = useState<number>(-1);
  const [visible, setVisible] = useState<boolean>(false);
  const prevLenRef = useRef<number>(0);
  const [phase, setPhase] = useState<'idle' | 'enter' | 'exit'>('idle');
  // pop 시 exit 애니메이션을 위한 이전 풀시트 정보 저장
  const exitingFullSheetRef = useRef<FullSheetStack | null>(null);
  const popExitDirectionRef = useRef<AnimationDirection | null>(null);

  useEffect(() => {
    const prevLen = prevLenRef.current;
    const currLen = stack.length;

    if (currLen > 0) {
      // 스택이 변경되었을 때만 업데이트 (push된 새 항목 추가, 기존 항목은 유지)
      setRenderedStack((prev) => {
        // 새로 push된 항목만 추가
        if (currLen > prev.length) {
          return stack; // 전체 스택 교체 (새 항목 포함)
        }
        // pop 또는 activeIndex 변경의 경우, 기존 스택을 유지하되 activeIndex만 업데이트
        // (pop 시 exit 애니메이션을 위해 기존 스택 유지)
        return prev.map((item, index) => {
          const stackItem = stack[index];
          if (stackItem && stackItem.id === item.id) {
            // 동일한 ID면 props와 options는 업데이트 (props 변경 가능성)
            return {
              ...item,
              props: stackItem.props,
              options: stackItem.options,
            };
          }
          return item;
        });
      });
      
      // push 감지: stack 길이가 증가했을 때 (새 풀시트 등장)
      const isNewPush = prevLen < currLen;
      // pop 감지: stack 길이가 감소했을 때 (풀시트 사라짐)
      const isPop = prevLen > currLen;
      
      setRenderedActiveIndex(activeIndex);
      
      if (isPop) {
        // pop 감지: exit 애니메이션을 위해 이전 마지막 풀시트 정보 저장
        // renderedStack은 아직 업데이트하지 않음 (exit 애니메이션 재생을 위해)
        const lastFullSheet = renderedStack[prevLen - 1];
        if (lastFullSheet) {
          exitingFullSheetRef.current = lastFullSheet;
          // popFullSheet 호출 시 전달된 exitAnimationDirection 우선 사용
          // 없으면 풀시트 자체의 exitAnimationDirection 또는 animationDirection 또는 'none'
          popExitDirectionRef.current = pendingPopOptions?.exitAnimationDirection
            || lastFullSheet.options?.exitAnimationDirection 
            || lastFullSheet.options?.animationDirection 
            || 'none';
        };
        setVisible(true); // exit 애니메이션을 위해 visible 유지
        setPhase('exit');
      } else {
        setVisible(true);
        // 새로운 push 시 enter 애니메이션
        if (isNewPush) {
          setPhase('enter');
        } else {
          setPhase('idle');
        }
      }
    } else if (prevLen > 0) {
      // CLEAR_STACK 또는 CLOSE_FULLSHEET 처리: 모든 풀시트 제거
      if (stack.length === 0) {
        // 모든 풀시트를 즉시 제거 (exit 애니메이션 없음)
        setRenderedStack([]);
        setRenderedActiveIndex(-1);
        setVisible(false);
        setPhase('idle');
        exitingFullSheetRef.current = null;
        popExitDirectionRef.current = null;
      } else {
        // pop 감지: stack 길이가 감소했을 때 (풀시트 사라짐)
        // exit 애니메이션을 위해 이전 마지막 풀시트 정보 저장
        // renderedStack은 아직 업데이트하지 않음 (exit 애니메이션 재생을 위해)
        const lastFullSheet = renderedStack[prevLen - 1];
        if (lastFullSheet) {
          exitingFullSheetRef.current = lastFullSheet;
          // popFullSheet 호출 시 전달된 exitAnimationDirection 우선 사용
          // 없으면 풀시트 자체의 exitAnimationDirection 또는 animationDirection 또는 'none'
          popExitDirectionRef.current = pendingPopOptions?.exitAnimationDirection
            || lastFullSheet.options?.exitAnimationDirection 
            || lastFullSheet.options?.animationDirection 
            || 'none';
        }
        setVisible(false);
        setPhase('exit');
      }
    }

    prevLenRef.current = currLen;
    // React Compiler가 자동으로 의존성을 추론하므로 명시적 의존성 배열은 선택사항
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stack, activeIndex, pendingPopOptions]);

  // 배경 클릭 핸들러 (스냅샷 기준)
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.target !== e.currentTarget) return;

    const active = renderedActiveIndex >= 0 ? renderedStack[renderedActiveIndex] : undefined;
    if (!active) return;

    if (active.options?.onBackdropClick) {
      active.options.onBackdropClick();
    }

    if (active.options?.closeOnBackdropClick) {
      // openAwaitFullSheet인 경우 (resolve 함수가 있는 경우) resolveFullSheet 호출
      if (active.resolve) {
        const backdropValue = active.options?.backdropClickValue || { confirmed: false, cancelled: true };
        resolveFullSheet(backdropValue);
      } else {
        // 일반 openFullSheet인 경우 closeFullSheet 호출
        closeFullSheet();
      }
    }
  };

  return createPortal(
    <AnimatePresence mode="wait">
      {(visible || phase === 'exit') && (
        <motion.div
          key="fullsheet-backdrop"
          className="fixed inset-0 z-50"
        >
          {renderedStack.map((fullSheet, index) => {
            // 모든 풀시트를 항상 DOM에 유지 (keepInDOM은 기본값이 true)
            // pop이나 CLEAR_STACK으로 명시적으로 제거하기 전까지 유지
            const FullSheetComponent = fullSheet.component;
            const isActive = index === renderedActiveIndex;

            // 퇴장 애니메이션: pop/close로 사라지는 풀시트
            if (phase === 'exit' && exitingFullSheetRef.current && fullSheet.id === exitingFullSheetRef.current.id) {
              // popFullSheet 호출 시 전달된 exitAnimationDirection 우선 사용
              // 없으면 풀시트 자체의 exitAnimationDirection 또는 animationDirection 또는 'none'
              const exitDirection = popExitDirectionRef.current || 'none';
              
              // 'none' 옵션일 경우 애니메이션 없이 즉시 사라짐
              if (exitDirection === 'none') {
                // exit 애니메이션 없이 즉시 스택에서 제거
                setRenderedStack((prev) => prev.filter((item) => item.id !== fullSheet.id));
                setRenderedActiveIndex(activeIndex >= 0 ? activeIndex : -1);
                setPhase('idle');
                exitingFullSheetRef.current = null;
                popExitDirectionRef.current = null;
                return null;
              }
              
              const anim = getAnimationValues(exitDirection, 'exit');
              
              return (
                <motion.div
                  key={fullSheet.id}
                  className="absolute inset-0"
                  style={{ zIndex: index }}
                  onClick={(e) => {
                    handleBackdropClick(e);
                    e.stopPropagation();
                  }}
                  initial={anim.initial}
                  animate={anim.animate}
                  transition={{ type: 'spring', stiffness: 260, damping: 28 }}
                  onAnimationComplete={() => {
                    // exit 애니메이션 완료 후 해당 풀시트만 스택에서 제거
                    setRenderedStack((prev) => prev.filter((item) => item.id !== fullSheet.id));
                    setRenderedActiveIndex(activeIndex >= 0 ? activeIndex : -1);
                    setPhase('idle');
                    exitingFullSheetRef.current = null;
                    popExitDirectionRef.current = null;
                  }}
                >
                  <FullSheetComponent {...fullSheet.props} />
                </motion.div>
              );
            }

            // 활성 풀시트의 등장 애니메이션 처리
            const enterDirection = fullSheet.options?.animationDirection || 'none';
            const isActiveAndEntering = isActive && (phase === 'enter' || phase === 'idle');
            const hasAnimation = enterDirection !== 'none';
            
            // 애니메이션이 있고 활성 풀시트가 등장 중일 때만 motion.div 사용
            // 애니메이션이 완료되면 (idle) 같은 motion.div를 유지하여 컴포넌트 언마운트 방지
            if (hasAnimation && (isActiveAndEntering || (isActive && phase === 'idle'))) {
              const anim = getAnimationValues(enterDirection, 'enter');
              
              return (
                <motion.div
                  key={fullSheet.id}
                  className="absolute inset-0"
                  style={{ zIndex: index }}
                  onClick={(e) => {
                    handleBackdropClick(e);
                    e.stopPropagation();
                  }}
                  initial={phase === 'enter' ? anim.initial : anim.animate}
                  animate={isActive ? anim.animate : anim.animate}
                  transition={{ type: 'spring', stiffness: 260, damping: 28 }}
                  onAnimationComplete={() => {
                    // enter 애니메이션 완료 후 idle로 전환 (한 번만 실행)
                    if (phase === 'enter') {
                      setPhase('idle');
                    }
                  }}
                >
                  <FullSheetComponent {...fullSheet.props} />
                </motion.div>
              );
            }
            
            // 그 외의 경우: 일반 div로 렌더링 (비활성 풀시트도 포함, 상태 보존)
            // 'none' 애니메이션이거나 비활성 풀시트는 항상 여기로 옴
            if (isActiveAndEntering && enterDirection === 'none') {
              if (phase === 'enter') {
                setPhase('idle');
              }
            }
            
            // 모든 풀시트를 동일한 구조로 렌더링하여 상태 보존
            // hidden 클래스 제거: 기존 풀시트도 DOM에 유지되도록 함
            return (
              <div
                key={fullSheet.id}
                className="absolute inset-0"
                style={{ zIndex: index }}
                onClick={(e) => {
                  handleBackdropClick(e);
                  e.stopPropagation();
                }}
              >
                <FullSheetComponent {...fullSheet.props} />
              </div>
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

