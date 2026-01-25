import { Card, Select } from '@packages/ui';

export const SelectComps = () => {
  return (
    <Card>
      <div>{'<Select/>'}</div>
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

      <div>{'<Select/> groupName-children'}</div>
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
  );
};
