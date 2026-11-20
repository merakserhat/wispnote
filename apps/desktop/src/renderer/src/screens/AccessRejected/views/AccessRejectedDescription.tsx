import Text from 'components/core/Text';

import { TAccessRejectedDescriptionProps } from '../AccessRejected.types';

function AccessRejectedDescription({ email }: TAccessRejectedDescriptionProps) {
  return (
    <>
      WispNote’s test is open to a small group for now, and{' '}
      {email && (
        <Text as="span" variant="bodyBold" color="textPrimary" nowrap>
          {email}
        </Text>
      )}
      {!email && 'this account'} isn’t in it.
    </>
  );
}

export default AccessRejectedDescription;
