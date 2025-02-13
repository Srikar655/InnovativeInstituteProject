import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CoursecrudService {
  url:string="http://localhost:9090/api";
   constructor(private httpClient:HttpClient) { }
  addVideo(value: any) {
    return   this.httpClient.post(this.url+'/addVideo',value);
  }
}
