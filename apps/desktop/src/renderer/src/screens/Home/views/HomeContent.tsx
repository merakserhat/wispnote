import Text from 'components/core/Text';

import { useNavigation } from 'context/NavigationProvider';
import { getLabelByNavItem } from 'enums/NavItem';

import { ContentContainer, ContentHeader } from '../Home.styles';
import { THomeContentProps } from '../Home.types';

function HomeContent({ member }: THomeContentProps) {
  const { activeItem } = useNavigation();

  return (
    <ContentContainer>
      <ContentHeader>
        <Text variant="heading">{getLabelByNavItem(activeItem)}</Text>
        <Text variant="body" color="textSecondary">
          {member.email}
        </Text>
      </ContentHeader>
      <Text variant="body" color="textSecondary">
        Nothing here yet - this screen is next.
      </Text>
    </ContentContainer>
  );
}

export default HomeContent;
