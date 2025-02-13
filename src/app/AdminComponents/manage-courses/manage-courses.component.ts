import { Component, computed, inject, model, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CoursemanageService } from '../../services/coursemanage.service';
import { Vedio } from '../../models/vedio';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { SafeUrlPipePipe } from '../../pipes/safe-url-pipe.pipe';
import { TasksComponent } from '../tasks/tasks.component';
import { Course } from '../../models/course';

@Component({
  selector: 'app-manage-courses',
  imports: [FormsModule, CommonModule,SidebarComponent,SafeUrlPipePipe,TasksComponent],
  templateUrl: './manage-courses.component.html',
  styleUrls: ['./manage-courses.component.css']
})
export class ManageCoursesComponent implements OnInit {
  route = inject(ActivatedRoute);
  service = inject(CoursemanageService);
  courseId!: number;
  course = signal<Course>({
    id: 0,
    coursename: '',
    courseprice: 0,
    coursethumbnail: undefined
  });
  courseThumbnails:Uint8Array[]=[]
  video=model<Vedio>();
  ngOnInit(): void {
    this.courseId = Number(this.route.snapshot.paramMap.get('id'));
    this.course = this.service.getCourse(this.courseId);
  }
}
