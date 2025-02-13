import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const redirectGuard: CanActivateFn = (route, state) => {
  const token=localStorage.getItem('oauthToken');
  const router=inject(Router)
  if(token==null)
  {
    router.navigate(['/']);
    return false
  }
  return true;
};
