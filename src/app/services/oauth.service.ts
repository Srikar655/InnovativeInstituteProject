import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { EmailDetails } from '../models/EmailDetails';
import { BehaviorSubject } from 'rxjs';
declare var google:any;
@Injectable({
  providedIn: 'root'
})
export class OauthService {

  url:string="http://localhost:9090/api";
  http=inject(HttpClient);
  constructor() {
    if(localStorage.getItem('oauthToken'))
    {
      this.navigate();
      this.checkIsGitHubLoggedIn();
    }
  }
  router=inject(Router);
  isAdmin=new BehaviorSubject<boolean>(false);
  isAdmin$=this.isAdmin.asObservable();
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
        if(res['authorities'].includes('ROLE_ADMIN'))
        {
          this.isAdmin.next(true);
        }
        this.router.navigate(['']);
      },
      error:err=>console.log(err)
      
    });
  }
  checkIsGitHubLoggedIn()
  {
    this.http.get('http://localhost:9090/api/github/token-status', { withCredentials: true })
    .subscribe({
      next: () => {
        console.log("User is logged in");
      },
      error: () => {
        console.log("User is not logged in");
        this.loginToGitHub();
      }
    });
  }
  loginToGitHub() {
    const clientId = 'Ov23limFOUP4bEbMrFMJ';
    const user = localStorage.getItem('userIdentity');
    const userDetails = JSON.parse(user!);

    const redirectUri = 'http://localhost:9090/gitHub/callback';

    // Use state to pass email securely
    const state = encodeURIComponent(JSON.stringify({ email: userDetails['username'] }));

    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=repo&allow_signup=true&state=${state}`;

    const width = 600;
    const height = 600;
    const left = (window.innerWidth / 2) - (width / 2);
    const top = (window.innerHeight / 2) - (height / 2);

    window.open(
      githubAuthUrl,
      'GitHub OAuth',
      `width=${width},height=${height},top=${top},left=${left}`
    );
  }


}
