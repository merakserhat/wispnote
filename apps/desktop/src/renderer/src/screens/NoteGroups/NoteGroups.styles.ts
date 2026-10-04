import styled from 'styled-components';

export const NoteGroupsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: ${({ theme }) => theme.space.sm}px;
`;
