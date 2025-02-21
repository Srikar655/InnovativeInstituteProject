import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { tap } from 'rxjs';
import { Task } from '../models/task';

@Injectable({
  providedIn: 'root'
})
export class TaskscrudService {
  constructor() { }
  httpClient=inject(HttpClient);
  url:string="http://localhost:9090/api";
  tasks=signal<Task[]>([]);
  addTask(task:any)
  {
    const headers = { 'X-Show-Spinner': 'true' };
    if(!task.id)
    {
      return this.httpClient.post(this.url+'/addTask',task,{headers}).pipe(
        tap(
          (res:any)=>
          {
            this.tasks().push(res);
          }
        )
      )
    }
    else
    {
      return this.httpClient.post(this.url+'/updateTask',task,{headers}).pipe(
        tap(
          (res:any)=>
          {
            const t=this.tasks().find(t=>t.id==res.id);
            if(t)
            {
              Object.assign(task,res);
              t.taskimage=task.taskimages
            }
          }
        )
      )
    }
  }
  editTask(task:any)
  {
    const headers = { 'X-Show-Spinner': 'true' };
    return this.httpClient.post(this.url+'/editTask',task,{headers}).pipe(
      tap(
        (res:any)=>
        {
          const t=this.tasks().find(t=>t.id==task.id);
          if(t)
          {
            Object.assign(t,res);            
          }
        }
      )
    )
  }
  deleteTask(id:number)
  {
    const headers = { 'X-Show-Spinner': 'true' };
    return this.httpClient.get(this.url+'/deleteTask?taskId='+id,{headers}).pipe(
      tap(
        (res:any)=>
        {
          const index=this.tasks().findIndex(t=>t.id==id);
          if(index!=-1)
          {
            this.tasks().splice(index,1);
          }
        }
      )
    )
  }
  getTasks(videoId: number, page: number, fetchSize: number, onScroll: boolean) {
    const params = new HttpParams()
      .set('videoId', videoId.toString())
      .set('size', fetchSize.toString())
      .set('page', page.toString());
  
     return this.httpClient.post(this.url + '/getTasks', null, {
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
    );
  }
  getTaskImages(id: number) {
    
    const headers = { 'X-Show-Spinner': 'true' };
    return this.httpClient.get(`${this.url}/findTaskImages?taskId=${id}`,{headers}).pipe(
      tap(res=>
      {
        const task=this.tasks().find(t=>t.id==id);
        if (task) {
          task.taskimage = res as any[];
        }
      }
      )
    );
  }
  deleteimage(imageId: number,taskId:number) {
    return this.httpClient.get(this.url+'/deleteTaskImage?imageId='+imageId).pipe(
      tap(
        (res:any)=>
        {
          const task=this.tasks().find(t=>t.id==taskId);
          if (task) {
            const imageIndex = task.taskimage.findIndex(image => image.id == imageId);
            if (imageIndex > -1) {
              task.taskimage.splice(imageIndex, 1);
            }
          }
        }
      )
    )
  }
}
