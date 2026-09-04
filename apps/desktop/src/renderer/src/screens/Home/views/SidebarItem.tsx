import Text from 'components/core/Text';

import { TSidebarItemProps } from '../Home.types';
import { SidebarButton } from '../Home.styles';

function SidebarItem({ item, isActive, onSelect }: TSidebarItemProps) {
  function handleSelect() {
    onSelect(item.key);
  }

  return (
    <SidebarButton type="button" $isActive={isActive} onClick={handleSelect}>
      <Text variant="subtitle" color={isActive ? 'textPrimary' : 'textSecondary'}>
        {item.label}
      </Text>
    </SidebarButton>
  );
}

export default SidebarItem;
