import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class PopupserviceService {
  constructor() { }
  sweetSuccessAllert(arg0: string) {
    Swal.fire({
      icon: 'success',
      title: arg0,
      text: "",
      showCloseButton: true,
      showConfirmButton: false,
      timer: 3000,  
      backdrop: `rgba(0, 123, 255, 0.4)`,
      didOpen: () => {
        const content = Swal.getHtmlContainer();
        if (content) {
          content.style.animation = 'fadeInUp 0.8s';  
        }
      }
    });
  }
  sweetUnSuccessAllert(arg0: string) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: arg0,
    });
  }

  sweetConfirmationAlert(arg0:string)
  {
   return Swal.fire({
      icon: 'warning',
      title: 'Alert',
      text: arg0,
      showCloseButton: true,
      showConfirmButton: true,
      //timer: 3000,  
      backdrop: `rgba(0, 123, 255, 0.4)`,
      didOpen: () => {
        const content = Swal.getHtmlContainer();
        if (content) {
          content.style.animation = 'fadeInUp 0.8s';  
        }
      }
    }); 
  }
}
