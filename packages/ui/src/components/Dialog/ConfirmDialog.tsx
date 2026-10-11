import { useState } from 'react';
import { Dialog } from '.';
import { Button } from '@/components/Button';

type ConfirmDialogProps = {
  trigger: React.ReactElement;
  children: React.ReactNode;
  title?: string;
  cancelBtnText?: string;
  confirmBtnText?: string;
  onConfirm: () => Promise<void>;
  onError?: (error: unknown) => void;
};

export const ConfirmDialog = ({ trigger, children, title, cancelBtnText, confirmBtnText, onConfirm, onError }: ConfirmDialogProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog title={title} open={open} onChange={setOpen} trigger={trigger}>
      {children}
      <div className="flex gap-2 justify-end mt-2">
        <Button variant="outline" onClick={() => setOpen(false)}>
          {cancelBtnText ?? 'Cancel'}
        </Button>
        <Button
          onClick={async () => {
            try {
              await onConfirm();
              setOpen(false);
            } catch (error) {
              onError?.(error);
            }
          }}>
          {confirmBtnText ?? 'Submit'}
        </Button>
      </div>
    </Dialog>
  );
};
