import { QueryClientProvider } from '@tanstack/react-query';

import createQueryClientInstance from 'configs/queryClient';

import { TAllContextProviderProps } from './AllContextProvider.types';
import ThemeProvider from './ThemeProvider';
import AntdProvider from './AntdProvider';

export const queryClient = createQueryClientInstance();

function AllContextProvider({ children, colorScheme = 'system' }: TAllContextProviderProps) {
  return (
    <ThemeProvider colorScheme={colorScheme}>
      <AntdProvider colorScheme={colorScheme}>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </AntdProvider>
    </ThemeProvider>
  );
}

export default AllContextProvider;
