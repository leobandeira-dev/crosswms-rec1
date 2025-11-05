import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { setupApiBaseFetch } from './lib/api';

const rootElement = document.getElementById('root')!;

// Verificar se já existe root para evitar duplicação
if (!rootElement.hasAttribute('data-root-initialized')) {
  rootElement.setAttribute('data-root-initialized', 'true');
  // Configure API base URL for production (prefix /api calls)
  setupApiBaseFetch();
  const root = createRoot(rootElement);
  root.render(<App />);
}
