import React, { useEffect, useState } from 'react';

import useBridgeAction from 'hooks/useBridgeAction';
import usePanelRender from 'hooks/usePanelRender';
import { TEngineAction } from 'shared/types/engine.types';
import { TPanelMode, TPanelPayload } from 'shared/types/ipc.types';

import { buildActions } from './Panel.helpers';
import { TPanelHooksReturn } from './Panel.types';

export function usePanelHooks(): TPanelHooksReturn {
  const [payload, setPayload] = useState<TPanelPayload | null>(null);
  const [mode, setMode] = useState<TPanelMode>('panel');
  const [noteText, setNoteText] = useState('');

  const { run, pendingAction } = useBridgeAction();

  function handleRender(next: TPanelPayload) {
    setPayload(next);
    setMode(next.mode);
    setNoteText('');
  }

  usePanelRender(handleRender);

  function openNoteMode() {
    setMode('note');
    setNoteText('');
    window.wisp.focusInput();
  }

  function onAction(action: TEngineAction) {
    if (action === 'quick_note' && mode !== 'note') {
      openNoteMode();
      return;
    }
    run({ action, text: action === 'quick_note' ? noteText : undefined });
  }

  function onNoteKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.nativeEvent.isComposing) {
      return;
    }
    if (event.key === 'Enter') {
      run({ action: 'quick_note', text: noteText });
      return;
    }
    if (event.key === 'Escape') {
      setMode('panel');
      window.wisp.dismiss();
    }
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Escape' && mode !== 'note') {
      window.wisp.dismiss();
    }
  }

  const actions = payload ? buildActions(payload.context, payload.canSync) : [];

  useEffect(() => {
    if (payload?.mode === 'note') {
      window.wisp.focusInput();
    }
  }, [payload]);

  return {
    payload,
    mode,
    actions,
    noteText,
    pendingAction,
    setNoteText,
    onAction,
    onNoteKeyDown,
    onKeyDown,
  };
}
