// mobile/src/app/routeGuards.tsx
// Declarative route guards used across navigator stacks.
// Backend still enforces authorization (SRS §9.4) — these only
// prevent UI-level mistakes and improve UX.

import React, { ReactNode } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

import { useAuth } from '@hooks/useAuth';
import { usePermissions } from '@hooks/usePermissions';
import type { UserRole } from '@constants/roles';

interface GuardProps {
  children: ReactNode;
}

interface RequireRoleProps extends GuardProps {
  allowed: UserRole[];
  fallback?: ReactNode;
}

interface RequirePermissionProps extends GuardProps {
  permission: string;
  fallback?: ReactNode;
}

/** Require authenticated user. Redirect handled by RootNavigator. */
export function RequireAuth({ children }: GuardProps): React.ReactElement {
  const { user, isBootstrapping } = useAuth();

  if (isBootstrapping) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <AccessDeniedScreen title="Sign in required" />;
  }

  return <>{children}</>;
}

/** Require one of the given roles (SRS §4.1 — 5 actors). */
export function RequireRole({
  children,
  allowed,
  fallback,
}: RequireRoleProps): React.ReactElement {
  const { user, isBootstrapping } = useAuth();
  const { t } = useTranslation();

  if (isBootstrapping) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <AccessDeniedScreen title={t('auth.errors.signInRequired')} />;
  }

  if (!allowed.includes(user.role)) {
    if (fallback) return <>{fallback}</>;
    return <AccessDeniedScreen title={t('auth.errors.roleNotAllowed')} />;
  }

  return <>{children}</>;
}

/** Require a specific permission (SRS §4.3, §14.2). */
export function RequirePermission({
  children,
  permission,
  fallback,
}: RequirePermissionProps): React.ReactElement {
  const { isBootstrapping } = useAuth();
  const { hasPermission } = usePermissions();
  const { t } = useTranslation();

  if (isBootstrapping) {
    return <LoadingScreen />;
  }

  if (!hasPermission(permission)) {
    if (fallback) return <>{fallback}</>;
    return <AccessDeniedScreen title={t('auth.errors.permissionDenied')} />;
  }

  return <>{children}</>;
}

/** Guest-only screens (login, register). */
export function GuestOnly({ children }: GuardProps): React.ReactElement {
  const { user, isBootstrapping } = useAuth();

  if (isBootstrapping) {
    return <LoadingScreen />;
  }

  if (user) {
    // Already signed in — RootNavigator will redirect to the actor stack.
    return <LoadingScreen />;
  }

  return <>{children}</>;
}

/** Require verified account (email + phone). */
export function RequireVerified({ children }: GuardProps): React.ReactElement {
  const { user, isBootstrapping } = useAuth();
  const { t } = useTranslation();

  if (isBootstrapping) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <AccessDeniedScreen title={t('auth.errors.signInRequired')} />;
  }

  if (!user.emailVerified || !user.phoneVerified) {
    return <AccessDeniedScreen title={t('auth.errors.verifyAccount')} />;
  }

  return <>{children}</>;
}

// ─────────────────────────────────────────────────────────────
// Internal helper screens
// ─────────────────────────────────────────────────────────────

function LoadingScreen(): React.ReactElement {
  return (
    <View style={styles.center}>
      <ActivityIndicator size="large" />
    </View>
  );
}

function AccessDeniedScreen({ title }: { title: string }): React.ReactElement {
  return (
    <View style={styles.center}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 16,
    textAlign: 'center',
  },
});