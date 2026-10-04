import { useNavigation } from 'context/NavigationProvider';

import { HOME_SCREEN_MAP } from '../Home.constants';
import { ContentContainer } from '../Home.styles';

function HomeContent() {
  const { activeItem } = useNavigation();
  const Screen = HOME_SCREEN_MAP[activeItem];

  return (
    <ContentContainer>
      <Screen />
    </ContentContainer>
  );
}

export default HomeContent;
