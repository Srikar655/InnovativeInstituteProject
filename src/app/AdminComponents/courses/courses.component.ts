import { Component, ElementRef, AfterViewInit, ViewChildren, QueryList, inject, OnInit, Signal, ChangeDetectorRef } from '@angular/core';
import { CoursemanageService } from '../../services/coursemanage.service';
import { Course } from '../../models/course';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-courses',
  imports: [RouterLink, CommonModule],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.css'
})
export class CoursesComponent implements OnInit, AfterViewInit {
  service = inject(CoursemanageService);
  courseSignal = this.service.courseSignal;
  private observer!: IntersectionObserver;

  @ViewChildren('courseItem') courseElements!: QueryList<ElementRef>;
  cdRef=inject(ChangeDetectorRef);
  ngOnInit(): void {
    this.service.get(); // Fetch courses first, without thumbnails
  }

  ngAfterViewInit() {
    this.courseElements.changes.subscribe(()=>{
      this.setupIntersectionObserver();
    })
    this.cdRef.detectChanges();
  }

  setupIntersectionObserver() {
    if (!this.courseElements) return;

    const options = {
      threshold: 0.25,
      rootMargin: '100px',
      root: document.querySelector('course-list'),
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const courseElement = entry.target as HTMLElement;
          const courseId = courseElement.getAttribute('id')?.split('-')[1];
          if (courseId) {
            this.loadThumbnail(+courseId);
            this.observer.unobserve(entry.target);  
          }
        }
      });
    }, options);
    this.courseElements.forEach(element => this.observer.observe(element.nativeElement));
  }

  loadThumbnail(courseId: number) {
    this.service.getCourseThumbnail(courseId).subscribe(thumbnail => {
      const course=this.courseSignal().find(c=>c.id==courseId);
      if (course) {
        course.coursethumbnail = thumbnail;
      }
    });
  }

  getImageSrc(course: Course) {
    return course.coursethumbnail
      ? URL.createObjectURL(new Blob([course.coursethumbnail], { type: 'image/png' }))
      : null; 
  }
}
