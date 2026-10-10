import { Slot } from '@radix-ui/react-slot';
import React, { useEffect, useState } from 'react';
import { useMergedRefs } from '@/hooks/useMergedRefs';
import { DialogContent, DialogContentProps } from './DialogContent';

type DialogProps = DialogContentProps & {
  open?: boolean;
  onChange?: (open: boolean) => void;
  trigger?: React.ReactElement;
  ref?: any;
};

// todo 提供阻止点击背景关闭
export const Dialog = ({ trigger, open, ref, onChange, ...props }: DialogProps) => {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(open);
  const [closeBeforeAnimate, setCloseBeforeAnimate] = useState(false);

  useEffect(() => {
    if (open) {
      setCloseBeforeAnimate(false);
      setUncontrolledOpen(open);
    } else {
      setCloseBeforeAnimate(true);
    }
  }, [open]);

  const wrapperRef = useMergedRefs(ref);

  return (
    <>
      {trigger && (
        <Slot
          ref={wrapperRef}
          onClick={() => {
            setCloseBeforeAnimate(false);
            setUncontrolledOpen(true);
            onChange?.(true);
          }}>
          {trigger}
        </Slot>
      )}

      {uncontrolledOpen && (
        <DialogContent
          closeBeforeAnimate={closeBeforeAnimate}
          setCloseBeforeAnimate={setCloseBeforeAnimate}
          onExited={() => {
            setUncontrolledOpen(false);
            onChange?.(false);
          }}
          {...props}
        />
      )}
    </>
  );
};
