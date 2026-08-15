import { cn } from '@/utils/cn';

type BoxItemProps = {
  className?: string;
  indexKey: number;
  children: React.ReactNode;

  top?: number;
  left?: number;
  width?: number;
  height?: number;
  opacity?: number;
};
export const BoxItem = ({ className, indexKey, children, top, left, width, height, opacity }: BoxItemProps) => {
  return (
    <div
      className={cn('absolute transition-all duration', className)}
      style={{
        top: fieldValue(top, 'auto'),
        left: fieldValue(left, 'auto'),
        width: fieldValue(width, 'auto'),
        height: fieldValue(height, 'auto'),
        opacity: opacity ? `${opacity}` : '0',
      }}
      key={indexKey as number}>
      {children}
    </div>
  );
};

const fieldValue = (val?: number, defaultValue?: string) => {
  if (val || val === 0) {
    return `${val}px`;
  }
  return defaultValue;
};
