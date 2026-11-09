import { Navigate, Outlet } from '@tanstack/react-router';

import Box from 'components/core/Box';
import NavBar from 'components/NavBar';

import { useGetMember } from 'api/auth';

function MainLayout() {
  const { data: member } = useGetMember();

  if (!member) {
    return <Navigate to="/sign-in" replace />;
  }

  return (
    <Box flexDirection="row" height="100%">
      <NavBar email={member.email} />
      <Box
        flex={1}
        minWidth={0}
        mt="sm"
        mr="sm"
        mb="sm"
        pt="xxl"
        px="xxl"
        pb="xxxl"
        borderWidth={1}
        borderStyle="solid"
        borderColor="borderDivider"
        borderRadius={12}
        backgroundColor="backgroundTertiary"
        overflowY="auto">
        <Outlet />
      </Box>
    </Box>
  );
}

export default MainLayout;
