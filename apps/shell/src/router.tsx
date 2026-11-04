import { createBrowserRouter } from 'react-router';
import { Layout } from './layout/Layout';
import { Home } from './pages/Home';
import { NotFound } from './pages/NotFound';
import { CartApp, CatalogApp } from './remotes/apps';

/**
 * ROTEAMENTO EM DOIS NÍVEIS:
 *  - O shell só conhece o PREFIXO de cada MFE (`/catalog/*`, `/cart/*`).
 *  - O que vem depois do prefixo é problema do MFE (ele tem o próprio router).
 * Assim o time do catálogo cria `/catalog/p/:id/reviews` sem PR no shell.
 */
export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'catalog/*', element: <CatalogApp /> },
      { path: 'cart/*', element: <CartApp /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]);
