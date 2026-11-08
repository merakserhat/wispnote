import Box from 'components/core/Box';
import Button from 'components/core/Button';
import Text from 'components/core/Text';

import { TVerifyEmailLinksProps } from '../VerifyEmail.types';

function VerifyEmailLinks({
  isExpired,
  isResendBlocked,
  onResend,
  onUseDifferentEmail,
}: TVerifyEmailLinksProps) {
  return (
    <Box gap="xs">
      {!isExpired && (
        <Box flexDirection="row" alignItems="center" justifyContent="center" gap="xs">
          <Text variant="caption" color="textSecondary">
            Didn’t get it?
          </Text>
          <Button
            label="Resend code"
            variant="ghost"
            size="small"
            disabled={isResendBlocked}
            onPress={onResend}
          />
        </Box>
      )}
      <Box flexDirection="row" alignItems="center" justifyContent="center" gap="xs">
        <Text variant="caption" color="textSecondary">
          Wrong address?
        </Text>
        <Button
          label="Use a different email"
          variant="ghost"
          size="small"
          onPress={onUseDifferentEmail}
        />
      </Box>
    </Box>
  );
}

export default VerifyEmailLinks;
