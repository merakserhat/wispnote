import Box from 'components/core/Box';
import Text from 'components/core/Text';

import { VERIFICATION_CODE_LENGTH } from '../VerifyEmail.constants';
import { formatCountdown } from '../VerifyEmail.helpers';
import { CodeInput } from '../VerifyEmail.styles';
import { TVerificationCodeFieldProps } from '../VerifyEmail.types';

function VerificationCodeField({ control, secondsLeft, isExpired }: TVerificationCodeFieldProps) {
  return (
    <Box gap="xs">
      <Box flexDirection="row" alignItems="baseline" justifyContent="space-between" gap="sm">
        <Text as="label" htmlFor="code" variant="bodySubBold" color="textSecondary">
          Verification code
        </Text>
        {isExpired && (
          <Text variant="caption" color="statusErrorPrimary">
            Code expired
          </Text>
        )}
        {!isExpired && secondsLeft !== undefined && (
          <Text variant="caption" color="textTertiary">
            Expires in {formatCountdown(secondsLeft)}
          </Text>
        )}
      </Box>
      <CodeInput
        control={control}
        name="code"
        placeholder="000000"
        size="large"
        inputMode="numeric"
        autoComplete="one-time-code"
        maxLength={VERIFICATION_CODE_LENGTH}
        disabled={isExpired}
        autoFocus
      />
    </Box>
  );
}

export default VerificationCodeField;
