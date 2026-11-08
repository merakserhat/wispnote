import { useState } from 'react';

import { TEmailNotVerifiedError, TRegisterResponse } from 'shared/types/auth.types';

import Box from 'components/core/Box';

import AuthScreen from 'enums/AuthScreen';

import Register from 'screens/Register';
import SignIn from 'screens/SignIn';
import VerifyEmail from 'screens/VerifyEmail';

import { AUTH_DRAG_STYLE } from './Auth.constants';
import { TPendingVerification } from './Auth.types';

function Auth() {
  const [screen, setScreen] = useState(AuthScreen.SIGN_IN);
  const [verification, setVerification] = useState<TPendingVerification>();

  function showSignIn() {
    setScreen(AuthScreen.SIGN_IN);
  }

  function showRegister() {
    setScreen(AuthScreen.REGISTER);
  }

  function handleRegistered(email: string, result: TRegisterResponse) {
    setVerification({
      email,
      verificationToken: result.verificationToken,
      codeExpiresIn: result.codeExpiresIn,
      resendOnMount: false,
    });
    setScreen(AuthScreen.VERIFY_EMAIL);
  }

  function handleEmailNotVerified(email: string, error: TEmailNotVerifiedError) {
    setVerification({
      email,
      verificationToken: error.verificationToken,
      resendOnMount: true,
    });
    setScreen(AuthScreen.VERIFY_EMAIL);
  }

  function renderScreen() {
    if (screen === AuthScreen.VERIFY_EMAIL && verification) {
      return (
        <VerifyEmail
          key={verification.verificationToken}
          email={verification.email}
          verificationToken={verification.verificationToken}
          codeExpiresIn={verification.codeExpiresIn}
          resendOnMount={verification.resendOnMount}
          onUseDifferentEmail={showRegister}
          onSessionExpired={showSignIn}
        />
      );
    }

    if (screen === AuthScreen.REGISTER) {
      return <Register onSignIn={showSignIn} onRegistered={handleRegistered} />;
    }

    return <SignIn onRegister={showRegister} onEmailNotVerified={handleEmailNotVerified} />;
  }

  return (
    <Box height="100%" style={AUTH_DRAG_STYLE}>
      {renderScreen()}
    </Box>
  );
}

export default Auth;
