import { Component, computed, ElementRef, inject, model, OnInit, Signal, signal, ViewChild } from '@angular/core';
import { CoursemanageService } from '../../services/coursemanage.service';
import { Task } from '../../models/task';

import { CommonModule } from '@angular/common';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { MatButtonModule } from '@angular/material/button';

import { MatDialog } from '@angular/material/dialog';
import { TaskPdfComponent } from '../task-pdf/task-pdf.component';


@Component({
  selector: 'app-tasks',
  imports: [ CommonModule, InfiniteScrollDirective,MatButtonModule],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css'
})
export class TasksComponent {
  service = inject(CoursemanageService);
  tasks: Signal<Task[]> = this.service.tasks;
  videoId = model<number>();
  page = 0;
  filedialog=inject(MatDialog);
  fetchSize = 6;
  dynamicFetchSize = 6;
  isModalOpen = false;
  selectedTask: Task | null = null;  

  @ViewChild('scrollableDiv') scrollableDiv!: ElementRef;

  fetchTasks = computed(() => {
    const id = this.videoId() as number;
    if (id !== null) {
      this.service.getTasks(id, this.page, this.fetchSize, false);
    }
    return this.videoId();
  });

  openModal() {
    this.isModalOpen = true;
    this.page++;
    this.service.getTasks(this.videoId() as number, this.page, this.dynamicFetchSize, true);
  }

  closeModal() {
    this.isModalOpen = false;
  }

  onScroll() {
    this.page++;
    console.log("scrolling");
    this.service.getTasks(this.videoId() as number, this.page, this.dynamicFetchSize, true);
  }

  
  
  closeTaskDetails() {
    this.selectedTask = null;  // Clear the selected task when modal is closed
    this.isModalOpen = false;  // Close the task details modal
  }
  openTaskDetails(task:Task)
  {
    this.filedialog.open(TaskPdfComponent,{
      width: '80vw',  
      height: '80vh', 
      maxWidth: '90vw',
      maxHeight: '90vh',
      panelClass: 'custom-dialog-container',  
      data: { task:task }
    });
  }
  
}
