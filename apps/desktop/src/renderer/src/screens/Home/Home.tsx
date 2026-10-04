import NavBar from 'components/NavBar';

import NavigationProvider from 'context/NavigationProvider';

import { HomeContainer } from './Home.styles';
import { THomeProps } from './Home.types';
import HomeContent from './views/HomeContent';

function Home({ member }: THomeProps) {
  return (
    <NavigationProvider>
      <HomeContainer>
        <NavBar email={member.email} />
        <HomeContent />
      </HomeContainer>
    </NavigationProvider>
  );
}

export default Home;
