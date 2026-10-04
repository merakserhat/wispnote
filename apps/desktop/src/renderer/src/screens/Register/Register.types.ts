export type TRegisterFormValues = {
  email: string;
  password: string;
  passwordConfirm: string;
};

export type TRegisterProps = {
  onSignIn: () => void;
};
