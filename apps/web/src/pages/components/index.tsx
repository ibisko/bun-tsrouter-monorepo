import { createLazyRoute } from '@tanstack/react-router';
import { ButtonComps } from './ButtonComps';
import { FromComps } from './FromComps';
import { DescriptionComps } from './DescriptionComps';
import { SelectComps } from './SelectComps';
import { TableComps } from './TableComps';

const ComponentsPage = () => {
  return (
    <div className="flex gap-4 flex-wrap p-4 items-start">
      <FromComps />
      <ButtonComps />
      <SelectComps />
      <TableComps />
      <DescriptionComps />
    </div>
  );
};

export const Route = createLazyRoute('/app/components')({
  component: ComponentsPage,
});
