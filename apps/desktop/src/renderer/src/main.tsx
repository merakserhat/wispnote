import React from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';
import Main from './screens/Main';

createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App>
      <Main />
    </App>
  </React.StrictMode>
);
