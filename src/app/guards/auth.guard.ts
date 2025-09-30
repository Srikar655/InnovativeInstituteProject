import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router=inject(Router)
  const role=route.data['role'] as string;
  console.log("role in guard"+role);
  const user=localStorage.getItem('userIdentity');
  if(user==null)
  {
    router.navigate(['/login']);
    return false;
  }
  console.log(user);
  const userRole=JSON.parse(user).authorities.find((auth:any)=>auth.authority===role)?.authority;
  if(userRole!==role)
  {
    router.navigate(['/login']);
    return false;
  }
  return true;

};
