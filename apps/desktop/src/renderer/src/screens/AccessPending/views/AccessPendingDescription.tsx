import Text from 'components/core/Text';

import { TAccessPendingDescriptionProps } from '../AccessPending.types';

function AccessPendingDescription({ email }: TAccessPendingDescriptionProps) {
  return (
    <>
      WispNote is in a test phase, so new accounts are approved by hand. We’ll email{' '}
      {email && (
        <Text as="span" variant="bodyBold" color="textPrimary" nowrap>
          {email}
        </Text>
      )}
      {!email && 'you'} when yours is reviewed.
    </>
  );
}

export default AccessPendingDescription;
