import { useEffect, useLayoutEffect, useRef, useState } from 'react';

import { TQuickPasteState } from 'shared/types/quickPaste.types';

import {
  AIM_REST_MS,
  FOCUSED_ROW_SELECTOR,
  HIT_SELECTOR,
  INITIAL_FOCUS,
  INITIAL_MEASURE,
  INITIAL_STATE,
  LOAD_MORE_DISTANCE,
  NO_GROUP,
} from './QuickPaste.constants';
import {
  clampIndex,
  getLayout,
  getMode,
  getNotes,
  hasNotes,
  isAimingAt,
  stepGroup,
  toGroupIndex,
  wrapIndex,
} from './QuickPaste.helpers';
import {
  TPasteFocus,
  TPasteMeasure,
  TPastePoint,
  TQuickPasteHooksReturn,
} from './QuickPaste.types';

export function usePastePointer(open: boolean) {
  const insideRef = useRef(false);
  const pointRef = useRef<TPastePoint | null>(null);

  useEffect(() => {
    function report(inside: boolean) {
      if (inside !== insideRef.current) {
        insideRef.current = inside;
        window.wisp.sendQuickPasteIntent({ type: 'pointer', inside });
      }
    }

    function handleMove(event: MouseEvent) {
      pointRef.current = { x: event.clientX, y: event.clientY };
      const element = document.elementFromPoint(event.clientX, event.clientY);
      report(Boolean(element?.closest(HIT_SELECTOR)));
    }

    function handleLeave() {
      report(false);
    }

    window.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseleave', handleLeave);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseleave', handleLeave);
    };
  }, []);

  useEffect(() => {
    if (!open) {
      insideRef.current = false;
      pointRef.current = null;
    }
  }, [open]);

  return pointRef;
}

