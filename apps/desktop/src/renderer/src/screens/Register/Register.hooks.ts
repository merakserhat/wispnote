import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { useRegister } from 'api/auth';

import { REGISTER_DEFAULT_VALUES, registerSchema } from './Register.constants';
import { TRegisterFormValues, TRegisterProps } from './Register.types';

export function useRegisterForm({ onRegistered }: Pick<TRegisterProps, 'onRegistered'>) {
  const { control, handleSubmit, getValues } = useForm<TRegisterFormValues>({
    resolver: yupResolver(registerSchema),
    defaultValues: REGISTER_DEFAULT_VALUES,
  });

  const { register, isPending, error } = useRegister({
    onSuccess: (result) => {
      if (result) {
        onRegistered(getValues('email'), result);
      }
    },
  });

  const submit = handleSubmit((values) => register(values));

  return {
    control,
    submit,
    isPending,
    error,
  };
}
