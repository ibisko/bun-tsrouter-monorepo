import '@packages/ui/styles.css';
import './styles/index.css';

import { RouterProvider } from '@tanstack/react-router';
import { router } from './router/rootRoute.tsx';
import ReactDOM from 'react-dom/client';
import './monaco-editor';

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(<RouterProvider router={router} />);
