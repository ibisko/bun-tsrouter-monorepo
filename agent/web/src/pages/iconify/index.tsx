import { createLazyRoute } from '@tanstack/react-router';
import { IconSets } from './IconSets';

const IconifyPage = () => {
  return (
    <div>
      <IconSets />
    </div>
  );
};

export const Route = createLazyRoute('/app/iconify')({
  component: IconifyPage,
});
