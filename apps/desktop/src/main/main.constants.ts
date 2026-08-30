import path from 'path';

// TODO: Take this from the environment variable
export const PYTHON_APP = path.resolve(__dirname, '../../../wispnote-app');

export const ENGINE_HEARTBEAT_SECONDS = '2';

export const VERBOSE = Boolean(process.env.WISPNOTE_VERBOSE);
