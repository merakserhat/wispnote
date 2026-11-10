import React from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';
import CaptureHud from './screens/CaptureHud';

createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App>
      <CaptureHud />
    </App>
  </React.StrictMode>
);
