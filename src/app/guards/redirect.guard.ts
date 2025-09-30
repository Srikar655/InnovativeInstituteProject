import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const redirectGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const token = localStorage.getItem('oauthToken');
  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  const user = JSON.parse(localStorage.getItem('userIdentity') || 'null');
  const userRole = user?.role;

  const requiredRole = route.data['role'] as string | undefined;
  if (requiredRole && userRole !== requiredRole) {
    return false;
  }

  return true;
};
