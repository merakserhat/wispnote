import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { useLogin } from 'api/auth';

import { SIGN_IN_DEFAULT_VALUES, signInSchema } from './SignIn.constants';
import { TSignInFormValues } from './SignIn.types';

export function useSignInForm() {
  const { control, handleSubmit } = useForm<TSignInFormValues>({
    resolver: yupResolver(signInSchema),
    defaultValues: SIGN_IN_DEFAULT_VALUES,
  });

  const { login, isPending, error } = useLogin();

  const submit = handleSubmit(function submitCredentials(values) {
    login(values);
  });

  return {
    control,
    submit,
    isPending,
    error,
  };
}
