import type { IconInfo } from '@packages/icons';
import { cn } from '@packages/ui';
import { SvgIcon } from './IconSvg';
import { useEffect, useState } from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { fetchIcons, type IconsListIds } from './useSearch';

type IconListSubProps = {
  className?: string;
  iconsData: IconsListIds;
  size?: number;
};

export const IconSubList = ({ className, iconsData, size = 44 }: IconListSubProps) => {
  const [icons, setIcon] = useState<{ key: string; info?: IconInfo }[]>(iconsData.ids.map(id => ({ key: `${iconsData.prefix}:${id}` })));
  const { ref, isIntersecting } = useIntersectionObserver();

  useEffect(() => {
    if (!isIntersecting) return;
    console.log('useIntersectionObserver', `${iconsData.prefix}(${iconsData.ids.length})`);
    fetchIcons(iconsData, icon => {
      setIcon(e => e.map(item => (item.key === icon.key ? { ...item, info: icon } : item)));
    });
  }, [isIntersecting]);

  return (
    <>
      {icons.map((item, i) =>
        item.info ? (
          <SvgIcon className={cn('text-4xl', className)} item={item.info} key={item.key} />
        ) : (
          <div
            className={cn('', className)}
            style={{
              width: `${size}px`,
              height: `${size}px`,
            }}
            ref={i === 0 ? ref : undefined}
            key={item.key}></div>
        ),
      )}
    </>
  );
};
