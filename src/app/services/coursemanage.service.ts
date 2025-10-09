import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, OnInit, Signal, signal } from '@angular/core';
import { Course } from '../models/course';
import { catchError, forkJoin, Observable, switchMap, tap } from 'rxjs';
import { Vedio } from '../models/vedio';
import { Task } from '../models/task';
import { FormGroup } from '@angular/forms';
import { Category } from '../models/Category';
import { ErrorHandlingService } from './error-handling.service';

export interface PaginatedResponse<T> {
  content: T[];
  last: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CoursemanageService {

  
  url:string="http://localhost:9090/api/courses";
  url2:string="http://localhost:9090/api/coursecategories";

  constructor(private httpClient:HttpClient , private errorService:ErrorHandlingService) { }
  courseSignal=signal<Course[]>([]);
  category=signal<Category[]>([]);
  
  getCourse(courseId: number) {
    const requestUrl = this.url +'/get?courseId='+courseId;
    return this.httpClient.get<any>(requestUrl)
}


  save(form: any) {
   return  this.httpClient.post(this.url+'/add',form,);
  }
  
  
  getCourses(params?: { page?: number; size?: number; searchTerm?: string; categoryIds?: number[] }): Observable<PaginatedResponse<Course>> {
    return this.httpClient.get<PaginatedResponse<Course>>(`${this.url}/getAll`, {params}).pipe(
      catchError(this.errorService.handleError)
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
    return this.httpClient.delete<any>(`${this.url}/delete/${id}`).pipe(
      catchError(this.errorService.handleError)
    );
  }
  
 
  addCategory(courseCategory: { id: number; category: string; }) {
    return this.httpClient.post(this.url2,courseCategory,{headers:{ 'X-Show-Spinner': 'true' }}).pipe(
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
    return this.httpClient.get(this.url2).pipe(
      tap(
        (res:any)=>
        {
          this.category.set(res);
        }
      )
    )
  }
  
}
