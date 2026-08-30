import React from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';
import Panel from './screens/Panel';

createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App>
      <Panel />
    </App>
  </React.StrictMode>
);
