import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { UserVideos } from '../models/user-videos';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserVideosmanageService {


  constructor(private httpClient:HttpClient) { }
  videos=signal<UserVideos[]>([]);
  url:string='http://localhost:9090/api'
  getVideos(courseId: number, pageNo: number, pageSize: number, scroll: boolean)
  {
    return this.httpClient.get(this.url+`/user-vedios/by-usercourse/${courseId}?page=${pageNo}&size=${pageSize}`).pipe(
      tap(
        res=>
        {
          if(scroll)
          {
            this.videos.update((videos) => [...videos, ...res as UserVideos[]]);
          }
          else
          {
            this.videos.set(res as UserVideos[]);
          }
        }
      )
    )
  }
  generatePaymentId(userVideoId:number)
  {
    return this.httpClient.post(this.url+`/generate-videopayment-id?userVideoId=${userVideoId}`,null);
  }
  verifypayment(paymentDetails: { orderId: any; paymentId: any; signature: any; }) {
    return this.httpClient.post<UserVideos>(this.url+'/videoverify-payment',paymentDetails).pipe(
      tap(
        (res: any) =>
        {
          const video=res.UserVideo as UserVideos;
          const foundvideo=this.videos().find(v=>v.id==video.id);
          console.log(foundvideo);
          if(foundvideo!=null)
          {
            Object.assign(foundvideo, video);
          }
        }
      )
    );
  }
}
