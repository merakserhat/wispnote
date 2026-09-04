const API_ENDPOINT = {
  REGISTER: '/v1/register',
  LOGIN: '/v1/login',
  REFRESH_TOKEN: '/v1/refresh',
  MEMBERS_ME: '/v1/members/me',
  NOTES: '/v1/notes',
  NOTE_DETAIL: '/v1/notes/{noteId}',
  SOURCES: '/v1/sources',
} as const;

export default API_ENDPOINT;
