import React from 'react';

import { TCaptureContext } from 'shared/types/capture.types';
import { TEngineAction } from 'shared/types/engine.types';
import { TPanelMode, TPanelPayload } from 'shared/types/ipc.types';

export type TPanelAction = {
  action: TEngineAction;
  label: string;
  primary?: boolean;
  disabled?: boolean;
};

export type TPanelHooksReturn = {
  payload: TPanelPayload | null;
  mode: TPanelMode;
  actions: TPanelAction[];
  noteText: string;
  pendingAction: TEngineAction | null;
  setNoteText: (text: string) => void;
  onAction: (action: TEngineAction) => void;
  onNoteKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => void;
};

export type TActionButtonProps = TPanelAction & {
  loading?: boolean;
  onAction: (action: TEngineAction) => void;
};

export type TCaptureHeaderProps = {
  context: TCaptureContext;
};

export type TNoteFieldProps = {
  value: string;
  onChange: (value: string) => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
};
