import Box from 'components/core/Box';
import Text from 'components/core/Text';

import { KEYCAP_SIZE_MAP } from './Keycap.constants';
import { TKeycapProps } from './Keycap.types';

function Keycap({ label, glyph, size = 'medium' }: TKeycapProps) {
  const { height, px, borderRadius, borderBottomWidth, textVariant, textColor, backgroundColor } =
    KEYCAP_SIZE_MAP[size];

  return (
    <Box
      display="inline-flex"
      flexDirection="row"
      alignItems="center"
      justifyContent="center"
      flexShrink={0}
      gap="xs"
      height={height}
      px={px}
      borderWidth={1}
      borderBottomWidth={borderBottomWidth}
      borderStyle="solid"
      borderColor="borderOutline"
      borderRadius={borderRadius}
      backgroundColor={backgroundColor}>
      {Boolean(glyph) && (
        <Text as="span" variant={textVariant} color={textColor} nowrap>
          {glyph}
        </Text>
      )}
      <Text as="span" variant={textVariant} color={textColor} nowrap>
        {label}
      </Text>
    </Box>
  );
}

export default Keycap;
