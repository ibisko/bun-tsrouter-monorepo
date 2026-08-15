import { Button, Card, Dialog } from '@packages/ui';
import { useState } from 'react';

export const ButtonComps = () => {
  const [visible, setVisible] = useState(false);
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
      <Dialog title="Dialog Title" trigger={<Button>DialogButton</Button>} open={visible} onChange={setVisible}>
        <div>Dialog Content.</div>
      </Dialog>
    </Card>
  );
};
