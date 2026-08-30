import AllContextProvider from 'context/AllContextProvider';

import { TChildrenOnly } from 'types/common';

function App({ children }: TChildrenOnly) {
  return <AllContextProvider>{children}</AllContextProvider>;
}

export default App;
