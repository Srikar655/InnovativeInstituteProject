import { Component, inject, OnInit } from '@angular/core';
import { OauthService } from '../../services/oauth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  oauthService=inject(OauthService);
   router=inject(Router);
  
  ngOnInit(): void {
    this.oauthService.Login();
  }
  navigateToCourses()
  {
    this.router.navigate(['/courses']);
  }
}
