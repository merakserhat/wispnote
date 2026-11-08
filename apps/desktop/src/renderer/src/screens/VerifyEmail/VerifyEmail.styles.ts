import styled from 'styled-components';

import FormInput from 'components/core/FormInput';

import { TVerifyEmailFormValues } from './VerifyEmail.types';

export const CodeInput = styled(FormInput<TVerifyEmailFormValues>)`
  && input {
    font-family: ${({ theme }) => theme.fonts.mono};
    font-size: 20px;
    letter-spacing: 0.3em;
  }
`;
