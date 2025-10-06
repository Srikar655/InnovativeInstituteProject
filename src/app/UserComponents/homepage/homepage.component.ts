import { ChangeDetectorRef, Component, ElementRef, inject, OnInit, QueryList, Signal, ViewChild, ViewChildren } from '@angular/core';
import { Course } from '../../models/course';
import { PopupserviceService } from '../../services/popupservice.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CoursesStore } from '../../stores/courses.store';
import { SearchingComponent } from "../../sharedcomponents/searching/searching.component";

@Component({
  selector: 'app-homepage',
  imports: [ CommonModule, SearchingComponent , RouterLink],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent implements OnInit {
  coursesStore = inject(CoursesStore);
  router = inject(Router);
  popupservice = inject(PopupserviceService);
  courses: Signal<Course[]> = this.coursesStore.filteredCourses;
  isLoading: Signal<boolean> = this.coursesStore.isLoading;
  isThumnailLoading: Signal<boolean> = this.coursesStore.isThumnailLoading;
  error: Signal<string | null> = this.coursesStore.error
  
  @ViewChildren('courseItem') courseElements!: QueryList<ElementRef>;
  
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  
  cdRef = inject(ChangeDetectorRef);
  private observer!: IntersectionObserver;

  ngOnInit(): void {
    this.coursesStore.loadCourses();
  }

  
  trackByCourseId(index: number, course: Course): number {
    return course.id;
  }

  ngAfterViewInit() {
    this.courseElements.changes.subscribe(() => {
      this.setupIntersectionObserver();
    });
    this.cdRef.detectChanges();
  }
  selectCourse(courseId: number) {
    this.coursesStore.selectCourse(courseId);
    this.router.navigate(['/course-details']);
  }
  setupIntersectionObserver() {
    if (this.observer) {
      this.observer.disconnect();
    }

    if (!this.courseElements || !this.scrollContainer) return;

    const options = {
      root: this.scrollContainer.nativeElement,
      
      threshold: 0.1, 
      rootMargin: '0px 0px 200px 0px' 
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const courseElement = entry.target as HTMLElement;
          
          const courseId = courseElement.dataset['courseId'];

          if (courseId) {
            this.loadThumbnail(+courseId);
            console.log(courseId);
            this.observer.unobserve(entry.target);
          }
        }
      });
    }, options);
    
    this.courseElements.forEach(element => this.observer.observe(element.nativeElement));
  }

  loadThumbnail(courseId: number) {
    this.coursesStore.loadCourseThumbnail(courseId); 
  }
}