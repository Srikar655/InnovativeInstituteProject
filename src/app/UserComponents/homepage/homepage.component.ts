import { ChangeDetectorRef, Component, ElementRef, inject, OnInit, QueryList, Signal, ViewChildren } from '@angular/core';
import { CoursemanageService } from '../../services/coursemanage.service';
import { Course } from '../../models/course';
import { PopupserviceService } from '../../services/popupservice.service';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgxSpinnerComponent } from 'ngx-spinner';

@Component({
  selector: 'app-homepage',
  imports: [RouterLink,CommonModule],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent implements OnInit {
  service=inject(CoursemanageService);
  popupservice=inject(PopupserviceService);
  courses:Signal<Course[]>=this.service.courseSignal;
  @ViewChildren('courseItem') courseElements!: QueryList<ElementRef>;
  cdRef=inject(ChangeDetectorRef);
  ngOnInit(): void {
    this.service.get().subscribe({
      next:res=>{

      },
      error:err=>{
        console.log(err);
        this.popupservice.sweetUnSuccessAllert("There is problem getting courses.. Plese Try Again");
      }
    });
  }
  private observer!: IntersectionObserver;
  

  
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
      this.service.getCourseThumbnail(courseId).subscribe();
    }
  

}
