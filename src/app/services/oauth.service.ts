import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/user';
declare var google:any;
@Injectable({
  providedIn: 'root'
})
export class OauthService {

  url:string="http://localhost:9090/api";
  http=inject(HttpClient);
  router=inject(Router);
  isAdmin=new BehaviorSubject<boolean>(false);
  isAdmin$=this.isAdmin.asObservable();
  isLoggedIn=new BehaviorSubject<boolean>(false);
  isLoggedIn$=this.isLoggedIn.asObservable();
  userIdentity = signal<User | null>(null);
  constructor() {
    if(localStorage.getItem('oauthToken'))
    {
      this.checkAuthorities();
      //this.navigate();
      //this.checkIsGitHubLoggedIn();
    }
  }
  
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
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
      }
  });
    google.accounts.id.renderButton(document.getElementById('login-btn'),{
      theme:'filled_blue',
      width:200
    });
  }
  logout()
  {
    localStorage.removeItem('oauthToken');
    localStorage.removeItem('userIdentity');
    this.isAdmin.next(false);
    this.isLoggedIn.next(false);
    this.userIdentity.set(null);
    this.router.navigate(['/']);
  }
  navigate():void
  {
    const headers = { 'X-Show-Spinner': 'true' };
    this.http.get(this.url+"/login",{headers}).subscribe({
      next:(res)=>{
        localStorage.setItem('userIdentity',JSON.stringify(res));
        this.checkAuthorities();
        this.router.navigate(['/']);
      },
      error:err=>console.log(err)
      
    });
  }
  checkAuthorities()
  {
    const user = localStorage.getItem('userIdentity');
    if (user) {
      const userDetails: User = JSON.parse(user);
      if (userDetails.roles.some((auth: any) => auth.name === 'ROLE_ADMIN')) {
        this.isAdmin.next(true);
      }
      this.isLoggedIn.next(true);
      this.userIdentity.set(userDetails);
    }
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
