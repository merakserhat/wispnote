import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { useLogin, useRegister } from 'api/auth';

import { REGISTER_DEFAULT_VALUES, registerSchema } from './Register.constants';
import { TRegisterFormValues } from './Register.types';

export function useRegisterForm() {
  const { control, handleSubmit, getValues } = useForm<TRegisterFormValues>({
    resolver: yupResolver(registerSchema),
    defaultValues: REGISTER_DEFAULT_VALUES,
  });

  // INFO: (serhat) register only creates the member; sign in right after so the
  // user lands in the app without typing the same credentials twice.
  const { login, isPending: isLoginPending, error: loginError } = useLogin();

  const {
    register,
    isPending: isRegisterPending,
    error: registerError,
  } = useRegister({
    onSuccess: () => {
      const { email, password } = getValues();
      login({ email, password });
    },
  });

  const submit = handleSubmit((values) => register(values));

  return {
    control,
    submit,
    isPending: isRegisterPending || isLoginPending,
    error: registerError ?? loginError,
  };
}
