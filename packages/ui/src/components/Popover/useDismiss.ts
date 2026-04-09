import { useEffect, type RefObject } from 'react';

/**
 * 点击外部 / ESC 关闭。
 */
export function useDismiss(
  open: boolean,
  onClose: () => void,
  containerRef: RefObject<HTMLElement | null>,
  contentRef: RefObject<HTMLElement | null>,
) {
  // 点击外部关闭
  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (containerRef.current?.contains(target)) return;
      if (contentRef.current?.contains(target)) return;
      onClose();
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open, onClose, containerRef, contentRef]);

  // ESC 关闭并聚焦回 trigger
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        (containerRef.current?.firstElementChild as HTMLElement | null)?.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose, containerRef]);
}
