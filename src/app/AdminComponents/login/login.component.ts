import { Component, inject, OnInit } from '@angular/core';
import { OauthService } from '../../services/oauth.service';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  oauthService=inject(OauthService);
  ngOnInit(): void {
    this.oauthService.Login();
  }
}
