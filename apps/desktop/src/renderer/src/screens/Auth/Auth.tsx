import { useState } from 'react';

import AuthScreen from 'enums/AuthScreen';

import Register from 'screens/Register';
import SignIn from 'screens/SignIn';

function Auth() {
  const [screen, setScreen] = useState(AuthScreen.SIGN_IN);

  if (screen === AuthScreen.REGISTER) {
    return <Register onSignIn={() => setScreen(AuthScreen.SIGN_IN)} />;
  }

  return <SignIn onRegister={() => setScreen(AuthScreen.REGISTER)} />;
}

export default Auth;
