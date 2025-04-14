import { Component, inject, Signal } from '@angular/core';
import { UsertaskService } from '../../userservices/usertask.service';
import { PopupserviceService } from '../../services/popupservice.service';
import { UserTaskSolutions } from '../../models/user-task-solutions';
import { SafeUrlPipePipe } from "../../pipes/safe-url-pipe.pipe";
import { AudioServiceService } from '../../services/audio-service.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-task-solution-notifyinglist',
  imports: [SafeUrlPipePipe,ReactiveFormsModule],
  templateUrl: './user-task-solution-notifyinglist.component.html',
  styleUrl: './user-task-solution-notifyinglist.component.css'
})
export class UserTaskSolutionNotifyinglistComponent {

  service=inject(UsertaskService);
  popupservice=inject(PopupserviceService);
  taskResults:Signal<UserTaskSolutions[]>=this.service.userTaskSolutions;
  pageNumber=0;
  pageSize=5;
  worker!:Worker;
  pdfUrl:any;
  noMoreRecords=false;
  audioService=inject(AudioServiceService);
  selectedSolution:UserTaskSolutions | null=null;
  isRecording:boolean=false;
  fb=inject(FormBuilder);
  myReactiveForm!:FormGroup;

  ngOnInit()
  {
    this.service.getTaskResults(this.pageNumber,this.pageSize).subscribe({
      next:(res:any)=>{
        this.pageNumber++;
        if(res.length<this.pageSize)
        {
          this.noMoreRecords=true;
        }
      },
      error:(err:any)=>{
        console.error(err);
        this.popupservice.sweetUnSuccessAllert('Error Fetching Task Results');
      }
    })
  }
  onSelect(solution:UserTaskSolutions) {
    this.myReactiveForm=this.fb.group({
      id:[solution.id,[Validators.required]],
      correctionStatus:['',[Validators.required]],
      audioAdvice:[[],[]]
    });
    this.service.getTaskResultImages(solution.id).subscribe({
      next:(res:any)=>{
        this.selectedSolution=solution;
        this.worker = new Worker(new URL('../../webworkers/pdf-worker.worker', import.meta.url));
        this.worker.postMessage({
          taskImages: this.selectedSolution.solutionimages
        });
          this.worker.onmessage=({data})=>
          {
            this.pdfUrl = URL.createObjectURL(data);
          }
      },error:(err:any)=>{
        console.error(err)
      }
    });
  }
    onSubmit(event:Event) {
        if(event.isTrusted)
        {
          console.log(this.myReactiveForm.value);
          this.service.submitReview(this.myReactiveForm.value).subscribe({
            next:(res:any)=>{
              this.popupservice.sweetSuccessAllert('Review Submitted Successfully');
              this.myReactiveForm.reset();
              this.selectedSolution=null;
              this.worker.terminate();
            }
            ,error:(err:any)=>{
              console.error(err);
              this.popupservice.sweetUnSuccessAllert('Error Submitting Review');
            }
          });
        }
    } 
    startRecording() {
      this.isRecording=!this.isRecording
      if(this.isRecording)
      {
        const audioAdvice=this.myReactiveForm.get('audioAdvice') as FormGroup;
        this.audioService.startRecording(document.querySelector('.playback'),audioAdvice)
          .then(() => console.log('Recording started'))
          .catch((error) => console.error('Error starting recording:', error));
      }
      else
      {
        this.stopRecording();
      }
    }
  
    stopRecording() {

      this.audioService.stopRecording()
        .then(() => {
          console.log('Recording stopped');
          
                  
        })
        .catch((error) => console.error('Error stopping recording:', error));
    }
}
