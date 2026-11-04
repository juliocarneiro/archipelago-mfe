import './styles.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router';
import { SessionProvider } from './auth/session';
import { BoundariesProvider } from './islands/boundaries';
import { router } from './router';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SessionProvider>
      <BoundariesProvider>
        <RouterProvider router={router} />
      </BoundariesProvider>
    </SessionProvider>
  </StrictMode>,
);
