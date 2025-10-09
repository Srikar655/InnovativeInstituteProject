import { Component, ElementRef, inject, OnInit, OnDestroy, AfterViewInit, ViewChildren, Signal, QueryList, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { fromEvent, Subject } from 'rxjs';
import { debounceTime, startWith, takeUntil } from 'rxjs/operators';

// --- Reusable Components ---
import { Course } from '../../models/course';
import { CoursesStore } from '../../stores/courses.store';
import { SearchingComponent } from "../../sharedcomponents/searching/searching.component";
import { ErrorMessageComponent } from "../../sharedcomponents/error-message/error-message.component";
import { NothingFoundComponent } from "../../sharedcomponents/nothing-found/nothing-found.component";
import { LoadingComponent } from "../../sharedcomponents/loading/loading.component";
import { CourseCardComponent } from "../../sharedcomponents/course-card/course-card.component";
import { PopupserviceService } from '../../services/popupservice.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-courses', 
  imports: [CommonModule, SearchingComponent, ErrorMessageComponent, NothingFoundComponent, LoadingComponent, CourseCardComponent],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.css'
})
export class CoursesComponent implements OnInit, AfterViewInit, OnDestroy {
  coursesStore = inject(CoursesStore);
  popupservice = inject(PopupserviceService);
  notficationService = inject(NotificationService);

  @ViewChild('scrollContainer') scrollContainer!: ElementRef;


  @ViewChildren('loadingTrigger') loadingTriggers!: QueryList<ElementRef>;

  private observer!: IntersectionObserver;
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.loadingTriggers.changes.subscribe((triggers: QueryList<ElementRef>) => {
      if (triggers.first) {
        this.setupIntersectionObserver(triggers.first);
      }
    });

    fromEvent(window, 'resize').pipe(
      startWith(null), 
      debounceTime(200), 
      takeUntil(this.destroy$) 
    ).subscribe(() => {
      this.calculateAndSetPageSize();
    });
  }

  async onDeleteCourse(courseId: number): Promise<void> {
    const {isConfirmed} = await this.popupservice.sweetConfirmationAlert('Are you sure you want to delete this course?');
    console.log(isConfirmed);
    if (!isConfirmed) return;
    try{
      await this.coursesStore.deleteCourse(courseId);
      this.notficationService.showSuccess("Course deleted successfully.");
      
    }
    catch(err:any){      
      this.notficationService.showError( "Failed to delete course Please Try Again...");
    }
    
    
  }
  
  onReload(): void {
    this.coursesStore.resetAndLoad();
  }

  calculateAndSetPageSize(): void {
    if (!this.scrollContainer) return;

    const cardWidthWithGap = 320 + 30;
    const containerWidth = this.scrollContainer.nativeElement.clientWidth;
    const containerHeight = this.scrollContainer.nativeElement.clientHeight;

    if (containerWidth === 0 || containerHeight === 0) {
      this.coursesStore.setPageSize(10);
      return;
    }
    
    const columns = Math.max(1, Math.floor(containerWidth / cardWidthWithGap));
    const cardHeightWithGap = (320 * (9 / 16)) + 150;
    const rows = Math.max(1, Math.ceil(containerHeight / cardHeightWithGap));
    const pageSize = (columns * rows) + columns;
    const finalPageSize = Math.max(6, Math.min(pageSize, 50));
    
    this.coursesStore.setPageSize(finalPageSize);
  }

  setupIntersectionObserver(triggerElement: ElementRef): void {
    if (this.observer) this.observer.disconnect();
    const options = { root: null, threshold: 0.5 };
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.coursesStore.isLoadingNextPage()) {
          this.coursesStore.loadNextPage();
        }
      });
    }, options);
    this.observer.observe(triggerElement.nativeElement);
  }

  ngOnDestroy(): void {
    if (this.observer) this.observer.disconnect();
    this.destroy$.next();
    this.destroy$.complete();
  }
}