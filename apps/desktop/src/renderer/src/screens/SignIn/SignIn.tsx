import { useNavigate } from '@tanstack/react-router';

import Box from 'components/core/Box';
import Button from 'components/core/Button';
import FormInput from 'components/core/FormInput';
import Text from 'components/core/Text';

import GoogleSignIn from 'screens/Auth/views/GoogleSignIn';

import { TEmailNotVerifiedError } from 'shared/types/auth.types';

import { useSignInForm } from './SignIn.hooks';
import { TSignInFormValues } from './SignIn.types';

function SignIn() {
  const navigate = useNavigate();

  function handleEmailNotVerified(email: string, error: TEmailNotVerifiedError) {
    navigate({
      to: '/verify-email',
      search: { email, verificationToken: error.verificationToken, resendOnMount: true },
    });
  }

  const { control, submit, isPending, error } = useSignInForm({
    onEmailNotVerified: handleEmailNotVerified,
  });

  function handleRegister() {
    navigate({ to: '/register' });
  }

  return (
    <Box
      height="100%"
      alignItems="center"
      justifyContent="center"
      backgroundColor="backgroundPrimary">
      <form onSubmit={submit}>
        <Box width={340} gap="m">
          <Box gap="xs" mb="xs">
            <Text variant="heading">Sign in to WispNote</Text>
            <Text variant="body" color="textSecondary">
              Your highlights sync to your account.
            </Text>
          </Box>
          <FormInput<TSignInFormValues>
            control={control}
            name="email"
            label="Email"
            placeholder="you@example.com"
            size="large"
            autoFocus
          />
          <FormInput<TSignInFormValues>
            control={control}
            name="password"
            label="Password"
            placeholder="••••••••"
            size="large"
            secure
          />
          {error && (
            <Text variant="caption" color="statusErrorPrimary">
              {error.errorMessage}
            </Text>
          )}
          <Button
            label="Sign in"
            variant="primary"
            size="large"
            htmlType="submit"
            loading={isPending}
            block
          />
          <GoogleSignIn />
          <Box flexDirection="row" alignItems="center" justifyContent="center" gap="xs">
            <Text variant="caption" color="textSecondary">
              New to WispNote?
            </Text>
            <Button label="Create account" variant="ghost" size="small" onPress={handleRegister} />
          </Box>
        </Box>
      </form>
    </Box>
  );
}

export default SignIn;
