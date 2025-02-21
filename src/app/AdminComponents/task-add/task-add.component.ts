import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Task } from '../../models/task';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TaskscrudService } from '../../services/taskscrud.service';
import { PopupserviceService } from '../../services/popupservice.service';
import { tap } from 'rxjs';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-task-add',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './task-add.component.html',
  styleUrl: './task-add.component.css'
})
export class TaskAddComponent implements OnInit{
  data=inject(MAT_DIALOG_DATA);
  videoId:any;
  task!:Task;
  dialog=inject(MatDialogRef<TaskAddComponent>);
  fb=inject(FormBuilder);
  service=inject(TaskscrudService);
  popupService=inject(PopupserviceService);
  myReactiveForm!:FormGroup;
  worker!:Worker;
  ngOnInit(): void {
    this.videoId=this.data.videoId;

    this.task=this.data.task || null;
    this.myReactiveForm=this.fb.group({
          id:[this.task?.id || null],
          task:[ this.task?.task || '',[Validators.required,Validators.minLength(6),Validators.maxLength(100)]],
          taskurl:[this.task?.taskurl ||  '',[Validators.required]],
          taskprice:[this.task?.taskprice || '',[Validators.required,Validators.minLength(6),Validators.maxLength(500)]],
          video:[{id:this.videoId}],
          taskimages: this.fb.array(
            (this.task?.taskimage?.length ? this.task.taskimage.map(t => this.fb.group({
              id: t.id,
              taskImage: t.taskImage,
              displayImage: `data:image/png;base64,${t.taskImage}`
            })) : [])
          )
          
        });
  }
  get taskImages(): FormArray {
    return this.myReactiveForm.get('taskimages') as FormArray;
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
            const task = this.myReactiveForm.get('taskimages') as FormArray;
            console.log(Array.from(data));
            task.push(this.fb.control({taskImage:Array.from(data),displayImage:URL.createObjectURL(file)}));
          }
    }
    save(event:Event)
    {
      console.log(this.myReactiveForm.value);
      if(event.isTrusted)
      {
        if(this.myReactiveForm.valid)
        {
          this.service.addTask(this.myReactiveForm.value).subscribe(
            {
              next:(res:any)=>
              {
                this.popupService.sweetSuccessAllert("Task Saved Successfully");
                this.dialog.close(res);
              },
              error:error=>
              {
                console.log(error);
                this.popupService.sweetUnSuccessAllert("An Error Occured While Saving Task Please Try Again...")
              }
            }
          );
        }
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
        const taskArray = this.myReactiveForm.get('taskimages') as FormArray;
        taskArray.removeAt(index);
        this.popupService.sweetSuccessAllert("Task Image Deletion Done..");
      }
    }
    
}
