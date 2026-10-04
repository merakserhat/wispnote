import Box from 'components/core/Box';
import Text from 'components/core/Text';

import { TSettingsSectionProps } from '../Settings.types';

function SettingsSection({ title, children }: TSettingsSectionProps) {
  return (
    <Box gap="sm">
      <Text variant="label" color="textTertiary">
        {title}
      </Text>
      {children}
    </Box>
  );
}

export default SettingsSection;
