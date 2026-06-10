import { cn } from '@/main';
import { Dialog as BaseDialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './base';

type DialogProps = {
  className?: string;
  title?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  trigger?: React.ReactElement;
  open: boolean;
  onChange?: (open: boolean) => void;
};

export const Dialog = ({ className, trigger, title, children, footer, open, onChange }: DialogProps) => {
  return (
    <BaseDialog open={open} onOpenChange={onChange}>
      {trigger && <DialogTrigger>{trigger}</DialogTrigger>}
      <DialogContent className={cn(className)}>
        <DialogTitle className="text-xl font-black" data-slot="dialog-title" hidden={!title}>
          {title}
        </DialogTitle>
        {children}
        <DialogDescription data-slot="dialog-description" hidden={!footer}>
          {footer}
        </DialogDescription>
      </DialogContent>
    </BaseDialog>
  );
};
