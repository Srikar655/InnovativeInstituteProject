import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserCourseService {

  
  url:string="http://localhost:9090";
  constructor(private httpclient:HttpClient) { }
  getUserCourse(courseId:number)
  {
    return this.httpclient.get(this.url+`/api/usercourses/${courseId}`)
  }
  payment(id: number | undefined) {
    return this.httpclient.post(this.url+'/api/create-coursesubscriptionorder?courseId='+id, null);
  }
  verifypayment(paymentDetails: { paymentId: any }) {
    return this.httpclient.post(this.url+`/api/coursepayment/verify`,paymentDetails);
  }
}
