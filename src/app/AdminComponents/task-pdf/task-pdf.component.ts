import { ChangeDetectorRef, Component, inject, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import jsPDF from 'jspdf';
import { Task } from '../../models/task';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

import { tap } from 'rxjs';
import { MatButton } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { SafeUrlPipePipe } from '../../pipes/safe-url-pipe.pipe';
import { TaskscrudService } from '../../services/taskscrud.service';
import { MatIcon } from '@angular/material/icon';
import { PopupserviceService } from '../../services/popupservice.service';
import { TaskAddComponent } from '../task-add/task-add.component';

@Component({
  selector: 'app-task-pdf',
  imports: [MatButton, CommonModule, SafeUrlPipePipe,MatIcon],
  templateUrl: './task-pdf.component.html',
  styleUrl: './task-pdf.component.css'
})
export class TaskPdfComponent implements OnInit, AfterViewInit {
  data: any = inject(MAT_DIALOG_DATA);
  service = inject(TaskscrudService);
  task: Task = {} as Task;
  pdfUrl: any;
  pdf!: Blob;
  pdfgenerated = false;
  isPdfShown = false; 
  dialog = inject(MatDialogRef<TaskPdfComponent>);
  matdialog=inject(MatDialog);
  private elRef = inject(ElementRef);
  worker:Worker | undefined
  poppupservice=inject(PopupserviceService);
  constructor(private cdr: ChangeDetectorRef) {}
  videoId:any;
  ngOnInit() {
    const taskId = this.data.taskId;
    const foundTask = this.service.tasks().find(t => t.id == taskId);
    if (foundTask) {
      this.task = foundTask;
      this.generatePDF();
    } else {
      console.error('Task not found');
    }
    this.videoId=this.data.videoId;
    
  }

  ngAfterViewInit() {
    this.updateDialogSize();
  }

  generatePDF() {
    if(!this.pdfgenerated)
    {
      this.pdfgenerated = true; 
      this.service.getTaskImages(this.task.id).subscribe({
        next:res => {
          this.task.taskimage=res as any[];
          this.worker = new Worker(new URL('../../webworkers/pdf-worker.worker', import.meta.url));

          this.worker.postMessage({taskImages:this.task.taskimage});
          this.worker.onmessage=({data})=>
          {
            this.pdfUrl = URL.createObjectURL(data);
            this.pdf = data
          }
        }
    });
    }
  }
  viewPdf()
  {
    if(!this.pdfgenerated)
    {
      this.generatePDF();
    }
    this.isPdfShown=!this.isPdfShown;
      this.cdr.detectChanges();
        this.updateDialogSize();
  }
   downloadPDF() {
    if (!this.pdfgenerated) {
      this.generatePDF();
    }
    const link = document.createElement('a');
    link.href = URL.createObjectURL(this.pdf);
    link.download = 'task-images.pdf';
    link.click();
  }

  closeDialog() {
    this.dialog.close();
  }

  private updateDialogSize() {
    const dialogElement = this.elRef.nativeElement.closest('.cdk-overlay-pane');
    if (dialogElement) {
      if (this.isPdfShown) {
        dialogElement.style.width = '80vw';
        dialogElement.style.maxHeight = '90vh';
      } else {
        dialogElement.style.width = '50vw';
        dialogElement.style.maxHeight = 'auto';
      }
    }
  }
  editTask(event:Event)
  {
    console.log(this.task);
    const dialog=this.matdialog.open(TaskAddComponent,{
          width: '80vw',  
          height: '80vh', 
          maxWidth: '90vw',
          maxHeight: '90vh',
          panelClass: 'custom-dialog-container',  
          data: { task:this.task,videoId:this.videoId }
        })
    dialog.afterClosed().subscribe((res:any) => {
      if(res)
      {
        this.pdfgenerated=false;
        this.generatePDF();
      }
    });
  }
  deleteTask(event:Event,taskId:number)
  {
    if(event.isTrusted)
    {
      this.service.deleteTask(taskId).subscribe(
        {
          next:res=>
          {
            this.poppupservice.sweetSuccessAllert("Task Deletion Successfull");
            this.dialog.close();
          },
          error:error=>
          {
            console.log(error);
            this.poppupservice.sweetUnSuccessAllert("Task Deletion Failed Try Again After SomeTime..")
          }
          
        }
      ); 
    }
  }
}
