import { createRoute } from '@tanstack/react-router';

import Register from 'screens/Register';
import SignIn from 'screens/SignIn';
import VerifyEmail from 'screens/VerifyEmail';
import { TVerifyEmailSearch } from 'screens/VerifyEmail/VerifyEmail.types';

import { authLayoutRoute } from 'routes/root';

export const signInRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: '/sign-in',
  component: SignIn,
});

export const registerRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: '/register',
  component: Register,
});

export const verifyEmailRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: '/verify-email',
  component: VerifyEmail,
  validateSearch: (search: Record<string, unknown>) => search as TVerifyEmailSearch,
});

export default [signInRoute, registerRoute, verifyEmailRoute];
