import { Component, computed, ElementRef, inject, QueryList, Signal, AfterViewInit, model, ViewChildren } from '@angular/core';
import { Task } from '../../models/task';

import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { TaskPdfComponent } from '../task-pdf/task-pdf.component';
import { TaskscrudService } from '../../services/taskscrud.service';
import { TaskAddComponent } from '../task-add/task-add.component';


@Component({
  selector: 'app-tasks',
  imports: [CommonModule, MatButtonModule],
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements AfterViewInit {
  service = inject(TaskscrudService);
  tasks: Signal<Task[]> = this.service.tasks;
  videoId = model<number>();
  page = 0;
  filedialog = inject(MatDialog);
  fetchSize = 6;
  dynamicFetchSize = 6;
  isModalOpen = false;
  selectedTask: Task | null = null;  
  observer!: IntersectionObserver;
  noMoreTasks = false;

  @ViewChildren('scrollableItem') scrollableDiv!: QueryList<ElementRef>;

  fetchTasks = computed(() => {
    const id = this.videoId() as number;
    if (id !== null) {
      this.service.getTasks(id, this.page, this.fetchSize, false).subscribe({
        next: (res) => {
          this.page += 1;
          if (res.length < this.dynamicFetchSize) {
            this.noMoreTasks = true;
          }
        },
        error: (err) => {
          console.log(err);
        }
    });
    }
    return this.videoId();
  });

  ngAfterViewInit() {
    this.observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        this.onScroll();
      }
    }, {
      threshold: 0.25,
      rootMargin: '50px',
      root: null
    });
    this.observeLastItem();
    this.scrollableDiv.changes.subscribe(() => {
      this.observeLastItem();
    });
  }

  observeLastItem() {
    if (this.scrollableDiv && this.scrollableDiv.last) {
      const lastElement = this.scrollableDiv.last.nativeElement;
      if (this.observer) {
        this.observer.observe(lastElement);
      }
    }
  }

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
    if (!this.noMoreTasks) {
      this.service.getTasks(this.videoId() as number, this.page, this.dynamicFetchSize, true).subscribe({next:(newTasks) => {
        if (newTasks.length < this.dynamicFetchSize) {
          this.noMoreTasks = true;
        }
      },
      error: (err) => {
        console.log(err);
      }
      });
    }
  }

  closeTaskDetails() {
    this.selectedTask = null;
    this.isModalOpen = false;
  }

  openTaskDetails(task: Task) {
    this.filedialog.open(TaskPdfComponent, {
      width: '80vw',
      height: '80vh',
      maxWidth: '90vw',
      maxHeight: '90vh',
      panelClass: 'custom-dialog-container',
      data: { taskId: task.id, videoId: this.videoId() }
    });
  }

  addTask() {
    this.filedialog.open(TaskAddComponent, {
      width: '80vw',
      height: '80vh',
      maxWidth: '90vw',
      maxHeight: '90vh',
      panelClass: 'custom-dialog-container',
      data: { videoId: this.videoId() }
    });
  }
}
