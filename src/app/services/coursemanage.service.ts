import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, OnInit, Signal, signal } from '@angular/core';
import { Course } from '../models/course';
import { forkJoin, Observable, switchMap, tap } from 'rxjs';
import { Vedio } from '../models/vedio';
import { Task } from '../models/task';
import { FormGroup } from '@angular/forms';
import { Category } from '../models/Category';

@Injectable({
  providedIn: 'root'
})
export class CoursemanageService {

  
  url:string="http://localhost:9090/api/courses";
  url2:string="http://localhost:9090/api/coursecategories";

  constructor(private httpClient:HttpClient) { }
  courseSignal=signal<Course[]>([]);
  category=signal<Category[]>([]);
  
  getCourse(courseId: number) {
    const requestUrl = this.url +'/get?courseId='+courseId;
    return this.httpClient.get<any>(requestUrl)
}


  save(form: any) {
    const headers = { 'X-Show-Spinner': 'true' };
   return  this.httpClient.post(this.url+'/add',form,{headers}).pipe(
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
   return  this.httpClient.get<Course[]>(`${this.url}/getAll`,{headers}).pipe(
      tap(
        (courses:any)=>{
          this.courseSignal.set(courses)
        }
      )
    );
  }

  getCourseThumbnail(courseId: number) {
    return this.httpClient.get(`${this.url}/findCourseThumbnail?courseId=`+courseId).pipe(
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
    return this.httpClient.put(`${this.url}/update`,form,{headers}).pipe(
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
    const requestUrl = this.url +'/delete?courseId='+id;
    return this.httpClient.delete<any>(requestUrl,{headers}).pipe(
      tap(
        (res:any)=>
        {
          this.courseSignal().splice(this.courseSignal().findIndex(c => c.id === id), 1);
        }
      ) );
  }
  
 
  addCategory(newCategory: { id: number; category: string; }) {
    return this.httpClient.post(this.url2,newCategory,{headers:{ 'X-Show-Spinner': 'true' }}).pipe(
      tap(
        (res:any)=>
        {
          this.category().push(res);
        }
      )
    )
  }
  getCategories()
  {
    return this.httpClient.get(this.url2,{headers:{'X-Show-Spinner': 'true'}}).pipe(
      tap(
        (res:any)=>
        {
          this.category.set(res);
        }
      )
    )
  }
  
}
