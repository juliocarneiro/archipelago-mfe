/**
 * MODO STANDALONE: o MFE roda sozinho em http://localhost:4001, sem o shell.
 * Isso é uma das práticas mais importantes: o time do catálogo desenvolve e
 * testa sem depender de subir a plataforma inteira.
 *
 * Aqui simulamos o que o shell faria: tokens globais, usuário mock e basename "/".
 * Este arquivo NÃO é exposto via Module Federation — só roda em standalone.
 */
import './standalone.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
      <App basename="/" user={{ id: 'dev', name: 'Standalone dev' }} />
    </main>
  </StrictMode>,
);
