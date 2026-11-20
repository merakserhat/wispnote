import Box from 'components/core/Box';
import Button from 'components/core/Button';
import Text from 'components/core/Text';

import {
  INFORMATION_PAGE_DISC_SIZE,
  INFORMATION_PAGE_ICON_SIZE,
  INFORMATION_PAGE_TONE_MAP,
  INFORMATION_PAGE_WIDTH,
} from './InformationPage.constants';
import { TInformationPageProps } from './InformationPage.types';

function InformationPage({
  title,
  description,
  icon: Icon,
  tone = 'neutral',
  primaryButton,
  secondaryButton,
}: TInformationPageProps) {
  const { backgroundColor, iconColor } = INFORMATION_PAGE_TONE_MAP[tone];
  const hasButtons = Boolean(primaryButton || secondaryButton);

  return (
    <Box
      height="100%"
      alignItems="center"
      justifyContent="center"
      backgroundColor="backgroundPrimary">
      <Box width={INFORMATION_PAGE_WIDTH} alignItems="center">
        {Icon && (
          <Box
            width={INFORMATION_PAGE_DISC_SIZE}
            height={INFORMATION_PAGE_DISC_SIZE}
            borderRadius={INFORMATION_PAGE_DISC_SIZE / 2}
            alignItems="center"
            justifyContent="center"
            flexShrink={0}
            mb="ml"
            backgroundColor={backgroundColor}>
            <Icon
              width={INFORMATION_PAGE_ICON_SIZE}
              height={INFORMATION_PAGE_ICON_SIZE}
              iconColor={iconColor}
            />
          </Box>
        )}
        <Text as="h1" variant="heading" textAlign="center">
          {title}
        </Text>
        <Text variant="body" color="textSecondary" textAlign="center" mt="s">
          {description}
        </Text>
        {hasButtons && (
          <Box width="100%" gap="s" mt="l">
            {primaryButton && (
              <Button
                label={primaryButton.label}
                variant="primary"
                size="large"
                onPress={primaryButton.onPress}
                block
              />
            )}
            {secondaryButton && (
              <Button
                label={secondaryButton.label}
                variant="secondary"
                size="large"
                onPress={secondaryButton.onPress}
                block
              />
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default InformationPage;
