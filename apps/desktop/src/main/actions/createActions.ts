import { TCaptureContext } from 'shared/types/capture.types';
import { TCaptureHudIntent } from 'shared/types/captureHud.types';
import {
  TEngineAction,
  TPdfAnnotation,
  TPdfAnnotationsResult,
  TPdfLocateResult,
  TTriggerFrame,
} from 'shared/types/engine.types';

import { requestCreateNote } from '../api/notes';
import { describeCapture, log, previewSelection, toCaptureContext } from '../helpers';
import { VERBOSE } from '../main.constants';

import {
  describeSource,
  errorMessage,
  hasContent,
  toCreateNoteParams,
  toDoneResult,
  toImportedNoteParams,
  toProblemResult,
  toSaveFailureResult,
  toWorkingResult,
} from './actions.helpers';
import {
  NOT_A_PDF_RESULT,
  NOTHING_TO_SAVE_RESULT,
  PDF_REQUEST_TIMEOUT_MS,
  PDF_UNAVAILABLE_RESULT,
  REVERSIBLE_ACTIONS,
} from './createActions.constants';
import { TActions, TCreateActionsParams, TSaveCaptureParams } from './createActions.types';

// INFO: (serhat) engine triggers and HUD intents both land here, so a ⌃⇧ gesture and a key in the HUD share one path.
// Every path ends in a Result pill: a save with no feedback looks like a dead shortcut.
export function createActions({ engine, hud, mainWindow }: TCreateActionsParams): TActions {
  async function locateInPdf(context: TCaptureContext): Promise<TPdfLocateResult | null> {
    const isLocalPdf = context.sourceKind === 'pdf' && Boolean(context.filePath);
    if (!isLocalPdf || !context.selectedText.trim() || !engine.ready?.pdf) {
      return null;
    }

    try {
      return await engine.request<TPdfLocateResult>(
        'pdf_locate',
        {
          file_path: context.filePath,
          text: context.selectedText,
          page_hint: context.pageNumber ?? null,
        },
        PDF_REQUEST_TIMEOUT_MS
      );
    } catch (error) {
      log('error', `pdf_locate failed: ${errorMessage(error)}`);
      return null;
    }
  }

  async function saveCapture({ context, userNote }: TSaveCaptureParams): Promise<void> {
    if (!hasContent(context, userNote)) {
      hud.showResult(NOTHING_TO_SAVE_RESULT);
      return;
    }

    // INFO: (serhat) the pill's text only fades in after 170ms, so a fast save never shows this.
    hud.showResult(
      toWorkingResult(userNote ? 'Saving note…' : 'Saving highlight…', describeSource(context))
    );

    const located = await locateInPdf(context);

    try {
      const { result } = await requestCreateNote(
        toCreateNoteParams({ context, userNote, located })
      );
      log(
        'result',
        `saved ${result.kind.toLowerCase()} ${result.id} · ${describeCapture(context)}`
      );
      hud.reportResult(
        toDoneResult(userNote ? 'Note saved' : 'Highlight saved', describeSource(context))
      );
    } catch (error) {
      const failure = toSaveFailureResult(error);
      log('error', `save failed · ${failure.title} · ${errorMessage(error)}`);
      hud.reportResult(failure);
    }
  }

  async function importAnnotation(
    context: TCaptureContext,
    annotation: TPdfAnnotation
  ): Promise<boolean> {
    try {
      await requestCreateNote(toImportedNoteParams({ context, annotation }));
      return true;
    } catch (error) {
      log('error', `import failed on p.${annotation.page_number} · ${errorMessage(error)}`);
      return false;
    }
  }

  async function syncSource(context: TCaptureContext): Promise<void> {
    if (context.sourceKind !== 'pdf' || !context.filePath) {
      hud.showResult(NOT_A_PDF_RESULT);
      return;
    }
    if (!engine.ready?.pdf) {
      hud.showResult(PDF_UNAVAILABLE_RESULT);
      return;
    }

    hud.showResult(toWorkingResult('Syncing PDF…', describeSource(context)));

    let annotations: TPdfAnnotation[];
    try {
      const result = await engine.request<TPdfAnnotationsResult>(
        'pdf_annotations',
        { file_path: context.filePath },
        PDF_REQUEST_TIMEOUT_MS
      );
      annotations = result.annotations;
    } catch (error) {
      log('error', `pdf_annotations failed: ${errorMessage(error)}`);
      hud.reportResult(toProblemResult('Could not read the PDF', errorMessage(error)));
      return;
    }

    if (annotations.length === 0) {
      hud.reportResult(toProblemResult('No highlights found in this PDF', describeSource(context)));
      return;
    }

    // INFO: (serhat) the backend has no dedupe on externalId yet - re-syncing a book imports it again.
    log('result', `importing ${annotations.length} highlights from ${context.filePath}`);

    const outcomes = await annotations.reduce<Promise<boolean[]>>(async (previous, annotation) => {
      const done = await previous;
      return [...done, await importAnnotation(context, annotation)];
    }, Promise.resolve([]));

    const imported = outcomes.filter(Boolean).length;
    const title = `Imported ${imported} of ${annotations.length} highlights`;
    hud.reportResult(
      imported > 0
        ? toDoneResult(title, describeSource(context))
        : toProblemResult(title, describeSource(context))
    );
  }

  // INFO: (serhat) a typed note is never lost silently: the card stays up behind the main window
  // until esc or ↩, the same rule as a click away.
  function openNotes(): void {
    if (!hud.hasNote()) {
      hud.dismiss();
    }
    mainWindow.show();
  }

  async function perform(action: TEngineAction, context: TCaptureContext): Promise<void> {
    switch (action) {
      case 'quick_highlight':
        await saveCapture({ context, userNote: '' });
        break;

      case 'sync_source':
        await syncSource(context);
        break;

      case 'open_notes':
        openNotes();
        break;

      default:
        log('trigger', `nothing to do for ${action}`);
    }
  }

  // INFO: (serhat) nothing is hidden when a double tap takes a tap back: the Basic card the tap
  // opened morphs into the Result pill of the action that replaces it.
  function undoSuperseded(frame: TTriggerFrame): boolean {
    if (!frame.supersedes) {
      return true;
    }

    const { trigger, action } = frame.supersedes;
    if (!REVERSIBLE_ACTIONS.includes(action)) {
      log('trigger', `${frame.trigger} ignored · ${trigger} → ${action} already happened`);
      return false;
    }

    return true;
  }

  async function handleTrigger(frame: TTriggerFrame): Promise<void> {
    log('trigger', `${frame.trigger} → ${frame.action}`);
    if (!undoSuperseded(frame)) {
      return;
    }
    if (VERBOSE) {
      const context = toCaptureContext(frame.context);
      log('capture', describeCapture(context));
      log('capture', previewSelection(context));
    }

    // INFO: (serhat) the mirror gesture opens Basic too until it gets a job of its own.
    if (frame.action === 'show_panel' || frame.action === 'quick_note') {
      hud.open(frame);
      return;
    }

    await perform(frame.action, toCaptureContext(frame.context));
  }

  // INFO: (serhat) the HUD echoes back the capture it was opened with instead of taking a new one:
  // by now WispNote has the keyboard, so a fresh capture would describe the wrong window.
  async function runIntent(intent: TCaptureHudIntent): Promise<void> {
    const raw = hud.getContext();
    const phase = hud.getPhase();
    const isOpen = phase === 'basic' || phase === 'detailed';

    switch (intent.type) {
      case 'save':
        if (raw && isOpen) {
          await saveCapture({ context: toCaptureContext(raw), userNote: intent.note.trim() });
        }
        break;

      case 'sync':
        if (raw && phase === 'detailed') {
          await syncSource(toCaptureContext(raw));
        }
        break;

      case 'openNotes':
        if (phase === 'detailed') {
          openNotes();
        }
        break;

      default:
        hud.handleIntent(intent);
    }
  }

  engine.on('trigger', handleTrigger);

  return { runIntent };
}
