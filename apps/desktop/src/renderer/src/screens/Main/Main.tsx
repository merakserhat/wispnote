import Text from 'components/core/Text';

import Home from 'screens/Home';
import SignIn from 'screens/SignIn';

import { useGetMember } from 'api/auth';

import { useSessionExpiry } from './Main.hooks';
import { LoadingContainer, MainContainer } from './Main.styles';

function Main() {
  useSessionExpiry();

  const { data: member, isLoading } = useGetMember();

  if (isLoading) {
    return (
      <LoadingContainer>
        <Text variant="body" muted>
          Loading…
        </Text>
      </LoadingContainer>
    );
  }

  return <MainContainer>{member ? <Home member={member} /> : <SignIn />}</MainContainer>;
}

export default Main;
