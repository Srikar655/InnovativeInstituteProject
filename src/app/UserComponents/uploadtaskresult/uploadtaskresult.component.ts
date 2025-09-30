import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TaskAddComponent } from '../../AdminComponents/task-add/task-add.component';
import { UsertaskService } from '../../userservices/usertask.service';
import { PopupserviceService } from '../../services/popupservice.service';
import { OauthService } from '../../services/oauth.service';

@Component({
  selector: 'app-uploadtaskresult',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './uploadtaskresult.component.html',
  styleUrl: './uploadtaskresult.component.css'
})
export class UploadtaskresultComponent {
  data=inject(MAT_DIALOG_DATA);
  formbuilder=inject(FormBuilder);
  myReactiveForm!:FormGroup;
  dialog=inject(MatDialogRef<TaskAddComponent>);
  usertaskid:number=0;
  service=inject(UsertaskService);
  worker!:Worker;
  selectedImages:any=[];
  gitHubToken=false;
  popupservice=inject(PopupserviceService);
  oauthService=inject(OauthService);
  ngOnInit()
  {
    this.usertaskid=this.data.taskId;
    this.myReactiveForm=this.formbuilder.group({
      usertask:[{id:this.usertaskid}],
      solutionimages:this.formbuilder.array([]),
      description:['',[Validators.required,Validators.minLength(6),Validators.maxLength(100)]]
    });
    localStorage.getItem('githubtoken')?this.gitHubToken=true:this.gitHubToken=false;
  }
  get taskImages(): FormArray {
      return this.myReactiveForm.get('solutionimages') as FormArray;
    }
    fileChanged($event: any): void {
        if ($event.isTrusted) {
          const inputElement = $event.target as HTMLInputElement;
          const files = inputElement.files;
          if (files) {
            for (let i = 0; i < files.length; i++) {
              const file = files[i];
              this.readFile(file); 
            }
          }
        }
      }
      readFile(file: File): void {
        
          this.worker=new Worker(new URL('../../webworkers/readfiletobytes.worker',import.meta.url))
          this.worker.postMessage({file:file});
          this.worker.onmessage=({data})=>
            {
              const task = this.myReactiveForm.get('solutionimages') as FormArray;
              task.push(this.formbuilder.control(Array.from(data)));
              this.selectedImages.push(URL.createObjectURL(file));
            }
      }
      save(event:Event)
      {
        if(event.isTrusted)
        {
          this.service.uploadTaskResult(this.myReactiveForm.value).subscribe({
            next:(res:any)=>{
              console.log(res);
              this.popupservice.sweetSuccessAllert('Task Result Uploaded Successfully Hope Your Performance Will Be Good');
              this.dialog.close(true);
            }
          })
        }
      }
      onCancel(event:Event)
      {
        if(event.isTrusted)
        {
          this.dialog.close();
        }
      }
      onDeleteImage(event:Event,index:  number) {
        if(event.isTrusted)
        {
          const taskArray = this.myReactiveForm.get('solutionimages') as FormArray;
          taskArray.removeAt(index);
          this.selectedImages.splice(index, 1);
        }
      }
      loginGitHub($event: Event) {
        if($event.isTrusted)
        {
          console.log('Login to GitHub');
          this.oauthService.checkIsGitHubLoggedIn();
        }
      }
}
