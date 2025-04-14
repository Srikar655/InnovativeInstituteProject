import { ChangeDetectorRef, Component, ElementRef, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Usertask } from '../../models/usertask';
import { UsertaskService } from '../../userservices/usertask.service';
import { TaskscrudService } from '../../services/taskscrud.service';
import { SafeUrlPipePipe } from "../../pipes/safe-url-pipe.pipe";
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { UploadtaskresultComponent } from '../uploadtaskresult/uploadtaskresult.component';
import { EmailDetails } from '../../models/EmailDetails';

@Component({
  selector: 'app-task-view',
  imports: [SafeUrlPipePipe,CommonModule,CurrencyPipe,MatButton],
  templateUrl: './task-view.component.html',
  styleUrl: './task-view.component.css'
})
export class TaskViewComponent {
  data: any = inject(MAT_DIALOG_DATA);
    service = inject(UsertaskService);
    service2=inject(TaskscrudService)
    task: Usertask = {} as Usertask;
    pdfUrl: any;
    pdfgenerated = false;
    isPdfShown = false; 
    dialog = inject(MatDialogRef<TaskViewComponent>);
    matdialog=inject(MatDialog);
    private elRef = inject(ElementRef);
    worker:Worker | undefined
    constructor(private cdr: ChangeDetectorRef) {}
    ngOnInit() {
      const taskId = this.data.taskId;
      const foundTask = this.service.tasks().find(t => t.id == taskId);
      if (foundTask) {
        this.task = foundTask;
        this.generatePDF();
      } else {
        console.error('Task not found');
      }
      
    }
  
    ngAfterViewInit() {
      this.updateDialogSize();
    }
  
    generatePDF() {
      if(!this.pdfgenerated)
      {
        this.pdfgenerated = true; 
        this.service2.getTaskImages(this.task.task.id).subscribe({
          next:res => {
            console.log(res);
            this.task.task.taskimage=res as any[];
            this.worker = new Worker(new URL('../../webworkers/pdf-worker.worker', import.meta.url));
  
            this.worker.postMessage({
              taskImages: this.task.task.taskimage.map((image: any) => image.taskImage)
            });
            this.worker.onmessage=({data})=>
            {
              this.pdfUrl = URL.createObjectURL(data);
              
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
      link.href = this.pdfUrl;
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
    uploadYourResult() 
    {
      this.matdialog.open(UploadtaskresultComponent, {
        width: '80vw',
        height: '80vh',
        maxWidth: '90vw',
        maxHeight: '90vh',
        panelClass: 'custom-dialog-container',
        data: { taskId: this.task.id}
      });
    }
}
