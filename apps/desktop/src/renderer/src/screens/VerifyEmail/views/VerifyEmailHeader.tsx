import Box from 'components/core/Box';
import Text from 'components/core/Text';

import { TVerifyEmailHeaderProps } from '../VerifyEmail.types';

function VerifyEmailHeader({ email }: TVerifyEmailHeaderProps) {
  return (
    <Box gap="xs" mb="xs">
      <Text variant="heading">Check your email</Text>
      <Text variant="body" color="textSecondary">
        We sent a 6-digit code to{' '}
        <Text as="span" variant="bodyBold" color="textPrimary" nowrap>
          {email}
        </Text>
        .
      </Text>
    </Box>
  );
}

export default VerifyEmailHeader;
