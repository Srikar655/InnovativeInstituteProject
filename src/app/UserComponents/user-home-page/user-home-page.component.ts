import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { WebsocketService } from '../../services/websocket.service';
import { Observable } from 'rxjs';
import { OauthService } from '../../services/oauth.service';
import { LoginComponent } from "../../AdminComponents/login/login.component";
import { AccountSectionComponent } from "../../sharedcomponents/account-section/account-section.component";

@Component({
  selector: 'app-user-home-page',
  imports: [RouterOutlet, CommonModule, RouterLink, AsyncPipe, LoginComponent, AccountSectionComponent],
  templateUrl: './user-home-page.component.html',
  styleUrl: './user-home-page.component.css'
})
export class UserHomePageComponent {
  router=inject(Router);
  websocketservice=inject(WebsocketService);
  oauthService=inject(OauthService);
  isAdmin$:Observable<boolean>=this.oauthService.isAdmin$;
  isLoggedIn$:Observable<boolean>=this.oauthService.isLoggedIn$;

  constructor(){
    //this.websocketservice.connect();
  }

  notifications:any = [];
  notificationCount = 0;

  ngOnInit() {
    this.isAdmin$=this.oauthService.isAdmin$;
    // this.websocketservice.getNotifications().subscribe((message: any) => {
    //   console.log("Header nunchi rah babu",message);
    //   const notification = message.body.array.forEach((element: any) => {
    //     return {message:element};
    //   });;
    //   this.notifications.push(notification);
    //   this.notificationCount = this.notifications.length;
    // }
    // );
    // this.websocketservice.subscribe('/topic/task-result', (message: any) => {
    //   console.log("Header nunchi rah babu",message.body);
    //   const notification =message.body;
    //   this.notifications.push({message:notification});
    //   this.notificationCount = this.notifications.length;
    // }
    // );
  }
  // removeNotification(note: any) {
  //   this.notifications = this.notifications.filter((n: any) => n !== note);
  // }
}
