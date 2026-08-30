import styled from 'styled-components';

export const HudRoot = styled.div<{ $visible: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  padding: 0 16px;
  gap: 2px;
  cursor: default;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transition: opacity 140ms ease-out;
`;
