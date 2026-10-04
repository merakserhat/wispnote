import Box from 'components/core/Box';
import Button from 'components/core/Button';
import FormInput from 'components/core/FormInput';
import Text from 'components/core/Text';

import { useRegisterForm } from './Register.hooks';
import { TRegisterFormValues, TRegisterProps } from './Register.types';

function Register({ onSignIn }: TRegisterProps) {
  const { control, submit, isPending, error } = useRegisterForm();

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
          <Box flexDirection="row" alignItems="center" justifyContent="center" gap="xs">
            <Text variant="caption" color="textSecondary">
              Already have an account?
            </Text>
            <Button label="Sign in" variant="ghost" size="small" onPress={onSignIn} />
          </Box>
        </Box>
      </form>
    </Box>
  );
}

export default Register;
