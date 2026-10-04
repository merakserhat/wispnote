import Text from 'components/core/Text';

import Auth from 'screens/Auth';
import Home from 'screens/Home';

import { useGetMember } from 'api/auth';

import { useSessionExpiry } from './Main.hooks';
import { LoadingContainer, MainContainer } from './Main.styles';

function Main() {
  useSessionExpiry();

  const { data: member, isLoading } = useGetMember();

  if (isLoading) {
    return (
      <LoadingContainer>
        <Text variant="body" color="textSecondary">
          Loading…
        </Text>
      </LoadingContainer>
    );
  }

  return <MainContainer>{member ? <Home member={member} /> : <Auth />}</MainContainer>;
}

export default Main;
