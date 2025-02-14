import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, OnInit, Signal, signal } from '@angular/core';
import { Course } from '../models/course';
import { forkJoin, Observable, switchMap, tap } from 'rxjs';
import { Vedio } from '../models/vedio';
import { Task } from '../models/task';

@Injectable({
  providedIn: 'root'
})
export class CoursemanageService {
  url:string="http://localhost:9090/api";

  constructor(private httpClient:HttpClient) { }
  courseSignal=signal<Course[]>([]);
  
  tasks=signal<Task[]>([]);
  getCourse(courseId: number) {
    const requestUrl = this.url +'/findCourse?courseId='+courseId;
    return this.httpClient.get<any>(requestUrl)
}


  save(form: any) {
   return  this.httpClient.post(this.url+'/addCourse',form).pipe(
    tap(
      (res:any)=>
      {
        this.courseSignal().push(res);
      }
    )
   );
  }
  
  
  get() {
   return  this.httpClient.get<Course[]>(`${this.url}/getCourse`).pipe(
      tap(
        (courses:any)=>{
          this.courseSignal.set(courses)
        }
      )
    );
  }

  getCourseThumbnail(courseId: number): Observable<Uint8Array> {
    return this.httpClient.get(`${this.url}/findCourseThumbnail?courseId=${courseId}`, { responseType: 'blob' }).pipe(
      switchMap(blob => new Observable<Uint8Array>(observer => {
        const reader = new FileReader();
        reader.onloadend = () => {
          observer.next(new Uint8Array(reader.result as ArrayBuffer));
          observer.complete();
        };
        reader.readAsArrayBuffer(blob);
      }))
    );
  }
  

  

  getTasks(videoId: number, page: number, fetchSize: number, onScroll: boolean) {
    const params = new HttpParams()
      .set('videoId', videoId.toString())
      .set('size', fetchSize.toString())
      .set('page', page.toString());
  
     this.httpClient.post(this.url + '/getTasks', null, {
      headers: {
        'Content-Type': 'application/json',
      },
      params: params,
    }).pipe(
      tap((res: any) => {
          if (onScroll) {
            this.tasks.update((tasks) => [...tasks, ...res]);
          } else {
            this.tasks.set(res);
          }
        }
      )
    ).subscribe({
      error: (error) => console.log(error)
    });
  }
  getTaskImages(id: number) {
    
    return this.httpClient.get(`${this.url}/findTaskImages?taskId=${id}`);
  }
}
