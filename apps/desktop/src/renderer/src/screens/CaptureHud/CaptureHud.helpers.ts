import { TCaptureContext } from 'shared/types/capture.types';
import { TCaptureHudPhase, TCaptureHudState } from 'shared/types/captureHud.types';

import {
  CHECK_LENGTH,
  EASE,
  GEOMETRY,
  ORBIT_RADIUS,
  SHAPE_CENTER_X,
  SOURCE_ROW_HEIGHT,
} from './CaptureHud.constants';
import {
  TCaptureHudView,
  TCardMotion,
  TOrbitMotion,
  TPillContent,
  TPillMotion,
  TSatelliteMotion,
  TShapeMotion,
  TSourceMotion,
} from './CaptureHud.types';

const SHAPE_PROPERTIES = ['width', 'height', 'left', 'border-radius'];

export function isOpenPhase(phase: TCaptureHudPhase): boolean {
  return phase === 'basic' || phase === 'detailed';
}

export function isPillPhase(phase: TCaptureHudPhase): boolean {
  return phase === 'result';
}

export function toPillContent(state: TCaptureHudState, fallback: TPillContent): TPillContent {
  if (state.phase === 'result' && state.result) {
    return state.result;
  }
  return fallback;
}

export function toView(current: TCaptureHudView, next: TCaptureHudState): TCaptureHudView {
  return {
    state: next,
    prev: current.state.phase,
    pill: toPillContent(next, current.pill),
    sourceOpen: isOpenPhase(next.phase) ? next.phase === 'detailed' : current.sourceOpen,
  };
}

function shapeTransition(duration: number, ease: string, opacity: string): string {
  return [
    ...SHAPE_PROPERTIES.map((property) => `${property} ${duration}ms ${ease}`),
    `opacity ${opacity}`,
  ].join(', ');
}

export function getShapeMotion(
  phase: TCaptureHudPhase,
  prev: TCaptureHudPhase,
  growth: number
): TShapeMotion {
  const { width, height, radius } = GEOMETRY[phase];
  const open = isOpenPhase(phase);
  const geometry = {
    left: SHAPE_CENTER_X - width / 2,
    width,
    height: open ? height + growth : height,
    radius,
  };

  if (phase === 'hidden') {
    return {
      ...geometry,
      opacity: 0,
      pointerEvents: 'none',
      transition: shapeTransition(220, EASE.in, '80ms linear 200ms'),
    };
  }

  let duration = 300;
  let ease = EASE.out;
  if (prev === 'hidden') {
    duration = open ? 280 : 260;
    ease = EASE.spring;
  } else if (open && isOpenPhase(prev)) {
    duration = 220;
  } else if (open) {
    duration = 280;
    ease = EASE.spring;
  }

  return {
    ...geometry,
    opacity: 1,
    pointerEvents: 'auto',
    transition: shapeTransition(duration, ease, '60ms linear'),
  };
}

export function getCardMotion(phase: TCaptureHudPhase, prev: TCaptureHudPhase): TCardMotion {
  if (isOpenPhase(phase)) {
    return {
      opacity: 1,
      visibility: 'visible',
      transform: 'translate(-50%, 0px)',
      transition: isOpenPhase(prev)
        ? 'opacity 0ms'
        : `opacity 180ms ${EASE.out} 120ms, transform 260ms ${EASE.out} 100ms, visibility 0ms`,
    };
  }

  return {
    opacity: 0,
    visibility: 'hidden',
    transform: 'translate(-50%, -6px)',
    transition: `opacity 90ms linear, transform 140ms ${EASE.in}, visibility 0ms linear 90ms`,
  };
}

export function getSourceMotion(sourceOpen: boolean, detailed: boolean): TSourceMotion {
  return {
    height: sourceOpen ? SOURCE_ROW_HEIGHT : 0,
    opacity: sourceOpen ? 1 : 0,
    transition: `height 220ms ${EASE.out}, opacity 160ms linear ${detailed ? 60 : 0}ms`,
  };
}

export function getPillMotion(
  phase: TCaptureHudPhase,
  prev: TCaptureHudPhase,
  pill: TPillContent
): TPillMotion {
  const shown = isPillPhase(phase);
  const wasShown = isPillPhase(prev);
  const checkOn = shown && pill.icon === 'check';

  let transition = 'opacity 90ms linear, visibility 0ms linear 90ms';
  if (shown) {
    transition = wasShown ? 'opacity 0ms' : `opacity 160ms ${EASE.out} 170ms, visibility 0ms`;
  }

  return {
    opacity: shown ? 1 : 0,
    visibility: shown ? 'visible' : 'hidden',
    transition,
    checkOffset: checkOn ? 0 : CHECK_LENGTH,
    checkTransition: checkOn
      ? `stroke-dashoffset 260ms ${EASE.out} ${wasShown ? 40 : 220}ms`
      : 'stroke-dashoffset 0ms linear 120ms',
  };
}

export function getSatelliteMotion(
  visible: boolean,
  angle: number,
  index: number
): TSatelliteMotion {
  const drop = 40 + index * 30;
  const fan = 160 + index * 30;

  if (!visible) {
    return {
      rotation: 0,
      radius: 0,
      scale: 0.4,
      opacity: 0,
      visibility: 'hidden',
      pointerEvents: 'none',
      radiusTransition: `transform 220ms ${EASE.in}, opacity 100ms linear 80ms, visibility 0ms linear 220ms`,
      angleTransition: `transform 220ms ${EASE.in}`,
    };
  }

  return {
    rotation: angle,
    radius: ORBIT_RADIUS,
    scale: 1,
    opacity: 1,
    visibility: 'visible',
    pointerEvents: 'auto',
    radiusTransition: `transform 260ms ${EASE.spring} ${drop}ms, opacity 120ms linear ${drop}ms, visibility 0ms`,
    angleTransition: `transform 320ms ${EASE.spring} ${fan}ms`,
  };
}

export function getOrbitMotion(detailed: boolean): TOrbitMotion {
  if (detailed) {
    return {
      opacity: 1,
      transform: 'scale(1)',
      transition: `opacity 240ms linear 120ms, transform 380ms ${EASE.out} 60ms`,
    };
  }

  return {
    opacity: 0,
    transform: 'scale(0.7)',
    transition: `opacity 120ms linear, transform 220ms ${EASE.in}`,
  };
}

export function formatSource(context: TCaptureContext): string {
  return context.sourceTitle || context.appName || 'Unknown source';
}

export function formatLocation(context: TCaptureContext): string {
  return [
    context.pageNumber ? `p. ${context.pageNumber}` : '',
    context.lineNumber ? `line ${context.lineNumber}` : '',
    context.section ?? '',
  ]
    .filter(Boolean)
    .join(' · ');
}

export function formatOrigin(context: TCaptureContext): string {
  return context.url ?? context.filePath ?? '';
}
