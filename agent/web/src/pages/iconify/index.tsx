import { createLazyRoute } from '@tanstack/react-router';
import { IconSets } from './IconSets';
import { LocalIcons } from './LocalIcons';

const IconifyPage = () => {
  return (
    <div>
      <LocalIcons />
      <IconSets />
    </div>
  );
};

export const Route = createLazyRoute('/app/iconify')({
  component: IconifyPage,
});
