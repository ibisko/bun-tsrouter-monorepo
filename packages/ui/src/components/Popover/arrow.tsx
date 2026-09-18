import type { Placement } from '@floating-ui/dom';

const ARROW_HALF = 4; // size-2 = 8px 的一半

type PopoverArrowProps = {
  ref: React.Ref<HTMLDivElement>;
  position?: { placement: Placement; arrow?: { x?: number; y?: number } } | null;
};

export const PopoverArrow = ({ ref, position }: PopoverArrowProps) => {
  const side = position?.placement.split('-')[0] as 'top' | 'right' | 'bottom' | 'left' | undefined;
  const style: React.CSSProperties | undefined = position
    ? ({
        left: position.arrow?.x != null ? `${position.arrow.x - ARROW_HALF}px` : undefined,
        top: position.arrow?.y != null ? `${position.arrow.y - ARROW_HALF}px` : undefined,
        ...(side && { [{ top: 'bottom', right: 'left', bottom: 'top', left: 'right' }[side]]: `${-ARROW_HALF}px` }),
      } as React.CSSProperties)
    : undefined;

  // backgroundColor 用内联 inherit：跟随浮层底色（含透明度、dark 模式），且不依赖 bg-inherit utility 是否被生成
  return <div ref={ref} className="absolute size-2 rotate-45 bg-inherit" style={{ ...style }} />;
};
