import { ChangeDetectorRef, Component, inject, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import jsPDF from 'jspdf';
import { Task } from '../../models/task';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CoursemanageService } from '../../services/coursemanage.service';
import { tap } from 'rxjs';
import { MatButton } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { SafeUrlPipePipe } from '../../pipes/safe-url-pipe.pipe';

@Component({
  selector: 'app-task-pdf',
  imports: [MatButton, CommonModule, SafeUrlPipePipe],
  templateUrl: './task-pdf.component.html',
  styleUrl: './task-pdf.component.css'
})
export class TaskPdfComponent implements OnInit, AfterViewInit {
  data: any = inject(MAT_DIALOG_DATA);
  service = inject(CoursemanageService);
  task: Task = {} as Task;
  pdfUrl: any;
  pdf!: jsPDF;
  pdfgenerated = false;
  isPdfShown = false; 
  dialog = inject(MatDialogRef<TaskPdfComponent>);
  private elRef = inject(ElementRef);
  worker:Worker | undefined
  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.task = this.data.task;
    this.service.getTaskImages(this.task.id).pipe(
      tap((res: any) => {
        console.log(res);
        this.task.taskimage = res;
        this.generatePDF();
      })
    ).subscribe({ error: error => console.log(error) });
  }

  ngAfterViewInit() {
    this.updateDialogSize();
  }

  generatePDF() {
    if(!this.pdfgenerated)
    {
      this.pdf = new jsPDF();
      this.worker = new Worker(new URL('../../webworkers/pdf-worker.worker', import.meta.url));

      this.worker.postMessage({taskImages:this.task.taskimage});
      this.worker.onmessage=({data})=>
      {
        this.pdfUrl = URL.createObjectURL(data);
        this.pdfgenerated = true; 
      }
    }
  }
  viewPdf()
  {
    this.isPdfShown=!this.isPdfShown;
    this.cdr.detectChanges();
      this.updateDialogSize();
  }
   downloadPDF() {
    if (!this.pdfgenerated) {
      this.generatePDF();
    }
    this.pdf.save('task-images.pdf');
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
}
