import { cn } from '@packages/ui';

type IconSvgProps = {
  className?: string;
  top?: number;
  left?: number;
  width?: number;
  height?: number;
  animate?: boolean;
  body: string;
  onClick?: (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => void;
};

export const IconSvg = ({ className, top = 0, left = 0, width = 0, height = 0, body, animate, onClick, ...props }: IconSvgProps) => {
  return (
    <svg
      {...props}
      className={cn('bg-foreground/10', animate && 'ring-2 ring-primary/80', className)}
      style={{
        backgroundSize: '8px',
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path fill="rgba(0,0,0,0.05)" d="M0 0h16v16H0zm16 16h16v16H16z"/><path fill="rgba(255,255,255,0.05)" d="M0 16h16v16H0zM16 0h16v16H16z"/></svg>')`,
      }}
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`${left} ${top} ${width} ${height}`}
      width="1em"
      height="1em"
      dangerouslySetInnerHTML={{
        __html: body,
      }}
      onClick={onClick}
    />
  );
};
