import styled from 'styled-components';

import { NOTE_GROUP_PICKER_LIST_MAX_HEIGHT } from './NoteGroupPicker.constants';

export const OptionList = styled.div`
  display: flex;
  max-height: ${NOTE_GROUP_PICKER_LIST_MAX_HEIGHT}px;
  flex-direction: column;
  padding: ${({ theme }) => theme.space.xs}px;
  overflow-y: auto;
`;

export const OptionButton = styled.button`
  -webkit-app-region: no-drag;
  display: flex;
  width: 100%;
  align-items: center;
  gap: ${({ theme }) => theme.space.s}px;
  padding: ${({ theme }) => theme.space.s}px;
  border: 0;
  border-radius: 8px;
  background: none;
  font: inherit;
  color: inherit;
  text-align: left;
  cursor: pointer;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.backgroundSecondary};
  }

  &:disabled {
    cursor: default;
    opacity: 0.6;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.borderOutline};
    outline-offset: -2px;
  }
`;
