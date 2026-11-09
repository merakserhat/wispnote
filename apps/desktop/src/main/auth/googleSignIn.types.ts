import type { Server } from 'node:http';

import { TErrorResponse } from 'shared/types/common';

export type TGoogleCallback = {
  code: string;
  redirectUri: string;
};

export type TActiveFlow = {
  server: Server;
  timer: NodeJS.Timeout;
  reject: (error: TErrorResponse) => void;
};
