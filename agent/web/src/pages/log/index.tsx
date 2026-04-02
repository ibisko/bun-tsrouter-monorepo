import { createLazyRoute } from '@tanstack/react-router';

const LogPage = () => {
  return <div>log page</div>;
};

export const Route = createLazyRoute('/app/log')({
  component: LogPage,
});
