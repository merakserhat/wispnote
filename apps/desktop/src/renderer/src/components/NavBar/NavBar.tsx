import Text from 'components/core/Text';
import { Logout01Icon, WispLogoIcon } from 'components/Icons';

import { useLogout } from 'api/auth';

import { NAV_BAR_FOOTER_ITEMS, NAV_BAR_ITEMS } from './NavBar.constants';
import { StyledAccount, StyledBrand, StyledNavBar, StyledNavBarFooter } from './NavBar.styles';
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
      <StyledBrand>
        <WispLogoIcon width={22} height={22} strokeWidth={2.2} iconColor="textPrimary" />
        <Text variant="title">WispNote</Text>
      </StyledBrand>
      {NAV_BAR_ITEMS.map((item) => (
        <NavBarNavItem key={item} item={item} />
      ))}
      <StyledNavBarFooter>
        <StyledAccount>
          <Text variant="caption" color="textTertiary" numberOfLines={1}>
            {email}
          </Text>
        </StyledAccount>
        {NAV_BAR_FOOTER_ITEMS.map((item) => (
          <NavBarNavItem key={item} item={item} size="small" />
        ))}
        <NavBarItem label="Sign out" icon={Logout01Icon} size="small" onPress={handleSignOut} />
      </StyledNavBarFooter>
    </StyledNavBar>
  );
}

export default NavBar;
