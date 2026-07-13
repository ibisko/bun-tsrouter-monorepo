import { cn } from '@/utils/cn';
import { posFieldValue, type WaterfallGalleryPosition } from './utils';

type BoxItemProps = {
  className?: string;
  pos?: WaterfallGalleryPosition;
  indexKey: number;
  children: React.ReactNode;
};
export const BoxItem = ({ className, pos, indexKey, children }: BoxItemProps) => {
  return (
    <div
      className={cn('absolute transition-all duration', className)}
      style={{
        top: posFieldValue({ pos, field: 'top', defaultValue: 'auto' }),
        left: posFieldValue({ pos, field: 'left', defaultValue: 'auto' }),
        width: posFieldValue({ pos, field: 'width', defaultValue: 'auto' }),
        height: posFieldValue({ pos, field: 'height', defaultValue: 'auto' }),
        opacity: pos?.opacity ? `${pos.opacity}` : '0',
      }}
      key={indexKey as number}>
      {children}
    </div>
  );
};
