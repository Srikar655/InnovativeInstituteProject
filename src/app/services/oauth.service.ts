import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { EmailDetails } from '../models/EmailDetails';
declare var google:any;
@Injectable({
  providedIn: 'root'
})
export class OauthService {

  url:string="http://localhost:9090/api";
  http=inject(HttpClient);
  constructor() { }
  router=inject(Router);
  Login()
  {
    google.accounts.id.initialize({
      client_id:'141367274358-radhhb6jmms5eu9j743u5i2bfchkdt2f.apps.googleusercontent.com',
      callback:(res:any)=>
      {
        localStorage.setItem('oauthToken',res.credential),
        this.navigate();
      }
    });
    google.accounts.id.prompt((notification:any) => {
      console.log(notification);
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
      }
  });
    google.accounts.id.renderButton(document.getElementById('login-btn'),{
      theme:'filled_blue',
      width:200
    });
  }
  navigate():void
  {
    const headers = { 'X-Show-Spinner': 'true' };
    this.http.get(this.url+"/login",{headers}).subscribe({
      next:(res:any)=>{
        localStorage.setItem('userIdentity',JSON.stringify(res));
        /*this.router.navigate(['/user-homepage'])*/
      },
      error:err=>console.log(err)
      
    });
    
  }

}
