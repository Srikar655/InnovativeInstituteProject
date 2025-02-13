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
  videos=signal<Vedio[]>([]);
  tasks=signal<Task[]>([]);
  getCourse(courseId: number): import("@angular/core").WritableSignal<any> {
    const course = signal<any>({});
    const requestUrl = this.url +'/findCourse?courseId='+courseId;
    this.httpClient.get<any>(requestUrl).pipe(
        tap(value => {course.set(value)})
    ).subscribe({
        error: (error) => console.log("Error:", error)  
    });

    return course;
}


  save(form: any) {
   return  this.httpClient.post(this.url+'/addCourse',form);
  }
  
  
  get() {
    this.httpClient.get<Course[]>(`${this.url}/getCourse`).subscribe({
      next: (courses) => this.courseSignal.set(courses),
      error: (error) => console.error('Error fetching courses:', error)
    });
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
