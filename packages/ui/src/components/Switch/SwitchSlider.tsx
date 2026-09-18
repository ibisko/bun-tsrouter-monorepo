import { cn } from '@/main';
import { useMergedRefs } from '@/hooks/useMergedRefs';
import { useEffect, useRef, useState } from 'react';

export type SwitchSliderProps<T> = Omit<React.ComponentProps<'div'>, 'onChange'> & {
  value: T;
  options: { label: React.ReactElement | string; value: T }[];
  onChange: (value: T) => void;
};

export const SwitchSlider = <T = any,>({ value, options, onChange, className, ref, ...props }: SwitchSliderProps<T>) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const mergedRef = useMergedRefs(ref, parentRef);
  const [sliderLeft, setSliderLeft] = useState(2);
  const [sliderWidth, setSliderWidth] = useState(0);

  const onChangeBefore = (value: T) => {
    const parentDom = parentRef.current;
    if (!parentDom) return;
    const index = options.findIndex(item => item.value === value);
    if (index === -1) return;
    const dom = parentDom.children.item(index + 1) as HTMLDivElement;
    if (!dom) return;
    setSlider(dom);
    onChange(value);
  };

  const setSlider = (dom: HTMLDivElement) => {
    const parentDom = parentRef.current;
    if (!parentDom) return;
    const parentRect = parentDom.getBoundingClientRect();

    const rect = dom.getBoundingClientRect();
    setSliderLeft(rect.left - parentRect.left);
    setSliderWidth(rect.width);
  };

  useEffect(() => {
    const parentDom = parentRef.current;
    if (!parentDom) return;
    const index = options.findIndex(item => item.value === value);
    if (index !== -1) {
      const dom = parentDom.children.item(index) as HTMLDivElement;
      setSlider(dom);
    }
  }, []);

  return (
    <div
      className={cn(
        'relative flex items-center min-h-8 text-sm rounded-full inset-shadow-2xs',
        'inset-shadow-foreground/10 p-1 bg-foreground/5',
        className,
      )}
      {...props}
      ref={mergedRef}>
      {!!sliderWidth && (
        <div
          className={cn('absolute bg-background rounded-full shadow px-2 top-1 transition-all', 'dark:bg-foreground')}
          style={{
            left: `${sliderLeft}px`,
            width: `${sliderWidth}px`,
            height: `calc(100% - 8px)`,
          }}
        />
      )}
      {options.map(item => (
        <div
          className={cn('relative px-2 cursor-pointer transition', value === item.value && 'dark:text-background')}
          onClick={() => onChangeBefore(item.value)}
          key={item.value as React.Key}>
          {item.label}
        </div>
      ))}
    </div>
  );
};
