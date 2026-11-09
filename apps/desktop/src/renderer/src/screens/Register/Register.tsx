import { useNavigate } from '@tanstack/react-router';

import Box from 'components/core/Box';
import Button from 'components/core/Button';
import FormInput from 'components/core/FormInput';
import Text from 'components/core/Text';

import GoogleSignIn from 'screens/Auth/views/GoogleSignIn';

import { TRegisterResponse } from 'shared/types/auth.types';

import { useRegisterForm } from './Register.hooks';
import { TRegisterFormValues } from './Register.types';

function Register() {
  const navigate = useNavigate();

  function handleRegistered(email: string, result: TRegisterResponse) {
    navigate({
      to: '/verify-email',
      search: {
        email,
        verificationToken: result.verificationToken,
        codeExpiresIn: result.codeExpiresIn,
        resendOnMount: false,
      },
    });
  }

  const { control, submit, isPending, error } = useRegisterForm({
    onRegistered: handleRegistered,
  });

  function handleSignIn() {
    navigate({ to: '/sign-in' });
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
            <Text variant="heading">Create your WispNote account</Text>
            <Text variant="body" color="textSecondary">
              Your highlights will sync to this account.
            </Text>
          </Box>
          <FormInput<TRegisterFormValues>
            control={control}
            name="email"
            label="Email"
            placeholder="you@example.com"
            size="large"
            autoFocus
          />
          <FormInput<TRegisterFormValues>
            control={control}
            name="password"
            label="Password"
            placeholder="••••••••"
            size="large"
            secure
          />
          <FormInput<TRegisterFormValues>
            control={control}
            name="passwordConfirm"
            label="Confirm password"
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
            label="Create account"
            variant="primary"
            size="large"
            htmlType="submit"
            loading={isPending}
            block
          />
          <GoogleSignIn />
          <Box flexDirection="row" alignItems="center" justifyContent="center" gap="xs">
            <Text variant="caption" color="textSecondary">
              Already have an account?
            </Text>
            <Button label="Sign in" variant="ghost" size="small" onPress={handleSignIn} />
          </Box>
        </Box>
      </form>
    </Box>
  );
}

export default Register;
