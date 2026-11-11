import Box from 'components/core/Box';
import Keycap from 'components/core/Keycap';
import Text from 'components/core/Text';

import { SettingsRow } from '../Settings.styles';
import { TShortcutRowProps } from '../Settings.types';

function ShortcutRow({ shortcut }: TShortcutRowProps) {
  return (
    <SettingsRow>
      <Box gap="xxs">
        <Text variant="body">{shortcut.action}</Text>
        <Text variant="caption" color="textTertiary">
          {shortcut.description}
        </Text>
      </Box>
      <Box flexDirection="row" alignItems="center" flexShrink={0} gap="xs">
        <Text variant="caption" color="textTertiary" nowrap>
          Hold
        </Text>
        <Keycap glyph={shortcut.hold.glyph} label={shortcut.hold.label} />
        <Text variant="caption" color="textTertiary" nowrap>
          tap
        </Text>
        <Keycap glyph={shortcut.tap.glyph} label={shortcut.tap.label} />
        {shortcut.isTwice && (
          <Text variant="caption" color="textTertiary" nowrap>
            twice
          </Text>
        )}
      </Box>
    </SettingsRow>
  );
}

export default ShortcutRow;
