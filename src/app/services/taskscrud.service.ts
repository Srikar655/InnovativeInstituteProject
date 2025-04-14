import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { tap } from 'rxjs';
import { Task } from '../models/task';

@Injectable({
  providedIn: 'root'
})
export class TaskscrudService {
  clearTasks() {
    this.tasks.set([]);
  }
  constructor() { }
  httpClient=inject(HttpClient);
  url1:string="http://localhost:9090/api/tasks";
  url2:string="http://localhost:9090/api/taskImages";
  tasks=signal<Task[]>([]);
  addTask(task:any)
  {
    const headers = { 'X-Show-Spinner': 'true' };
    if(!task.id)
    {
      return this.httpClient.post(this.url1+'/add',task,{headers}).pipe(
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
      return this.httpClient.put(this.url1+'/update',task,{headers}).pipe(
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
    return this.httpClient.put(this.url1+'/update',task,{headers}).pipe(
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
    return this.httpClient.delete(this.url1+'/delete?taskId='+id,{headers}).pipe(
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
  
     return this.httpClient.get(this.url1 + '/getAll', {
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
    return this.httpClient.get(`${this.url2}/getAll?taskId=${id}`,{headers}).pipe(
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
    return this.httpClient.delete(this.url2+'/deleteTaskImage?imageId='+imageId).pipe(
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
