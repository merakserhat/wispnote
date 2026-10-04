import styled from 'styled-components';

export const SourcesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: ${({ theme }) => theme.space.sm}px;
`;

export const GroupHeader = styled.div`
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space.sm}px;
  padding-top: ${({ theme }) => theme.space.s}px;

  &:first-child {
    padding-top: 0;
  }
`;
