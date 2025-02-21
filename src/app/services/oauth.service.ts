import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
declare var google:any;
@Injectable({
  providedIn: 'root'
})
export class OauthService {

  constructor() { }
  router=inject(Router);
  Login()
  {
    google.accounts.id.initialize({
      client_id:'950816388236-beh5nkicurvu1o30tcikbds4p7d481s4.apps.googleusercontent.com',
      callback:(res:any)=>
      {
        console.log(res),
        localStorage.setItem('oauthToken',res.credential),
        this.navigate();
      }
    })
    google.accounts.id.renderButton(document.getElementById('login-btn'),{
      theme:'filled_blue',
      width:200
    })
  }
  navigate():void
  {
    this.router.navigate(['/courses'])
  }

}
