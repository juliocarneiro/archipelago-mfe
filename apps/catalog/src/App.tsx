import { useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router';
import './styles.css';
import { notifyLocationChange, type CatalogAppProps } from '@mfe/contracts';
import { ProductList } from './pages/ProductList';
import { ProductDetail } from './pages/ProductDetail';

/** Avisa os outros routers da página (o do shell) quando NÓS navegamos. */
function HistorySync() {
  const location = useLocation();
  useEffect(() => {
    notifyLocationChange();
  }, [location.pathname, location.search, location.hash]);
  return null;
}

/**
 * Raiz do MFE. Recebe o contrato `CatalogAppProps` do shell.
 * O MFE é dono das rotas ABAIXO do basename — o shell só sabe que /catalog/* é nosso.
 */
export function App({ basename, user }: CatalogAppProps) {
  return (
    <BrowserRouter basename={basename}>
      <HistorySync />
      <Routes>
        <Route index element={<ProductList user={user} />} />
        <Route path="p/:productId" element={<ProductDetail />} />
        <Route
          path="*"
          element={<p className="text-ink-soft">This page does not exist in the catalog.</p>}
        />
      </Routes>
    </BrowserRouter>
  );
}
