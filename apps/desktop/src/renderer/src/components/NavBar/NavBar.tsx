import Box from 'components/core/Box';
import Text from 'components/core/Text';
import { Logout01Icon, WispLogoIcon } from 'components/Icons';

import { useLogout } from 'api/auth';

import { NAV_BAR_FOOTER_ITEMS, NAV_BAR_ITEMS } from './NavBar.constants';
import { StyledNavBar } from './NavBar.styles';
import { TNavBarProps } from './NavBar.types';
import NavBarItem from './views/NavBarItem';
import NavBarNavItem from './views/NavBarNavItem';

function NavBar({ email }: TNavBarProps) {
  const { logout } = useLogout();

  function handleSignOut() {
    logout();
  }

  return (
    <StyledNavBar>
      <Box flexDirection="row" alignItems="center" gap="s" px="sm" pb="ml">
        <WispLogoIcon width={22} height={22} strokeWidth={2.2} iconColor="textPrimary" />
        <Text variant="title">WispNote</Text>
      </Box>
      <Box flex={1} gap="xs">
        {NAV_BAR_ITEMS.map((item) => (
          <NavBarNavItem key={item} item={item} />
        ))}
      </Box>
      <Box gap="xxs">
        <Box px="sm" pt="s" pb="xs">
          <Text variant="caption" color="textTertiary" numberOfLines={1}>
            {email}
          </Text>
        </Box>
        {NAV_BAR_FOOTER_ITEMS.map((item) => (
          <NavBarNavItem key={item} item={item} size="small" />
        ))}
        <NavBarItem label="Sign out" icon={Logout01Icon} size="small" onPress={handleSignOut} />
      </Box>
    </StyledNavBar>
  );
}

export default NavBar;
