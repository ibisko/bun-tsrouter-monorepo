import { createLazyRoute } from '@tanstack/react-router';

const UserPage = () => {
  return <div>user page</div>;
};

export const Route = createLazyRoute('/app/user')({
  component: UserPage,
});
