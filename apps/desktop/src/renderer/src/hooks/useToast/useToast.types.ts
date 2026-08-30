import { TToastPayload } from 'shared/types/ipc.types';

export type TUseToastReturn = {
  toast: TToastPayload | null;
  visible: boolean;
};
