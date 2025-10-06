import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { OauthService } from '../services/oauth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router=inject(Router)
  const oauthService=inject(OauthService);
  const requiredRole = route.data['role'] as string;
  const user = oauthService.userIdentity();
  if (user == null)
  {
    //router.navigate(['/login']);
    return false;
  }
  //const userRole=JSON.parse(user).authorities.find((auth:any)=>auth.authority===role)?.authority;
  if (!user.roles.some(r => r.name === requiredRole))
  {
    router.navigate(['/']);
    return false;
  }
  return true;

};
