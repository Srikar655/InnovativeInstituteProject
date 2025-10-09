import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlingService {

  constructor() { }

  public handleError(error: HttpErrorResponse) {
    let userFriendlyMessage = 'An unknown error occurred. Please try again.';

    if (error.status === 0) {
      userFriendlyMessage = 'Could not connect to the server. Please check your network and try again.';
    } else {
      switch (error.status) {
        case 404:
          userFriendlyMessage = 'The requested item could not be found.';
          break;
        case 500:
          userFriendlyMessage = 'There was a problem with the server. Please try again later.';
          break;
        case 401:
        case 403:
          userFriendlyMessage = 'You do not have permission to perform this action.';
          break;
        case 400:
        //   userFriendlyMessage = error.error?.message || 'There was a problem with your request.';
          break;
      }
    }
    return throwError(() => new Error(userFriendlyMessage));
  }
}
