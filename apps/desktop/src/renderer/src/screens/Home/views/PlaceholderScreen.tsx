import PageHeader from 'components/PageHeader';

import { useNavigation } from 'context/NavigationProvider';
import { getLabelByNavItem } from 'enums/NavItem';

function PlaceholderScreen() {
  const { activeItem } = useNavigation();

  return (
    <PageHeader
      title={getLabelByNavItem(activeItem)}
      description="Nothing here yet - this screen is next."
    />
  );
}

export default PlaceholderScreen;
