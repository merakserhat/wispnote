const API_ENDPOINT = {
  REGISTER: '/v1/register',
  LOGIN: '/v1/login',
  REFRESH_TOKEN: '/v1/refresh',
  MEMBERS_ME: '/v1/members/me',
  NOTES: '/v1/notes',
  NOTE_DETAIL: '/v1/notes/{noteId}',
  SOURCES: '/v1/sources',
  NOTE_GROUPS: '/v1/note-groups',
  NOTE_GROUP_DETAIL: '/v1/note-groups/{noteGroupId}',
  NOTE_GROUP_NOTES: '/v1/note-groups/{noteGroupId}/notes',
  NOTE_GROUP_NOTE_DETAIL: '/v1/note-groups/{noteGroupId}/notes/{noteId}',
  AUTOMATIONS: '/v1/automations',
  AUTOMATION_DETAIL: '/v1/automations/{automationId}',
  AUTOMATION_SUGGESTIONS: '/v1/automations/suggestions',
} as const;

export default API_ENDPOINT;
