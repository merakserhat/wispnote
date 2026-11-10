import React from 'react';

import { TIconComponent } from 'components/Icons';

import {
  TCaptureHudCapture,
  TCaptureHudIcon,
  TCaptureHudLook,
  TCaptureHudPhase,
  TCaptureHudState,
} from 'shared/types/captureHud.types';
import { TThemePrimitiveKey } from 'theme/theme.types';

export type TPillContent = {
  icon: TCaptureHudIcon;
  look: TCaptureHudLook;
  title: string;
  caption: string;
};

export type TCaptureHudView = {
  state: TCaptureHudState;
  prev: TCaptureHudPhase;
  pill: TPillContent;
  sourceOpen: boolean;
};

export type TGeometry = {
  width: number;
  height: number;
  radius: number;
};

export type TLookColors = {
  background: TThemePrimitiveKey;
  color: TThemePrimitiveKey;
};

export type TVisibility = 'visible' | 'hidden';

export type TPointerEvents = 'auto' | 'none';

export type TMotionStyleProps = {
  $transition?: string;
  $transform?: string;
  $transformOrigin?: string;
  $visibility?: TVisibility;
  $pointerEvents?: TPointerEvents;
};

export type TDiscStyleProps = {
  $look: TCaptureHudLook;
};

export type TCheckPathStyleProps = {
  $offset: number;
  $transition: string;
};

export type TShapeMotion = {
  left: number;
  width: number;
  height: number;
  radius: number;
  opacity: number;
  pointerEvents: TPointerEvents;
  transition: string;
};

export type TCardMotion = {
  opacity: number;
  visibility: TVisibility;
  transform: string;
  transition: string;
};

export type TSourceMotion = {
  height: number;
  opacity: number;
  transition: string;
};

export type TPillMotion = {
  opacity: number;
  visibility: TVisibility;
  transition: string;
  checkOffset: number;
  checkTransition: string;
};

export type TSatelliteMotion = {
  rotation: number;
  radius: number;
  scale: number;
  opacity: number;
  visibility: TVisibility;
  pointerEvents: TPointerEvents;
  radiusTransition: string;
  angleTransition: string;
};

export type TOrbitMotion = {
  opacity: number;
  transform: string;
  transition: string;
};

export type TCaptureHudHooksReturn = {
  view: TCaptureHudView;
  draft: string;
  growth: number;
  noteRef: React.RefObject<HTMLTextAreaElement>;
  onNoteChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onNoteKeyDown: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onSync: () => void;
  onOpenNotes: () => void;
};

export type THudCardProps = {
  capture: TCaptureHudCapture | null;
  motion: TCardMotion;
  source: TSourceMotion;
  draft: string;
  growth: number;
  noteRef: React.RefObject<HTMLTextAreaElement>;
  onNoteChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onNoteKeyDown: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
};

export type THudSourceRowProps = {
  capture: TCaptureHudCapture | null;
  motion: TSourceMotion;
};

export type THudPillProps = {
  pill: TPillContent;
  motion: TPillMotion;
};

export type THudSatelliteProps = {
  motion: TSatelliteMotion;
  icon: TIconComponent;
  label: string;
  keyLabel: string;
  onPress: () => void;
};

export type THudOrbitProps = {
  motion: TOrbitMotion;
};

export type TKeyHintProps = {
  keyLabel: string;
  label?: string;
};
