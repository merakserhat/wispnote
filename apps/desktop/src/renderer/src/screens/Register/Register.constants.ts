import * as yup from 'yup';

import { TRegisterFormValues } from './Register.types';

export const REGISTER_PASSWORD_MIN_LENGTH = 8;

export const registerSchema = yup.object({
  email: yup.string().required('Email is required').email('Enter a valid email address'),
  password: yup
    .string()
    .required('Password is required')
    .min(REGISTER_PASSWORD_MIN_LENGTH, `At least ${REGISTER_PASSWORD_MIN_LENGTH} characters`),
  passwordConfirm: yup
    .string()
    .required('Confirm your password')
    .oneOf([yup.ref('password')], 'Passwords do not match'),
});

export const REGISTER_DEFAULT_VALUES: TRegisterFormValues = {
  email: '',
  password: '',
  passwordConfirm: '',
};
