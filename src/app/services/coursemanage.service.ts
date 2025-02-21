import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, OnInit, Signal, signal } from '@angular/core';
import { Course } from '../models/course';
import { forkJoin, Observable, switchMap, tap } from 'rxjs';
import { Vedio } from '../models/vedio';
import { Task } from '../models/task';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class CoursemanageService {
  
  url:string="http://localhost:9090/api";

  constructor(private httpClient:HttpClient) { }
  courseSignal=signal<Course[]>([]);
  
  
  getCourse(courseId: number) {
    const requestUrl = this.url +'/findCourse?courseId='+courseId;
    return this.httpClient.get<any>(requestUrl)
}


  save(form: any) {
    const headers = { 'X-Show-Spinner': 'true' };
   return  this.httpClient.post(this.url+'/addCourse',form,{headers}).pipe(
    tap(
      (res:any)=>
      {
        this.courseSignal().push(res);
      }
    )
   );
  }
  
  
  get() {
    const headers = { 'X-Show-Spinner': 'true' };
   return  this.httpClient.get<Course[]>(`${this.url}/getCourse`,{headers}).pipe(
      tap(
        (courses:any)=>{
          this.courseSignal.set(courses)
        }
      )
    );
  }

  getCourseThumbnail(courseId: number) {
    return this.httpClient.post(`${this.url}/findCourseThumbnail`,courseId).pipe(
      tap(
        (res: any)=>
        {
          const course = this.courseSignal().find(i => i.id == courseId);
          if (course) {
            course.coursethumbnail = res.coursethumbnail as Uint8Array;
          }
        }
      )
    );
  }

  editCourse(form: FormGroup) {
    const headers = { 'X-Show-Spinner': 'true' };
    return this.httpClient.post(`${this.url}/editCourse`,form,{headers}).pipe(
      tap(
        (res: any)=>
        {
          const course = this.courseSignal().find(i => i.id == res.id);
          if (course) {
            course.coursename = res.coursename;
            course.courseprice = res.courseprice;
            course.courseDescription = res.courseDescription;
            course.courseFeatures = res.courseFeatures;
            course.courseTrailer = res.courseTrailer;
          }
        }
      )
    );
  }
  deleteCourse(id: number) {
    const headers = { 'X-Show-Spinner': 'true' };
    const requestUrl = this.url +'/deleteCourse?courseId='+id;
    return this.httpClient.get<any>(requestUrl,{headers}).pipe(
      tap(
        (res:any)=>
        {
          this.courseSignal().splice(this.courseSignal().findIndex(c => c.id === id), 1);
        }
      ) );
  }
  

  

  
}
