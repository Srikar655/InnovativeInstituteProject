import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const jwtToken = localStorage.getItem('oauthToken');
  const loadingspinner = inject(NgxSpinnerService);
  if (jwtToken) {
    const showSpinner = req.headers.get('X-Show-Spinner') === 'true';
    
    let clonedRequest = req;
    if (req.headers.has('X-Show-Spinner')) {
      clonedRequest = req.clone({
        headers: req.headers.delete('X-Show-Spinner')
      });
      loadingspinner.show();
    }
     clonedRequest = clonedRequest.clone({
      setHeaders: {
        Authorization: `Bearer ${jwtToken}`
      }
    });
    return next(clonedRequest).pipe(
      finalize(()=>{
        loadingspinner.hide();
      })
    );
  }
  
  return next(req);
};
