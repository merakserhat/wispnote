import Box from 'components/core/Box';

import { useVerifyEmailForm } from './VerifyEmail.hooks';
import { TVerifyEmailProps } from './VerifyEmail.types';
import VerificationCodeField from './views/VerificationCodeField';
import VerifyEmailAction from './views/VerifyEmailAction';
import VerifyEmailHeader from './views/VerifyEmailHeader';
import VerifyEmailLinks from './views/VerifyEmailLinks';
import VerifyEmailNotice from './views/VerifyEmailNotice';

function VerifyEmail({
  email,
  verificationToken,
  codeExpiresIn,
  resendOnMount,
  onUseDifferentEmail,
  onSessionExpired,
}: TVerifyEmailProps) {
  const {
    control,
    submit,
    resend,
    notice,
    secondsLeft,
    codeLifetime,
    isExpired,
    isConfirmPending,
    isResendPending,
    isResendBlocked,
  } = useVerifyEmailForm({ verificationToken, codeExpiresIn, resendOnMount, onSessionExpired });

  return (
    <Box
      height="100%"
      alignItems="center"
      justifyContent="center"
      backgroundColor="backgroundPrimary">
      <form onSubmit={submit}>
        <Box width={340} gap="m">
          <VerifyEmailHeader email={email} />
          <VerificationCodeField
            control={control}
            secondsLeft={secondsLeft}
            isExpired={isExpired}
          />
          <VerifyEmailNotice notice={notice} codeLifetime={codeLifetime} isExpired={isExpired} />
          <VerifyEmailAction
            isExpired={isExpired}
            isConfirmPending={isConfirmPending}
            isResendPending={isResendPending}
            isResendBlocked={isResendBlocked}
            onResend={resend}
          />
          <VerifyEmailLinks
            isExpired={isExpired}
            isResendBlocked={isResendBlocked}
            onResend={resend}
            onUseDifferentEmail={onUseDifferentEmail}
          />
        </Box>
      </form>
    </Box>
  );
}

export default VerifyEmail;
