import { QueryClientProvider } from '@tanstack/react-query';

import createQueryClientInstance from 'configs/queryClient';
import { TChildrenOnly } from 'types/common';

import ThemeProvider from './ThemeProvider';
import AntdProvider from './AntdProvider';

export const queryClient = createQueryClientInstance();

function AllContextProvider({ children }: TChildrenOnly) {
  return (
    <ThemeProvider>
      <AntdProvider>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </AntdProvider>
    </ThemeProvider>
  );
}

export default AllContextProvider;