export function useQuickPasteHooks(): TQuickPasteHooksReturn {
  const [state, setState] = useState<TQuickPasteState>(INITIAL_STATE);
  const [focus, setFocus] = useState<TPasteFocus>(INITIAL_FOCUS);
  const [measure, setMeasure] = useState<TPasteMeasure>(INITIAL_MEASURE);
  const [scrollTick, setScrollTick] = useState(0);

  const groupsPanelRef = useRef<HTMLDivElement>(null);
  const notesPanelRef = useRef<HTMLDivElement>(null);
  const groupListRef = useRef<HTMLDivElement>(null);
  const noteListRef = useRef<HTMLDivElement>(null);
  const openIdRef = useRef(INITIAL_STATE.openId);
  const keyboardRef = useRef(false);
  const aimTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const lastPointRef = usePastePointer(state.open);

  const mode = getMode(state);
  const groupIndex = toGroupIndex(focus.group, state.groups.length);
  const group = groupIndex === NO_GROUP ? null : (state.groups[groupIndex] ?? null);
  const notes = getNotes(state, group);
  const noteCount = notes?.items.length ?? 0;
  const column = focus.column === 'notes' && hasNotes(notes) ? 'notes' : 'groups';
  const noteIndex = clampIndex(focus.note, noteCount);
  const groupKey = group?.key;
  const hasOnlyRecent = state.groups.length === 1 && Boolean(state.groups[0]?.recent);

  function clearAim() {
    if (aimTimerRef.current) {
      clearTimeout(aimTimerRef.current);
      aimTimerRef.current = null;
    }
  }

  function moveByKeyboard(next: TPasteFocus) {
    keyboardRef.current = true;
    clearAim();
    setFocus(next);
  }

  function enterNotes() {
    if (hasNotes(notes)) {
      moveByKeyboard({ group: groupIndex, column: 'notes', note: 0 });
    }
  }

  function pasteNote(index: number) {
    const note = notes?.items[index];
    if (group && note) {
      window.wisp.sendQuickPasteIntent({ type: 'paste', groupKey: group.key, noteId: note.id });
    }
  }

  function moveVertically(step: number) {
    if (column === 'notes') {
      moveByKeyboard({
        group: groupIndex,
        column: 'notes',
        note: wrapIndex(noteIndex + step, noteCount),
      });
      return;
    }
    moveByKeyboard({
      group: stepGroup(groupIndex, step, state.groups.length),
      column: 'groups',
      note: 0,
    });
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (!state.open || event.metaKey || event.altKey) {
      return;
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        moveVertically(1);
        break;

      case 'ArrowUp':
        event.preventDefault();
        moveVertically(-1);
        break;

      case 'ArrowRight':
        event.preventDefault();
        enterNotes();
        break;

      case 'ArrowLeft':
        event.preventDefault();
        if (column === 'notes') {
          moveByKeyboard({ group: groupIndex, column: 'groups', note: 0 });
        }
        break;

      case 'Enter':
        event.preventDefault();
        if (mode === 'error') {
          window.wisp.sendQuickPasteIntent({ type: 'retry' });
        } else if (column === 'notes') {
          pasteNote(noteIndex);
        } else {
          enterNotes();
        }
        break;

      case 'Escape':
        event.preventDefault();
        window.wisp.sendQuickPasteIntent({ type: 'close' });
        break;

      case 'Tab':
        event.preventDefault();
        break;

      default:
        break;
    }
  }

  const keyDownRef = useRef(handleKeyDown);

  useEffect(() => {
    keyDownRef.current = handleKeyDown;
  });

  useEffect(() => {
    function handleState(next: TQuickPasteState) {
      if (next.openId !== openIdRef.current) {
        openIdRef.current = next.openId;
        setFocus(INITIAL_FOCUS);
      }
      setState(next);
    }

    return window.wisp.onQuickPasteState(handleState);
  }, []);

  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      keyDownRef.current(event);
    }

    window.addEventListener('keydown', handleKey);

    return () => {
      window.removeEventListener('keydown', handleKey);
    };
  }, []);

  useEffect(() => {
    if (state.open && groupKey) {
      window.wisp.sendQuickPasteIntent({ type: 'focusGroup', groupKey });
    }
  }, [state.open, state.openId, groupKey]);

  useEffect(() => {
    if (!keyboardRef.current) {
      return;
    }
    keyboardRef.current = false;

    const list = column === 'notes' ? noteListRef.current : groupListRef.current;
    list?.querySelector(FOCUSED_ROW_SELECTOR)?.scrollIntoView({ block: 'nearest' });
  }, [column, groupIndex, noteIndex]);

  useLayoutEffect(() => {
    const panel = groupsPanelRef.current;
    if (!panel) {
      return;
    }

    const row = groupListRef.current?.querySelector(FOCUSED_ROW_SELECTOR);
    const next: TPasteMeasure = {
      groupsHeight: panel.offsetHeight,
      rowOffset: row ? row.getBoundingClientRect().top - panel.getBoundingClientRect().top : 0,
      notesHeight: notesPanelRef.current?.offsetHeight ?? 0,
    };

    setMeasure((current) =>
      current.groupsHeight === next.groupsHeight &&
      current.rowOffset === next.rowOffset &&
      current.notesHeight === next.notesHeight
        ? current
        : next
    );
  }, [state, focus, measure, scrollTick]);

  useEffect(
    () => () => {
      if (aimTimerRef.current) {
        clearTimeout(aimTimerRef.current);
      }
    },
    []
  );

  function onGroupsScroll() {
    setScrollTick(scrollTick + 1);
  }

  function onNotesScroll() {
    const list = noteListRef.current;
    if (!list || !groupKey || !notes?.hasMore) {
      return;
    }
    if (list.scrollHeight - list.scrollTop - list.clientHeight < LOAD_MORE_DISTANCE) {
      window.wisp.sendQuickPasteIntent({ type: 'loadMore', groupKey });
    }
  }

  function focusGroup(index: number) {
    clearAim();
    setFocus({ group: index, column: 'groups', note: 0 });
  }

  function onGroupHover(index: number, point: TPastePoint) {
    const previous = lastPointRef.current;

    if (index === groupIndex) {
      clearAim();
      if (column !== 'groups') {
        focusGroup(index);
      }
      return;
    }

    const target = notesPanelRef.current?.getBoundingClientRect();
    if (previous && target && group && isAimingAt(previous, point, target)) {
      clearAim();
      aimTimerRef.current = setTimeout(() => focusGroup(index), AIM_REST_MS);
      return;
    }

    focusGroup(index);
  }

  function onGroupPress(index: number) {
    clearAim();
    const pressed = state.groups[index] ?? null;
    setFocus({
      group: index,
      column: hasNotes(getNotes(state, pressed)) ? 'notes' : 'groups',
      note: 0,
    });
  }

  function onNoteHover(index: number) {
    clearAim();
    if (column !== 'notes' || index !== noteIndex) {
      setFocus({ group: groupIndex, column: 'notes', note: index });
    }
  }

  function onNotePress(index: number) {
    pasteNote(index);
  }

  function onRetry() {
    window.wisp.sendQuickPasteIntent({ type: 'retry' });
  }

  return {
    state,
    mode,
    focus: { group: groupIndex, column, note: noteIndex },
    group,
    notes,
    layout: getLayout(state, measure),
    hasOnlyRecent,
    groupsPanelRef,
    notesPanelRef,
    groupListRef,
    noteListRef,
    onGroupsScroll,
    onNotesScroll,
    onGroupHover,
    onGroupPress,
    onNoteHover,
    onNotePress,
    onRetry,
  };
}
