import '@packages/ui/styles.css';
import './styles/global.css';
import { RouterProvider } from '@tanstack/react-router';
import { router } from './router/rootRoute.tsx';
import ReactDOM from 'react-dom/client';

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(<RouterProvider router={router} />);
