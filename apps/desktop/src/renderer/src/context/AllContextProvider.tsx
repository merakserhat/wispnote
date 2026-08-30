import { TChildrenOnly } from 'types/common';

import ThemeProvider from './ThemeProvider';
import AntdProvider from './AntdProvider';

function AllContextProvider({ children }: TChildrenOnly) {
  return (
    <ThemeProvider>
      <AntdProvider>{children}</AntdProvider>
    </ThemeProvider>
  );
}

export default AllContextProvider;
