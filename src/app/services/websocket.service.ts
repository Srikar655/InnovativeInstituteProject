import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private stompClient:Client;
  http=inject(HttpClient);
  private serverUrl: string = 'http://localhost:9090/ws'; // Replace with your WebSocket server URL
  constructor() {
    const socket = new SockJS(this.serverUrl);
    socket.binaryType = 'arraybuffer';
    this.stompClient = new Client({
      webSocketFactory: () => socket,
      debug: (msg: string) => { console.log(msg); },
      reconnectDelay: 5000,
      onConnect: (frame: any) => {
        console.log('Connected: ' + frame);
      },
      onStompError: (frame: any) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
      }
    });
   }
   public connect() {
    this.stompClient.activate();
    console.log("Hello");
   }
   public disconnect() {
    this.stompClient.deactivate();
   }
    public sendMessage(destination: string, message: any) {
      this.stompClient.publish({destination: destination, body: JSON.stringify(message),headers:{ 'content-type': 'application/json' }});
      
    }
    public subscribe(destination: string, callback: (message: IMessage) => void) {
      if(this.stompClient.connected)
      {
        this.stompClient.subscribe(destination, (message: IMessage) => {
          console.log("Subscribing to: ",destination, "Message");
          callback(message);
          
        });
        return ;
      }
      this.stompClient.onConnect = (frame: any) => {
        this.stompClient.subscribe(destination, (message: IMessage) => {
          console.log("Subscribing to: ",destination, "Message");
          callback(message);
          
        });
      
    }
  }
  public getNotifications(){
    return this.http.get<string[]>('http://localhost:9090/api/user-task-solution/notifications',{responseType: 'text' as 'json'});
  }
}
