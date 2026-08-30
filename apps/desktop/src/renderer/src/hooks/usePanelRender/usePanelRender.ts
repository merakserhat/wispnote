import { useEffect, useRef } from 'react';

import { TPanelRenderHandler } from './usePanelRender.types';

function usePanelRender(handler: TPanelRenderHandler) {
  const handlerRef = useRef(handler);

  useEffect(() => {
    handlerRef.current = handler;
  });

  useEffect(() => window.wisp.onPanelRender((payload) => handlerRef.current(payload)), []);
}

export default usePanelRender;
