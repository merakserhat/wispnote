import styled from 'styled-components';
import { Segmented } from 'antd';

export const StyledSegmented = styled(Segmented)`
  && {
    -webkit-app-region: no-drag;

    .ant-segmented-group {
      gap: ${({ theme }) => theme.space.xxs}px;
    }

    .ant-segmented-item-selected {
      font-weight: 600;
    }
  }
`;
