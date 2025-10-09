import { HttpInterceptorFn } from '@angular/common/http';


export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const jwtToken = localStorage.getItem('oauthToken');
  if (jwtToken) {    
    let clonedRequest = req;
    console.log(req.url);
    clonedRequest = clonedRequest.clone({
      setHeaders: {
        Authorization: `Bearer ${jwtToken}`
      }
    });
    return next(clonedRequest);
  }
  
  return next(req);
};
