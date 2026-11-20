import { getRouteApi, useNavigate } from '@tanstack/react-router';

import { ClockIcon } from 'components/Icons';
import InformationPage from 'components/InformationPage';

import AccessPendingDescription from './views/AccessPendingDescription';

const routeApi = getRouteApi('/auth-layout/access-pending');

function AccessPending() {
  const { email } = routeApi.useSearch();
  const navigate = useNavigate();

  function handleBackToSignIn() {
    navigate({ to: '/sign-in' });
  }

  return (
    <InformationPage
      icon={ClockIcon}
      title="Waiting for approval"
      description={<AccessPendingDescription email={email} />}
      secondaryButton={{ label: 'Back to sign in', onPress: handleBackToSignIn }}
    />
  );
}

export default AccessPending;
