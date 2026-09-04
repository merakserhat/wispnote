import { useState } from 'react';

import Text from 'components/core/Text';

import { ContentContainer, ContentHeader, HomeContainer } from './Home.styles';
import { THomeProps, TNavItemKey } from './Home.types';
import Sidebar from './views/Sidebar';

function Home({ member }: THomeProps) {
  const [activeKey, setActiveKey] = useState<TNavItemKey>('notes');

  return (
    <HomeContainer>
      <Sidebar activeKey={activeKey} onSelect={setActiveKey} />
      <ContentContainer>
        <ContentHeader>
          <Text variant="heading">Welcome back</Text>
          <Text variant="body" color="textSecondary">
            {member.email}
          </Text>
        </ContentHeader>
        <Text variant="body" color="textSecondary">
          Nothing here yet - captured highlights will show up on this screen.
        </Text>
      </ContentContainer>
    </HomeContainer>
  );
}

export default Home;
