import React from 'react';
import { useAuth } from '../../context/AuthContext';

export function usePermissions() {
  const { user } = useAuth() || {};

  const permissions: string[] = React.useMemo(() => {
    if (!user) return [];
    if (Array.isArray(user.permisos)) return user.permisos;
    if (user.rol === 'admin') return ['*']; // SuperAdmin tiene permisos globales
    return [];
  }, [user]);

  const hasPermission = React.useCallback(
    (permission: string): boolean => {
      if (!permission) return true;
      if (permissions.includes('*')) return true;
      return permissions.includes(permission);
    },
    [permissions]
  );

  const hasAnyPermission = React.useCallback(
    (perms: string[]): boolean => {
      if (!perms || perms.length === 0) return true;
      if (permissions.includes('*')) return true;
      return perms.some((p) => permissions.includes(p));
    },
    [permissions]
  );

  const hasAllPermissions = React.useCallback(
    (perms: string[]): boolean => {
      if (!perms || perms.length === 0) return true;
      if (permissions.includes('*')) return true;
      return perms.every((p) => permissions.includes(p));
    },
    [permissions]
  );

  return {
    permissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    isAdmin: user?.rol === 'admin',
  };
}

export interface AuthorizeProps {
  permission: string | string[];
  requireAll?: boolean;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export function Authorize({
  permission,
  requireAll = false,
  fallback = null,
  children,
}: AuthorizeProps): React.ReactElement | null {
  const { hasPermission, hasAllPermissions, hasAnyPermission } = usePermissions();

  let isAuthorized = false;
  if (typeof permission === 'string') {
    isAuthorized = hasPermission(permission);
  } else if (requireAll) {
    isAuthorized = hasAllPermissions(permission);
  } else {
    isAuthorized = hasAnyPermission(permission);
  }

  if (!isAuthorized) {
    return fallback ? <>{fallback}</> : null;
  }

  return <>{children}</>;
}
