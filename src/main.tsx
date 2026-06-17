/**
 * main.tsx
 * Entry point dell'applicazione React
 * Renderizza il componente App nel DOM
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App3D from './App3D';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App3D />
  </React.StrictMode>
);
