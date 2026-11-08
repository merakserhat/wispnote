export type TPendingVerification = {
  email: string;
  verificationToken: string;
  codeExpiresIn?: number;
  resendOnMount: boolean;
};
