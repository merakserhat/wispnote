import { Navigate, Outlet } from '@tanstack/react-router';

import Box from 'components/core/Box';

import { useGetMember } from 'api/auth';

import { AUTH_DRAG_STYLE } from './AuthLayout.constants';

function AuthLayout() {
  const { data: member } = useGetMember();

  if (member) {
    return <Navigate to="/notes" replace />;
  }

  return (
    <Box height="100%" style={AUTH_DRAG_STYLE}>
      <Outlet />
    </Box>
  );
}

export default AuthLayout;
