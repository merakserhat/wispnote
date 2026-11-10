import styled, { css } from 'styled-components';

import Card from 'components/core/Card';
import { StyledBox } from 'components/core/Box/Box.styles';

import { CHECK_LENGTH, LOOK_COLORS, NOTE_MIN_HEIGHT } from './CaptureHud.constants';
import { TCheckPathStyleProps, TDiscStyleProps, TMotionStyleProps } from './CaptureHud.types';

export const Motion = styled(StyledBox)<TMotionStyleProps>`
  ${({ $transition }) =>
    $transition &&
    css`
      transition: ${$transition};
    `}

  ${({ $transform }) =>
    $transform &&
    css`
      transform: ${$transform};
    `}

  ${({ $transformOrigin }) =>
    $transformOrigin &&
    css`
      transform-origin: ${$transformOrigin};
    `}

  ${({ $visibility }) =>
    $visibility &&
    css`
      visibility: ${$visibility};
    `}

  ${({ $pointerEvents }) =>
    $pointerEvents &&
    css`
      pointer-events: ${$pointerEvents};
    `}
`;

export const Shape = styled(Motion)`
  border-style: solid;
  overflow: hidden;
  box-shadow:
    0 14px 36px ${({ theme }) => theme.colors.shadowTint},
    0 2px 6px ${({ theme }) => theme.colors.shadowTint};
`;

export const SatelliteCard = styled(Card)`
  padding: 0;
  box-shadow: 0 6px 18px ${({ theme }) => theme.colors.shadowTint};
`;

export const Disc = styled(StyledBox)<TDiscStyleProps>`
  background-color: ${({ theme, $look }) => theme.colors[LOOK_COLORS[$look].background]};
  color: ${({ theme, $look }) => theme.colors[LOOK_COLORS[$look].color]};
  transition:
    background-color 200ms ease,
    color 200ms ease;
`;

export const CheckPath = styled.path<TCheckPathStyleProps>`
  stroke-dasharray: ${CHECK_LENGTH};
  stroke-dashoffset: ${({ $offset }) => $offset};
  transition: ${({ $transition }) => $transition};
`;

export const NoteArea = styled.textarea`
  ${({ theme }) => css(theme.textVariants.body)};
  flex-shrink: 0;
  height: ${NOTE_MIN_HEIGHT}px;
  margin: 6px 0 0;
  padding: ${({ theme }) => theme.space.xs}px ${({ theme }) => theme.space.sm}px;
  border: 0;
  border-radius: 0;
  background: transparent;
  outline: none;
  resize: none;
  font-family: inherit;
  color: ${({ theme }) => theme.colors.textPrimary};
  -webkit-user-select: text;

  &::placeholder {
    color: ${({ theme }) => theme.colors.textTertiary};
  }

  &::-webkit-scrollbar {
    display: none;
  }
`;
