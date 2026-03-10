import { Button, Card, Dialog } from '@packages/ui';
import { useState } from 'react';

export const ButtonComps = () => {
  return (
    <Card>
      <div>{'<Button/>'}</div>
      <div className="flex flex-col gap-4">
        <Button>default</Button>
        <Button variant="secondary">secondary</Button>
        <Button variant="destructive">destructive</Button>
        <Button variant="ghost">ghost</Button>
        <Button variant="link">link</Button>
      </div>
      <div>{'<Dialog/>'}</div>
      <DialogButton />
    </Card>
  );
};

const DialogButton = () => {
  const [visible, setVisible] = useState(false);
  return (
    <>
      <Button onClick={() => setVisible(true)}>DialogButton</Button>
      <Dialog open={visible} cancel={() => setVisible(false)}>
        <div>Dialog Content.</div>
      </Dialog>
    </>
  );
};
