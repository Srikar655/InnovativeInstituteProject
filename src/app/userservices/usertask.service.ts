import { inject, Injectable, signal } from '@angular/core';
import { Usertask } from '../models/usertask';
import { HttpClient } from '@angular/common/http';
import { of, tap } from 'rxjs';
import { UserTaskSolutions } from '../models/user-task-solutions';
import { WebsocketService } from '../services/websocket.service';

@Injectable({
  providedIn: 'root'
})
export class UsertaskService {

  tasks=signal<Usertask[]>([]);
  userTaskSolutions=signal<UserTaskSolutions[]>([]);
   url='http://localhost:9090';
  constructor(private httpClient:HttpClient) {
    
   }
  
  getTasks(videoId:number | undefined , pageNumber:number, pageSize:number) {
    if(videoId)
    {
      return this.httpClient.get(this.url+`/api/user-tasks/usertasks-byvedioId?userVedioId=${videoId}&size=${pageSize}&page=${pageNumber}`).pipe(
        tap(
          (res:any)=>{
            if(pageNumber==0)
            {
              this.tasks.set(res as Usertask[]);
            }
            else
            {
              this.tasks.update((tasks)=>[...tasks,...res as Usertask[]]);
            }
            console.log(this.tasks());
          }
        )
      );
    }
    return null;
  }
  verifypayment(paymentDetails: { orderId: any; paymentId: any; signature: any; }) {
    return this.httpClient.post(this.url+`/api/taskverify-payment`,paymentDetails).pipe(
      tap((res:any)=>{
        const newusertask:Usertask=res.UserTask as Usertask;
        const task=this.tasks().find((task)=>task.id==newusertask.id);
        if(task)
        {
          Object.assign(task,newusertask);
        }
      })
    );
  }
  generatePaymentId(userTaskId: number) {
    return this.httpClient.post(this.url+`/api/generate-taskpayment-id?userTaskId=${userTaskId}`,null);
  }
  uploadTaskResult(formData: any) {
    
    const headers = { 'X-Show-Spinner': 'true' };
    return this.httpClient.post(this.url+`/api/user-task-solution`,formData,{headers});
  }
  getTaskResults(pageNumber:number,pageSize:number) {
    const headers = { 'X-Show-Spinner': 'true' };
    return this.httpClient.get(this.url+`/api/user-task-solution/all?page=${pageNumber}&size=${pageSize}`,{headers}).pipe(
      tap((res:any)=>{
        this.userTaskSolutions.set(res as UserTaskSolutions[]);
      })
    );
}
getTaskResultImages(taskResultId:number) {
  const headers = { 'X-Show-Spinner': 'true' };
    return this.httpClient.get(this.url+`/api/user-task-solution/all-solution-images?userSolutionId=${taskResultId}`,{headers}).pipe(
      tap((res:any)=>{
        const taskResults=this.userTaskSolutions().find((taskResult)=>taskResult.id==taskResultId);
        if(taskResults)
        {
          taskResults.solutionimages=res.solutionimages as Uint8Array[];
        }
      })
    );
}
    submitReview(userTaskSolution:any)
    {
      const headers = { 'X-Show-Spinner': 'true' };
      return this.httpClient.post(this.url+`/api/user-task-solution/review-success`,userTaskSolution,{headers});
    }
}
