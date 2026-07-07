import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './app/App';
import { AppStateProvider } from './app/AppState';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppStateProvider>
      <App />
    </AppStateProvider>
  </React.StrictMode>,
);
