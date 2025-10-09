import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Course } from '../../models/course'; // Adjust path if needed

@Component({
  selector: 'app-course-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './course-card.component.html',
  styleUrls: ['./course-card.component.css']
})
export class CourseCardComponent {
  @Input() course!: Course;
  @Input() mode: 'user' | 'admin' = 'user';
  @Output() delete = new EventEmitter<number>();
  @Input() isMutating:boolean = false;

  longPressTimer: any;
  isLongPressing = false;

  onDeleteClick(event: MouseEvent): void {
    event.stopPropagation();
    event.preventDefault();
    this.delete.emit(this.course.id);
  }

  onTouchStart(courseItem: HTMLElement): void {
    if (this.mode !== 'user' || !this.isTouchDevice()) return;

    this.isLongPressing = false;
    this.longPressTimer = setTimeout(() => {
      this.isLongPressing = true;
      courseItem.classList.add('is-long-pressing');
    }, 250);
  }

  onTouchEnd(courseItem: HTMLElement): void {
    if (this.mode !== 'user' || !this.isTouchDevice()) return;
    clearTimeout(this.longPressTimer);

    setTimeout(() => {
      courseItem.classList.remove('is-long-pressing');
    }, 1500);
  }

  isTouchDevice(): boolean {
    return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
  }

  
}