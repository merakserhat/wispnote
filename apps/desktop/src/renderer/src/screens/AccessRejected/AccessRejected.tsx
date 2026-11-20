import { getRouteApi, useNavigate } from '@tanstack/react-router';

import { SlashCircle01Icon } from 'components/Icons';
import InformationPage from 'components/InformationPage';

import AccessRejectedDescription from './views/AccessRejectedDescription';

const routeApi = getRouteApi('/auth-layout/access-rejected');

function AccessRejected() {
  const { email } = routeApi.useSearch();
  const navigate = useNavigate();

  function handleBackToSignIn() {
    navigate({ to: '/sign-in' });
  }

  return (
    <InformationPage
      icon={SlashCircle01Icon}
      tone="error"
      title="Account not approved"
      description={<AccessRejectedDescription email={email} />}
      secondaryButton={{ label: 'Back to sign in', onPress: handleBackToSignIn }}
    />
  );
}

export default AccessRejected;
