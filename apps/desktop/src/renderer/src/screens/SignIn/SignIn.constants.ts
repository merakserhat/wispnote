import * as yup from 'yup';

import { TSignInFormValues } from './SignIn.types';

export const SIGN_IN_PASSWORD_MIN_LENGTH = 8;

export const signInSchema = yup.object({
  email: yup.string().required('Email is required').email('Enter a valid email address'),
  password: yup
    .string()
    .required('Password is required')
    .min(SIGN_IN_PASSWORD_MIN_LENGTH, `At least ${SIGN_IN_PASSWORD_MIN_LENGTH} characters`),
});

export const SIGN_IN_DEFAULT_VALUES: TSignInFormValues = {
  email: '',
  password: '',
};
