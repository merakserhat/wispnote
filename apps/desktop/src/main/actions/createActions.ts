import { TCaptureContext } from 'shared/types/capture.types';
import {
  TEngineAction,
  TPdfAnnotation,
  TPdfAnnotationsResult,
  TPdfLocateResult,
  TTriggerFrame,
} from 'shared/types/engine.types';
import { TActionRequest } from 'shared/types/ipc.types';

import { requestCreateNote } from '../api/notes';
import { describeCapture, log, previewSelection, toCaptureContext } from '../helpers';
import { VERBOSE } from '../main.constants';

import {
  describeSource,
  errorMessage,
  hasContent,
  toCreateNoteParams,
  toImportedNoteParams,
  toSaveFailureToast,
} from './actions.helpers';
import {
  NOT_A_PDF_TOAST,
  NOTHING_TO_SAVE_TOAST,
  PDF_REQUEST_TIMEOUT_MS,
  PDF_UNAVAILABLE_TOAST,
} from './createActions.constants';
import {
  TActionResult,
  TActions,
  TCreateActionsParams,
  TSaveCaptureParams,
} from './createActions.types';

// INFO: (serhat) engine triggers and panel IPC both land here, so a double-Fn and a panel button share one path.
export function createActions({
  engine,
  hud,
  panel,
  controller,
  mainWindow,
}: TCreateActionsParams): TActions {
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
      hud.show(NOTHING_TO_SAVE_TOAST);
      return;
    }

    const located = await locateInPdf(context);

    try {
      const { result } = await requestCreateNote(
        toCreateNoteParams({ context, userNote, located })
      );
      log(
        'result',
        `saved ${result.kind.toLowerCase()} ${result.id} · ${describeCapture(context)}`
      );
      hud.show({
        message: userNote ? 'Note saved' : 'Highlight saved',
        detail: describeSource(context),
      });
    } catch (error) {
      const toast = toSaveFailureToast(error);
      log('error', `save failed · ${toast.message} · ${errorMessage(error)}`);
      hud.show(toast);
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
      hud.show(NOT_A_PDF_TOAST);
      return;
    }
    if (!engine.ready?.pdf) {
      hud.show(PDF_UNAVAILABLE_TOAST);
      return;
    }

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
      hud.show({ message: 'Could not read the PDF', detail: errorMessage(error) });
      return;
    }

    if (annotations.length === 0) {
      hud.show({ message: 'No highlights found in this PDF', detail: describeSource(context) });
      return;
    }

    // INFO: (serhat) the backend has no dedupe on externalId yet - re-syncing a book imports it again.
    log('result', `importing ${annotations.length} highlights from ${context.filePath}`);

    const outcomes = await annotations.reduce<Promise<boolean[]>>(async (previous, annotation) => {
      const done = await previous;
      return [...done, await importAnnotation(context, annotation)];
    }, Promise.resolve([]));

    const imported = outcomes.filter(Boolean).length;
    hud.show({
      message: `Imported ${imported} of ${annotations.length} highlights`,
      detail: describeSource(context),
    });
  }

  async function perform(
    action: TEngineAction,
    context: TCaptureContext,
    userNote = ''
  ): Promise<TActionResult> {
    switch (action) {
      case 'quick_highlight':
        await saveCapture({ context, userNote: '' });
        return { accepted: true };

      case 'quick_note':
        await saveCapture({ context, userNote });
        return { accepted: true };

      case 'sync_source':
        await syncSource(context);
        return { accepted: true };

      case 'open_notes':
        mainWindow.show();
        return { accepted: true };

      default:
        return { accepted: false, reason: `nothing to do for ${action}` };
    }
  }

  async function handleTrigger(frame: TTriggerFrame): Promise<void> {
    log('trigger', `${frame.trigger} → ${frame.action}`);
    if (VERBOSE) {
      const context = toCaptureContext(frame.context);
      log('capture', describeCapture(context));
      log('capture', previewSelection(context));
    }

    // INFO: (serhat) the panel needs the raw frame: it echoes the same capture back with the action.
    if (frame.action === 'show_panel' || frame.action === 'quick_note') {
      controller.show(frame);
      return;
    }

    await perform(frame.action, toCaptureContext(frame.context));
  }

  async function runAction(request: TActionRequest): Promise<TActionResult> {
    const raw = controller.getContext();
    panel.hide();

    if (!raw) {
      return { accepted: false, reason: 'no capture to act on' };
    }
    return perform(request.action, toCaptureContext(raw), request.text ?? '');
  }

  engine.on('trigger', handleTrigger);

  return { runAction };
}
