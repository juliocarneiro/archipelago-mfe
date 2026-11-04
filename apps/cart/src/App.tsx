import { useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router';
import './styles.css';
import { notifyLocationChange, type CartAppProps } from '@mfe/contracts';
import { CartPage } from './pages/CartPage';

function HistorySync() {
  const location = useLocation();
  useEffect(() => {
    notifyLocationChange();
  }, [location.pathname, location.search, location.hash]);
  return null;
}

export function App({ basename, user }: CartAppProps) {
  return (
    <BrowserRouter basename={basename}>
      <HistorySync />
      <Routes>
        <Route index element={<CartPage user={user} />} />
      </Routes>
    </BrowserRouter>
  );
}
