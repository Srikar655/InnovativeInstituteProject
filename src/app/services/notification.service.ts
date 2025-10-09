import { inject, Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor() { }

  private toastr = inject(ToastrService);

  showSuccess(message: string, title: string = 'Success'): void {
    this.toastr.success(message, title);
  }

  showError(message: string, title: string = 'Error'): void {
    this.toastr.error(message, title, {
      timeOut: 6000, 
    });
  }

  showInfo(message: string, title: string = 'Info'): void {
    this.toastr.info(message, title);
  }
}
