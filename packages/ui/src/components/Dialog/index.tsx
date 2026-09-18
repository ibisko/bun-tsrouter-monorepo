import { Slot } from '@radix-ui/react-slot';
import React, { useEffect, useState } from 'react';
import { useMergedRefs } from '@/hooks/useMergedRefs';
import { DialogContent, DialogContentProps } from './DialogContent';

type DialogProps = DialogContentProps & {
  open?: boolean;
  trigger?: React.ReactElement;
  ref?: any;
};

// todo 提供阻止点击背景关闭
export const Dialog = ({ trigger, open, ref, ...props }: DialogProps) => {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(open);
  useEffect(() => {
    setUncontrolledOpen(open);
  }, [open]);

  const wrapperRef = useMergedRefs(ref);

  return (
    <>
      {trigger && (
        <Slot
          ref={wrapperRef}
          onClick={() => {
            setUncontrolledOpen(true);
          }}>
          {trigger}
        </Slot>
      )}

      {uncontrolledOpen && <DialogContent setUncontrolledOpen={setUncontrolledOpen} {...props} />}
    </>
  );
};
