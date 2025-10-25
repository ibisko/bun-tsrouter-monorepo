import { createLazyRoute } from '@tanstack/react-router';

const UserPage = () => {
  return <div>user page</div>;
};

export const Route = createLazyRoute('/manage/user')({
  component: UserPage,
});
