import React from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';
import QuickPaste from './screens/QuickPaste';

createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App>
      <QuickPaste />
    </App>
  </React.StrictMode>
);
