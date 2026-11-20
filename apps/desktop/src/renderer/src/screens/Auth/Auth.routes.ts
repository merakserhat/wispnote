import { createRoute } from '@tanstack/react-router';

import AccessPending, { TAccessPendingSearch } from 'screens/AccessPending';
import AccessRejected, { TAccessRejectedSearch } from 'screens/AccessRejected';
import Register from 'screens/Register';
import SignIn from 'screens/SignIn';
import VerifyEmail, { TVerifyEmailSearch } from 'screens/VerifyEmail';

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

export const accessPendingRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: '/access-pending',
  component: AccessPending,
  validateSearch: (search: Record<string, unknown>) => search as TAccessPendingSearch,
});

export const accessRejectedRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: '/access-rejected',
  component: AccessRejected,
  validateSearch: (search: Record<string, unknown>) => search as TAccessRejectedSearch,
});

export default [
  signInRoute,
  registerRoute,
  verifyEmailRoute,
  accessPendingRoute,
  accessRejectedRoute,
];
