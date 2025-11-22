import { Card, Input, PasswordInput, Select } from '@packages/ui';
import { createLazyRoute } from '@tanstack/react-router';
import { Buttons } from './Buttons';

const ComponentsPage = () => {
  return (
    <div className="flex gap-4 p-4 items-start">
      <Card>
        <div className="font-bold">#Input</div>
        <div className="flex flex-col gap-2">
          <div>Input</div>
          <Input placeholder="pls input your email" />
        </div>

        <div className="flex flex-col gap-2">
          <div>PasswordInput</div>
          <PasswordInput defaultValue={123} autoComplete="off" placeholder="pls input your password" />
        </div>
      </Card>

      <Buttons />

      <Card>
        <div>#Select</div>

        <Select
          placeholder="Select a fruit"
          options={[
            { label: 'apple', value: 'apple' },
            { label: 'banana', value: 'banana' },
            { label: 'blueberry', value: 'blueberry' },
            { label: 'grapes', value: 'grapes' },
            { label: 'pineapple', value: 'pineapple' },
          ]}
        />

        <Select
          placeholder="Select a fruit groups"
          options={[
            {
              groupName: 'Fruits-1',
              children: [
                { label: 'apple', value: 'apple' },
                { label: 'banana', value: 'banana' },
              ],
            },
            {
              groupName: 'Fruits-2',
              children: [
                { label: 'blueberry', value: 'blueberry' },
                { label: 'grapes', value: 'grapes' },
                { label: 'pineapple', value: 'pineapple' },
              ],
            },
          ]}
        />
      </Card>
    </div>
  );
};

export const Route = createLazyRoute('/app/components')({
  component: ComponentsPage,
});

// type CardProps = {
//   children?: React.ReactNode;
// };
// const Card = ({ children }: CardProps) => {
//   return <div className="flex flex-col gap-4 bg-card p-4 rounded-lg border shadow-sm">{children}</div>;
// };
