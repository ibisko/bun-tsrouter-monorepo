import { useMergedRefs } from '@/hooks/useMergedRefs';
import { Slot } from '@radix-ui/react-slot';
import { useRef, useState } from 'react';
import { ContextMenuContent, MenuItem } from './ContextMenuContent';

type ContextMenuProps = {
  customMenu?: React.ReactNode;
  menus?: MenuItem[];
  menuClassName?: string;
  children: React.ReactElement;
  ref?: any;
};

// 全局唯一:记录当前打开的菜单,后开先关
let activeClose: (() => void) | null = null;

export const ContextMenu = ({ children, ref, menuClassName, customMenu, menus }: ContextMenuProps) => {
  const virtualRef = useRef<HTMLDivElement>(null);
  const wrapperRefs = useMergedRefs(ref, virtualRef);
  const [visibleMenu, setVisibleMenu] = useState(false);
  const [clientPosition, setClientPosition] = useState({ clientX: 0, clientY: 0 });

  const hideMenu = () => {
    if (activeClose === hideMenu) activeClose = null;
    setVisibleMenu(false);
  };

  const onContextMenu = async (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    // e.stopPropagation();
    e.preventDefault();

    if (!virtualRef.current) return;

    activeClose?.();
    activeClose = hideMenu;
    setClientPosition({ clientX: e.clientX, clientY: e.clientY });
    setVisibleMenu(true);
  };

  return (
    <>
      <Slot ref={wrapperRefs} onContextMenu={onContextMenu}>
        {children}
      </Slot>

      {visibleMenu && (
        <ContextMenuContent
          className={menuClassName}
          clientX={clientPosition.clientX}
          clientY={clientPosition.clientY}
          onClose={hideMenu}
          menus={menus}>
          {customMenu}
        </ContextMenuContent>
      )}
    </>
  );
};
