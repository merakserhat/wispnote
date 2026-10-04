const authQueryKeys = {
  all: ['auth'] as const,
  member: () => [...authQueryKeys.all, 'member'] as const,
};

export default authQueryKeys;
