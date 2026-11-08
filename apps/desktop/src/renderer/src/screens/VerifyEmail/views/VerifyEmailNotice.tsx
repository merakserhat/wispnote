import Text from 'components/core/Text';

import { NOTICE_TONE_COLOR } from '../VerifyEmail.constants';
import { toCodeLifetimeMinutes } from '../VerifyEmail.helpers';
import { TVerifyEmailNoticeProps } from '../VerifyEmail.types';

function VerifyEmailNotice({ notice, codeLifetime, isExpired }: TVerifyEmailNoticeProps) {
  if (notice) {
    return (
      <Text variant="caption" color={NOTICE_TONE_COLOR[notice.tone]}>
        {notice.message}
      </Text>
    );
  }

  if (isExpired && codeLifetime !== undefined) {
    return (
      <Text variant="caption" color="textSecondary">
        Codes last {toCodeLifetimeMinutes(codeLifetime)} minutes. Send a new one to continue.
      </Text>
    );
  }

  return null;
}

export default VerifyEmailNotice;
