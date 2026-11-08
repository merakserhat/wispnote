import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { useLogin } from 'api/auth';

import { SIGN_IN_DEFAULT_VALUES, signInSchema } from './SignIn.constants';
import { isEmailNotVerifiedError } from './SignIn.helpers';
import { TSignInFormValues, TSignInProps } from './SignIn.types';

export function useSignInForm({ onEmailNotVerified }: Pick<TSignInProps, 'onEmailNotVerified'>) {
  const { control, handleSubmit, getValues } = useForm<TSignInFormValues>({
    resolver: yupResolver(signInSchema),
    defaultValues: SIGN_IN_DEFAULT_VALUES,
  });

  const { login, isPending, error } = useLogin({
    onError: (loginError) => {
      if (isEmailNotVerifiedError(loginError)) {
        onEmailNotVerified(getValues('email'), loginError);
      }
    },
  });

  const submit = handleSubmit((values) => login(values));

  return {
    control,
    submit,
    isPending,
    error: isEmailNotVerifiedError(error) ? null : error,
  };
}
