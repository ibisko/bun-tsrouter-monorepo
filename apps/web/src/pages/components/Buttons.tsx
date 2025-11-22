import { Button, Card } from '@packages/ui';

export const Buttons = () => {
  return (
    <Card>
      <div>#Button</div>
      <div className="flex flex-col gap-4">
        <Button>default</Button>
        <Button variant="secondary">secondary</Button>
        <Button variant="destructive">destructive</Button>
        <Button variant="ghost">ghost</Button>
        <Button variant="link">link</Button>
      </div>
    </Card>
  );
};
