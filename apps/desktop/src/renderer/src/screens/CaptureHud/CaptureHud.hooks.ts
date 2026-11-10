import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';

import { TCaptureHudPhase, TCaptureHudState } from 'shared/types/captureHud.types';

import {
  HIT_RECHECK_MS,
  HIT_SELECTOR,
  INITIAL_VIEW,
  NOTE_MAX_HEIGHT,
  NOTE_MIN_HEIGHT,
} from './CaptureHud.constants';
import { isOpenPhase, toView } from './CaptureHud.helpers';
import { TCaptureHudHooksReturn } from './CaptureHud.types';

export function useHudPointer(phase: TCaptureHudPhase) {
  const insideRef = useRef(false);
  const pointRef = useRef<{ x: number; y: number } | null>(null);

  function report(inside: boolean) {
    if (inside === insideRef.current) {
      return;
    }
    insideRef.current = inside;
    window.wisp.sendHudIntent({ type: 'pointer', inside });
  }

  function check() {
    const point = pointRef.current;
    if (!point) {
      report(false);
      return;
    }
    const element = document.elementFromPoint(point.x, point.y);
    report(Boolean(element?.closest(HIT_SELECTOR)));
  }

  const checkRef = useRef(check);

  useEffect(() => {
    checkRef.current = check;
  });

  useEffect(() => {
    function handleMove(event: MouseEvent) {
      pointRef.current = { x: event.clientX, y: event.clientY };
      checkRef.current();
    }

    function handleLeave() {
      pointRef.current = null;
      checkRef.current();
    }

    window.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseleave', handleLeave);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseleave', handleLeave);
    };
  }, []);

  useEffect(() => {
    if (phase === 'hidden') {
      insideRef.current = false;
      return undefined;
    }

    const timer = setTimeout(() => checkRef.current(), HIT_RECHECK_MS);

    return () => clearTimeout(timer);
  }, [phase]);
}

export function useCaptureHudHooks(): TCaptureHudHooksReturn {
  const [view, setView] = useState(INITIAL_VIEW);
  const [draft, setDraft] = useState('');
  const [growth, setGrowth] = useState(0);

  const noteRef = useRef<HTMLTextAreaElement>(null);
  const captureIdRef = useRef(INITIAL_VIEW.state.captureId);

  const { phase, capture } = view.state;
  const open = isOpenPhase(phase);
  const typed = Boolean(draft.trim());
  const canSync = Boolean(capture?.canSync);

  useHudPointer(phase);

  useEffect(() => {
    function handleState(next: TCaptureHudState) {
      if (next.captureId !== captureIdRef.current) {
        captureIdRef.current = next.captureId;
        setDraft('');
      }
      setView((current) => toView(current, next));
    }

    return window.wisp.onHudState(handleState);
  }, []);

  useEffect(() => {
    const note = noteRef.current;
    if (!open || !note) {
      return;
    }

    note.focus({ preventScroll: true });
    note.setSelectionRange(note.value.length, note.value.length);
  }, [open, view.state.captureId]);

  useLayoutEffect(() => {
    const note = noteRef.current;
    if (!note) {
      return;
    }

    note.style.height = `${NOTE_MIN_HEIGHT}px`;
    const height = Math.min(Math.max(note.scrollHeight, NOTE_MIN_HEIGHT), NOTE_MAX_HEIGHT);
    note.style.height = `${height}px`;
    setGrowth(height - NOTE_MIN_HEIGHT);
  }, [draft]);

  useEffect(() => {
    window.wisp.sendHudIntent({ type: 'typed', typed });
  }, [typed, view.state.captureId]);

  function onNoteChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setDraft(event.target.value);
  }

  function onSync() {
    window.wisp.sendHudIntent({ type: 'sync' });
  }

  function onOpenNotes() {
    window.wisp.sendHudIntent({ type: 'openNotes' });
  }

  function onNoteKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.nativeEvent.isComposing) {
      return;
    }

    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      window.wisp.sendHudIntent({ type: 'save', note: draft });
      return;
    }

    if (!event.ctrlKey || phase !== 'detailed') {
      return;
    }

    if (event.key === '1') {
      event.preventDefault();
      if (canSync) {
        onSync();
      } else {
        onOpenNotes();
      }
      return;
    }

    if (event.key === '2' && canSync) {
      event.preventDefault();
      onOpenNotes();
    }
  }

  return {
    view,
    draft,
    growth,
    noteRef,
    onNoteChange,
    onNoteKeyDown,
    onSync,
    onOpenNotes,
  };
}
