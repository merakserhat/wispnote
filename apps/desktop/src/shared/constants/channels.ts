export const IPC_CHANNELS = {
  hudState: 'hud:state',
  hudIntent: 'hud:intent',
  apiRequest: 'api:request',
  sessionExpired: 'auth:session-expired',
  signOut: 'auth:sign-out',
  googleSignIn: 'auth:google-sign-in',
  googleSignInCancel: 'auth:google-sign-in-cancel',
  settingsGet: 'settings:get',
  settingsSet: 'settings:set',
  settingsChanged: 'settings:changed',
} as const;

export type TIpcChannel = (typeof IPC_CHANNELS)[keyof typeof IPC_CHANNELS];
