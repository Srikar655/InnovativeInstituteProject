import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Vedio } from '../models/vedio';
import { catchError, of, tap } from 'rxjs';
import { PopupserviceService } from './popupservice.service';

@Injectable({
  providedIn: 'root'
})
export class CoursecrudService {
  url:string="http://localhost:9090/api";
  videos=signal<Vedio[]>([]);
   constructor(private httpClient:HttpClient) { }
   poppupservice=inject(PopupserviceService);
  addVideo(video: any) {
    const v=this.videos().find(v=>v.id==video.id);
    if(v)
    {
        return this.httpClient.post(this.url+'/updateVideo',video).pipe(
          tap((result:any)=>{
            if (result) {
              const video = this.videos().find(v => v.id == result.id);
              if (video) {
                Object.assign(video, result);
                this.poppupservice.sweetSuccessAllert("Video Updated")
              }
            }
          }
          )
        );
    }
    else
    {
       return this.httpClient.post(this.url+'/addVideo',video).pipe(
          tap((result:any)=>{
            if (result) {
                this.videos().push(result);
              }
            }

          ),
          catchError((error:any)=>{
            console.log(error)
            return of();
          }))
    }
  }

  getVideos(courseId: number, page: number, fetchSize: number, onScroll: boolean) {
    const params = new HttpParams()
      .set('courseId', courseId.toString())
      .set('size', fetchSize.toString())
      .set('page', page.toString());
  
     this.httpClient.post(this.url + '/getVideos', null, {
      headers: {
        'Content-Type': 'application/json',
      },
      params: params,
    }).pipe(
      tap((res: any) => {
          if (onScroll) {
            this.videos.update((videos) => [...videos, ...res]);
          } else {
            this.videos.set(res);
          }
      })
    ).subscribe({
      error: (error) => console.log(error)
    });
  }
  deletevideo(id: number | undefined) {
    return this.httpClient.get(this.url+'/deleteVideo?videoId='+id).pipe(
      tap(
        (res:any)=>{
          const index = this.videos().findIndex(v => v.id === id);
          if (index !== -1) {
            this.videos().splice(index, 1);
          }
        }
      )
    )
  }
}
