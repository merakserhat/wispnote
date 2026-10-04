import Box from 'components/core/Box';
import SegmentedControl from 'components/core/SegmentedControl';
import Text from 'components/core/Text';
import PageHeader from 'components/PageHeader';

import { useAppearance } from 'context/AppearanceProvider';
import { palettes } from 'theme/palettes';

import {
  APPEARANCE_DESCRIPTION,
  COLOR_SCHEME_OPTIONS,
  SETTINGS_PAGE_DESCRIPTION,
} from './Settings.constants';
import { PaletteGrid, SettingsRow } from './Settings.styles';
import PaletteCard from './views/PaletteCard';
import SettingsSection from './views/SettingsSection';

function Settings() {
  const { colorScheme, paletteId, setColorScheme, setPaletteId } = useAppearance();

  return (
    <Box gap="xl">
      <PageHeader title="Settings" description={SETTINGS_PAGE_DESCRIPTION} />
      <SettingsSection title="Palette">
        <PaletteGrid>
          {palettes.map((palette) => (
            <PaletteCard
              key={palette.id}
              palette={palette}
              isSelected={palette.id === paletteId}
              onSelect={setPaletteId}
            />
          ))}
        </PaletteGrid>
      </SettingsSection>
      <SettingsSection title="Theme">
        <SettingsRow>
          <Box gap="xxs">
            <Text variant="body">Appearance</Text>
            <Text variant="caption" color="textTertiary">
              {APPEARANCE_DESCRIPTION}
            </Text>
          </Box>
          <SegmentedControl
            options={COLOR_SCHEME_OPTIONS}
            value={colorScheme}
            onChange={setColorScheme}
            size="small"
          />
        </SettingsRow>
      </SettingsSection>
    </Box>
  );
}

export default Settings;
