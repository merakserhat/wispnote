import { TCaretRect } from 'shared/types/capture.types';
import { TPasteResult } from 'shared/types/engine.types';
import {
  TQuickPasteGroup,
  TQuickPasteIntent,
  TQuickPasteNotes,
  TQuickPasteState,
} from 'shared/types/quickPaste.types';

import { requestNoteGroups } from '../api/noteGroups';
import { requestNotes } from '../api/notes';
import { requestSources } from '../api/sources';
import { log } from '../helpers';
import { toErrorResponse } from '../ipc/ipc.helpers';

import {
  CLOSE_FADE_MS,
  CLOSED_STATE,
  FIRST_PAGE,
  KEYBOARD_RETURN_MS,
  NOTES_PAGE_SIZE,
  PREFETCH_GROUP_COUNT,
  RECENT_GROUP_KEY,
  SOURCES_PAGE_SIZE,
} from './createQuickPaste.constants';
import { TCreateQuickPasteParams, TQuickPaste, TSourceMap } from './createQuickPaste.types';
import { toPasteGroup, toPasteNotes, toRecentGroup, toSourceMap } from './quickPaste.helpers';

// INFO: (serhat) the paste menu's state machine. Main owns the lists and their cache, so the menu
// opens on what it showed last time while a refresh runs; the renderer keeps only where the focus is.
export function createQuickPaste({ engine, hud, window }: TCreateQuickPasteParams): TQuickPaste {
  let state: TQuickPasteState = CLOSED_STATE;
  let sources: TSourceMap = {};
  let pendingGroups: TQuickPasteGroup[] | null = null;
  const refreshed: Record<string, number> = {};
  const pages: Record<string, number> = {};
  const loadingMore = new Set<string>();
  let timer: NodeJS.Timeout | null = null;

  function clearTimer(): void {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  }

  function move(next: TQuickPasteState): void {
    state = next;
    window.render(state);
  }

  function setNotes(groupKey: string, notes: TQuickPasteNotes): void {
    move({ ...state, notes: { ...state.notes, [groupKey]: notes } });
  }

  function close(reason: string, afterHide?: () => void): void {
    if (!state.open) {
      return;
    }

    log('paste', `closed · ${reason}`);
    clearTimer();
    window.setClickThrough(true);
    move({ ...state, open: false });
    timer = setTimeout(() => {
      window.hide();
      afterHide?.();
    }, CLOSE_FADE_MS);
  }

  function requestPage(groupKey: string, page: number) {
    return requestNotes({
      page,
      size: NOTES_PAGE_SIZE,
      sortBy: 'createdAt',
      isAscending: false,
      noteGroupId: groupKey === RECENT_GROUP_KEY ? undefined : groupKey,
    });
  }

  // INFO: (serhat) a group is refreshed once per open: a second refresh would put the first page
  // back in place of the pages scrolled in since. Recent stays at its first page.
  async function loadNotes(groupKey: string, openId: number): Promise<void> {
    if (refreshed[groupKey] === openId) {
      return;
    }
    refreshed[groupKey] = openId;

    const cached = state.notes[groupKey];
    if (!cached) {
      setNotes(groupKey, { load: 'loading', items: [], hasMore: false });
    }

    try {
      const { result } = await requestPage(groupKey, FIRST_PAGE);
      if (state.openId !== openId) {
        return;
      }
      pages[groupKey] = FIRST_PAGE + 1;
      setNotes(groupKey, {
        load: 'ready',
        items: toPasteNotes(result.content, sources),
        hasMore: groupKey !== RECENT_GROUP_KEY && !result.isLastPage,
      });
    } catch (error) {
      log('error', `paste notes failed · ${toErrorResponse(error).errorMessage}`);
      if (state.openId === openId && !cached) {
        delete refreshed[groupKey];
        setNotes(groupKey, { load: 'error', items: [], hasMore: false });
      }
    }
  }

  async function loadMore(groupKey: string, openId: number): Promise<void> {
    const current = state.notes[groupKey];
    if (!current?.hasMore || loadingMore.has(groupKey)) {
      return;
    }

    loadingMore.add(groupKey);
    try {
      const page = pages[groupKey] ?? FIRST_PAGE + 1;
      const { result } = await requestPage(groupKey, page);
      const latest = state.notes[groupKey];
      if (state.openId !== openId || !latest) {
        return;
      }

      const known = new Set(latest.items.map((item) => item.id));
      const added = toPasteNotes(result.content, sources).filter((item) => !known.has(item.id));
      pages[groupKey] = page + 1;
      setNotes(groupKey, {
        load: 'ready',
        items: [...latest.items, ...added],
        hasMore: !result.isLastPage,
      });
    } catch (error) {
      log('error', `paste notes failed · ${toErrorResponse(error).errorMessage}`);
    } finally {
      loadingMore.delete(groupKey);
    }
  }

  async function load(openId: number): Promise<void> {
    const hasCache = state.load === 'ready';

    try {
      const [groups, sourcePage] = await Promise.all([
        requestNoteGroups({}),
        requestSources({ page: FIRST_PAGE, size: SOURCES_PAGE_SIZE }),
      ]);
      if (state.openId !== openId) {
        return;
      }

      sources = toSourceMap(sourcePage.result.content);
      await loadNotes(RECENT_GROUP_KEY, openId);
      if (state.openId !== openId) {
        return;
      }

      const recentCount = state.notes[RECENT_GROUP_KEY]?.items.length ?? 0;
      const fresh = [toRecentGroup(recentCount), ...groups.result.map(toPasteGroup)];

      // INFO: (serhat) the groups panel never changes size while it is up: a refresh that lands
      // on an open menu waits for the next open.
      if (hasCache) {
        pendingGroups = fresh;
      } else {
        move({ ...state, load: 'ready', groups: fresh });
      }
      groups.result.slice(0, PREFETCH_GROUP_COUNT).forEach((group) => loadNotes(group.id, openId));
    } catch (error) {
      const failure = toErrorResponse(error);
      log('error', `paste menu failed · ${failure.status} · ${failure.errorMessage}`);
      if (state.openId !== openId) {
        return;
      }

      // INFO: (serhat) signed out with nothing cached: the pill instead of the menu, as the HUD
      // does for Sign in to save.
      if (failure.status === 401) {
        close('signed out');
        pendingGroups = null;
        move({ ...CLOSED_STATE, openId: state.openId });
        hud.showResult({
          icon: 'alert',
          look: 'warning',
          title: 'Sign in to paste',
          caption: 'Open WispNote from the menu bar',
        });
        return;
      }
      if (!hasCache) {
        move({ ...state, load: 'error' });
      }
    }
  }

  function open(caret: TCaretRect | null): void {
    clearTimer();

    const openId = state.openId + 1;
    const placement = window.place(caret);
    log('paste', `open · at the ${caret ? 'caret' : 'pointer'}`);

    const groups = pendingGroups ?? state.groups;
    pendingGroups = null;
    move({ ...state, ...placement, open: true, openId, groups });
    window.takeKeyboard();
    load(openId);
  }

  async function sendPaste(text: string): Promise<void> {
    try {
      const result = await engine.request<TPasteResult>('paste', { text });
      log('result', `paste · ${result.pasted ? 'posted' : 'failed'}`);
      if (!result.pasted) {
        hud.showResult({ icon: 'alert', look: 'warning', title: 'Could not paste', caption: '' });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      log('error', `paste failed: ${message}`);
      hud.showResult({
        icon: 'alert',
        look: 'warning',
        title: 'Could not paste',
        caption: message,
      });
    }
  }

  function paste(groupKey: string, noteId: string): void {
    const note = state.notes[groupKey]?.items.find((item) => item.id === noteId);
    if (!note || !state.open) {
      return;
    }

    close('paste', () => {
      timer = setTimeout(() => sendPaste(note.text), KEYBOARD_RETURN_MS);
    });
  }

  function handleIntent(intent: TQuickPasteIntent): void {
    switch (intent.type) {
      case 'focusGroup':
        if (state.open) {
          loadNotes(intent.groupKey, state.openId);
        }
        break;

      case 'loadMore':
        if (state.open) {
          loadMore(intent.groupKey, state.openId);
        }
        break;

      case 'paste':
        paste(intent.groupKey, intent.noteId);
        break;

      case 'pointer':
        window.setClickThrough(!state.open || !intent.inside);
        break;

      case 'retry':
        if (state.open) {
          move({ ...state, load: 'loading' });
          load(state.openId);
        }
        break;

      case 'close':
        close('esc');
        break;

      default:
        break;
    }
  }

  function isOpen(): boolean {
    return state.open;
  }

  window.onBlur(() => close('click away'));

  return { open, close, isOpen, handleIntent };
}
