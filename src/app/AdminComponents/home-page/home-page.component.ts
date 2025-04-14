import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { WebsocketService } from '../../services/websocket.service';
@Component({
  selector: 'app-home-page',
  imports: [RouterLink,CommonModule],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent implements OnInit {
  router=inject(Router);
  websocketservice=inject(WebsocketService);
  
  constructor(){
    this.websocketservice.connect();
  }

  notifications:any = [];
  notificationCount = 0;

  
  navigateToCourses()
  {
    this.router.navigate(['/user-homepage']);
  }
  ngOnInit() {
    // `this.websocketservice.getNotifications().subscribe((message: any) => {
    //   console.log("Header nunchi rah babu",message.body);
    //   const notification = JSON.parse(message.body);
    //   this.notifications.push(notification);
    //   this.notificationCount = this.notifications.length;
    // }
    // );`
    this.websocketservice.subscribe('/topic/task-result', (message: any) => {
      console.log("Header nunchi rah babu",message.body);
      const notification = JSON.parse(message.body);
      this.notifications.push(notification);
      this.notificationCount = this.notifications.length;
    }
    );
  }
  removeNotification(note: any) {
    this.notifications = this.notifications.filter((n: any) => n !== note);
  }
  
  
}
