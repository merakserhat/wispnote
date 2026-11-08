import Button from 'components/core/Button';

import { TVerifyEmailActionProps } from '../VerifyEmail.types';

function VerifyEmailAction({
  isExpired,
  isConfirmPending,
  isResendPending,
  isResendBlocked,
  onResend,
}: TVerifyEmailActionProps) {
  if (isExpired) {
    return (
      <Button
        label="Send new code"
        variant="primary"
        size="large"
        loading={isResendPending}
        disabled={isResendBlocked}
        onPress={onResend}
        block
      />
    );
  }

  return (
    <Button
      label="Verify"
      variant="primary"
      size="large"
      htmlType="submit"
      loading={isConfirmPending}
      block
    />
  );
}

export default VerifyEmailAction;
