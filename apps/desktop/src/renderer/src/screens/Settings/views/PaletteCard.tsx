import Box from 'components/core/Box';
import Card from 'components/core/Card';
import Text from 'components/core/Text';

import { Swatch, SwatchStrip } from '../Settings.styles';
import { TPaletteCardProps } from '../Settings.types';

function PaletteCard({ palette, isSelected, onSelect }: TPaletteCardProps) {
  function handlePress() {
    onSelect(palette.id);
  }

  return (
    <Card
      variant="outlined"
      p="sm"
      gap="s"
      borderColor={isSelected ? 'textPrimary' : 'borderDivider'}
      onPress={handlePress}>
      <SwatchStrip>
        {palette.swatch.map((color) => (
          <Swatch key={color} $color={color} />
        ))}
      </SwatchStrip>
      <Box flexDirection="row" alignItems="center" justifyContent="space-between" gap="s">
        <Text variant="bodySubBold" numberOfLines={1}>
          {palette.name}
        </Text>
        {isSelected && (
          <Text variant="caption" color="textTertiary">
            Selected
          </Text>
        )}
      </Box>
    </Card>
  );
}

export default PaletteCard;
