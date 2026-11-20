import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import ApiErrorCode from 'shared/enums/ApiErrorCode';

import { useLogin } from 'api/auth';

import { SIGN_IN_DEFAULT_VALUES, signInSchema } from './SignIn.constants';
import { getSignInFormError, isEmailNotVerifiedError } from './SignIn.helpers';
import { TSignInFormValues, TUseSignInFormParams } from './SignIn.types';

export function useSignInForm({
  onEmailNotVerified,
  onAccessPending,
  onAccessRejected,
}: TUseSignInFormParams) {
  const { control, handleSubmit, getValues } = useForm<TSignInFormValues>({
    resolver: yupResolver(signInSchema),
    defaultValues: SIGN_IN_DEFAULT_VALUES,
  });

  const { login, isPending, error } = useLogin({
    onError: (loginError) => {
      if (isEmailNotVerifiedError(loginError)) {
        onEmailNotVerified(getValues('email'), loginError);
      }

      if (loginError?.errorCode === ApiErrorCode.ACCESS_PENDING) {
        onAccessPending(getValues('email'));
      }

      if (loginError?.errorCode === ApiErrorCode.ACCESS_REJECTED) {
        onAccessRejected(getValues('email'));
      }
    },
  });

  const submit = handleSubmit((values) => login(values));

  return {
    control,
    submit,
    isPending,
    error: getSignInFormError(error),
  };
}
