import Button from 'components/core/Button';
import FormInput from 'components/core/FormInput';
import Text from 'components/core/Text';

import { useSignInForm } from './SignIn.hooks';
import { SignInCard, SignInContainer, SignInHeader } from './SignIn.styles';
import { TSignInFormValues } from './SignIn.types';

function SignIn() {
  const { control, submit, isPending, error } = useSignInForm();

  return (
    <SignInContainer>
      <SignInCard onSubmit={submit}>
        <SignInHeader>
          <Text variant="heading">Sign in to WispNote</Text>
          <Text variant="body" muted>
            Your highlights sync to your account.
          </Text>
        </SignInHeader>
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
        {error ? (
          <Text variant="meta" color="danger">
            {error.errorMessage}
          </Text>
        ) : null}
        <Button label="Sign in" variant="primary" htmlType="submit" loading={isPending} block />
      </SignInCard>
    </SignInContainer>
  );
}

export default SignIn;
