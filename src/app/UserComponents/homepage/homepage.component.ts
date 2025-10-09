import { Component, ElementRef, inject, OnInit, OnDestroy, AfterViewInit, ViewChildren, Signal, QueryList, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { fromEvent, Subject } from 'rxjs';
import { debounceTime, startWith, takeUntil } from 'rxjs/operators';

import { Course } from '../../models/course';
import { CoursesStore } from '../../stores/courses.store';
import { SearchingComponent } from "../../sharedcomponents/searching/searching.component";
import { ErrorMessageComponent } from "../../sharedcomponents/error-message/error-message.component";
import { NothingFoundComponent } from "../../sharedcomponents/nothing-found/nothing-found.component";
import { LoadingComponent } from "../../sharedcomponents/loading/loading.component";
import { CourseCardComponent } from "../../sharedcomponents/course-card/course-card.component";

@Component({
  selector: 'app-homepage',
  imports: [CommonModule, SearchingComponent, ErrorMessageComponent, NothingFoundComponent, LoadingComponent, CourseCardComponent],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent implements OnInit, AfterViewInit, OnDestroy {
  coursesStore = inject(CoursesStore);
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;



  @ViewChildren('loadingTrigger') loadingTriggers!: QueryList<ElementRef>;

  private observer!: IntersectionObserver;
  private destroy$ = new Subject<void>();

  longPressTimer: any;
  isLongPressing = false;

  ngOnInit(): void {
    //this.setupResponsivePageSize();
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

  onReload()
  {
    this.coursesStore.resetAndLoad();
  }

  calculateAndSetPageSize(): void {

    const cardWidthWithGap = 320 + 30; 
    
    const containerWidth = this.scrollContainer.nativeElement.clientWidth;
    const containerHeight = this.scrollContainer.nativeElement.clientHeight;

    if (containerWidth === 0 || containerHeight === 0) {

      this.coursesStore.setPageSize(10);
      return;
    }
    

    const columns = Math.floor(containerWidth / cardWidthWithGap);

    const cardHeightWithGap = (320 * (9 / 16)) + 150; 
    const rows = Math.ceil(containerHeight / cardHeightWithGap);
    

    const pageSize = (columns * rows) + columns;


    const finalPageSize = Math.max(6, Math.min(pageSize, 50));
    
    console.log(`Viewport: ${containerWidth}x${containerHeight}, Columns: ${columns}, Rows: ${rows}, Calculated PageSize: ${finalPageSize}`);
    
    this.coursesStore.setPageSize(finalPageSize);
  }

  setupIntersectionObserver(triggerElement: ElementRef): void {
    if (this.observer) {
      this.observer.disconnect();
    }
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

  trackByCourseId(index: number, course: Course): number {
    return course.id;
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
    this.destroy$.next();
    this.destroy$.complete();
  }
}