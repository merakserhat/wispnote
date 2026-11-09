import { useGoogleSignIn } from 'api/auth';

import Box from 'components/core/Box';
import Button from 'components/core/Button';
import Text from 'components/core/Text';
import { GoogleIcon } from 'components/Icons';

function GoogleSignIn() {
  const { signIn, cancel, isPending, error } = useGoogleSignIn();

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
      {error && (
        <Text variant="caption" color="statusErrorPrimary">
          {error.errorMessage}
        </Text>
      )}
    </Box>
  );
}

export default GoogleSignIn;
