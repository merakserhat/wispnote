import { Outlet } from '@tanstack/react-router';

import ActivityIndicator from 'components/core/ActivityIndicator';
import Box from 'components/core/Box';

import { useGetMember } from 'api/auth';

import { useSessionExpiry } from './RootLayout.hooks';

function RootLayout() {
  useSessionExpiry();

  const { isLoading } = useGetMember();

  if (isLoading) {
    return (
      <Box
        height="100%"
        alignItems="center"
        justifyContent="center"
        backgroundColor="backgroundPrimary">
        <ActivityIndicator color="textTertiary" />
      </Box>
    );
  }

  return (
    <Box height="100%">
      <Outlet />
    </Box>
  );
}

export default RootLayout;
