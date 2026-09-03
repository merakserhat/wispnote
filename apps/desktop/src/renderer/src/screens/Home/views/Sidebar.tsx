import Button from 'components/core/Button';

import { useLogout } from 'api/auth';

import { NAV_ITEMS } from '../Home.constants';
import { SidebarContainer, SidebarFooter } from '../Home.styles';
import { TSidebarProps } from '../Home.types';
import SidebarItem from './SidebarItem';

function Sidebar({ activeKey, onSelect }: TSidebarProps) {
  const { logout, isPending } = useLogout();

  function handleSignOut() {
    logout();
  }

  return (
    <SidebarContainer>
      {NAV_ITEMS.map(function renderItem(item) {
        return (
          <SidebarItem
            key={item.key}
            item={item}
            isActive={item.key === activeKey}
            onSelect={onSelect}
          />
        );
      })}
      <SidebarFooter>
        <Button label="Sign out" loading={isPending} onPress={handleSignOut} block />
      </SidebarFooter>
    </SidebarContainer>
  );
}

export default Sidebar;
