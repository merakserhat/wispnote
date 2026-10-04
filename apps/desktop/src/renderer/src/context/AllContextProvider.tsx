import { QueryClientProvider } from '@tanstack/react-query';

import createQueryClientInstance from 'configs/queryClient';

import { TAllContextProviderProps } from './AllContextProvider.types';
import AppearanceProvider from './AppearanceProvider';
import ThemeProvider from './ThemeProvider';
import AntdProvider from './AntdProvider';

export const queryClient = createQueryClientInstance();

function AllContextProvider({ children, colorScheme, paletteId }: TAllContextProviderProps) {
  return (
    <AppearanceProvider colorScheme={colorScheme} paletteId={paletteId}>
      <ThemeProvider>
        <AntdProvider>
          <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </AntdProvider>
      </ThemeProvider>
    </AppearanceProvider>
  );
}

export default AllContextProvider;
