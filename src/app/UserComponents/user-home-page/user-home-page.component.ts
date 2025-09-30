import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { NgxSpinnerComponent } from 'ngx-spinner';
import { WebsocketService } from '../../services/websocket.service';
import { Observable } from 'rxjs';
import { OauthService } from '../../services/oauth.service';

@Component({
  selector: 'app-user-home-page',
  imports: [RouterOutlet,CommonModule,NgxSpinnerComponent,RouterLink],
  templateUrl: './user-home-page.component.html',
  styleUrl: './user-home-page.component.css'
})
export class UserHomePageComponent {
router=inject(Router);
  websocketservice=inject(WebsocketService);
  oauthService=inject(OauthService);
  isAdmin$:Observable<boolean>=this.oauthService.isAdmin$;

  constructor(){
    this.websocketservice.connect();
  }

  notifications:any = [];
  notificationCount = 0;

  
  navigateToCourses()
  {
    this.router.navigate(['/usercourses']);
  }
  ngOnInit() {
    this.isAdmin$=this.oauthService.isAdmin$;
    this.websocketservice.getNotifications().subscribe((message: any) => {
      console.log("Header nunchi rah babu",message);
      const notification = message.body.array.forEach((element: any) => {
        return {message:element};
      });;
      this.notifications.push(notification);
      this.notificationCount = this.notifications.length;
    }
    );
    this.websocketservice.subscribe('/topic/task-result', (message: any) => {
      console.log("Header nunchi rah babu",message.body);
      const notification =message.body;
      this.notifications.push({message:notification});
      this.notificationCount = this.notifications.length;
    }
    );
  }
  removeNotification(note: any) {
    this.notifications = this.notifications.filter((n: any) => n !== note);
  }
}
