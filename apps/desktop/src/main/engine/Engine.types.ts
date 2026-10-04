import { TEngineCommand } from 'shared/types/engine.types';

export type TEngineOptions = {
  command: string;
  args: string[];
  cwd: string;
  env: NodeJS.ProcessEnv;
};

export type TPendingRequest = {
  resolve: (value: unknown) => void;
  reject: (error: Error) => void;
};

export type TRequestPayload = Record<string, unknown>;

export type TOutboundMessage = {
  id?: number;
  cmd: TEngineCommand;
} & TRequestPayload;
