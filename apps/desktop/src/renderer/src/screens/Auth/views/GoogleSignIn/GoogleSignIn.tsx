import { useNavigate } from '@tanstack/react-router';

import { useGoogleSignIn } from 'api/auth';

import Box from 'components/core/Box';
import Button from 'components/core/Button';
import Text from 'components/core/Text';
import { GoogleIcon } from 'components/Icons';

import ApiErrorCode from 'shared/enums/ApiErrorCode';
import { isAccessError } from 'screens/Auth/Auth.helpers';

import { TErrorResponse } from 'shared/types/common';

function GoogleSignIn() {
  const navigate = useNavigate();

  function handleError(signInError?: TErrorResponse) {
    if (signInError?.errorCode === ApiErrorCode.ACCESS_PENDING) {
      navigate({ to: '/access-pending', search: {} });
    }

    if (signInError?.errorCode === ApiErrorCode.ACCESS_REJECTED) {
      navigate({ to: '/access-rejected', search: {} });
    }
  }

  const { signIn, cancel, isPending, error } = useGoogleSignIn({ onError: handleError });
  const visibleError = isAccessError(error) ? null : error;

  return (
    <Box gap="m">
      <Box flexDirection="row" alignItems="center" gap="xs">
        <Box flex={1} height={1} backgroundColor="borderDivider" />
        <Text variant="caption" color="textSecondary">
          or
        </Text>
        <Box flex={1} height={1} backgroundColor="borderDivider" />
      </Box>
      <Button
        label={isPending ? 'Waiting for Google…' : 'Continue with Google'}
        variant="secondary"
        size="large"
        leftIcon={GoogleIcon}
        onPress={isPending ? cancel : signIn}
        block
      />
      {visibleError && (
        <Text variant="caption" color="statusErrorPrimary">
          {visibleError.errorMessage}
        </Text>
      )}
    </Box>
  );
}

export default GoogleSignIn;
