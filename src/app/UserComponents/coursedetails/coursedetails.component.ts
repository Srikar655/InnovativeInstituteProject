import { Component, computed, inject, model, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { UserCourseService } from '../../userservices/user-course.service';
import { CoursemanageService } from '../../services/coursemanage.service';
import { Usercourse } from '../../models/usercourse';
import { SafeUrlPipePipe } from "../../pipes/safe-url-pipe.pipe";
import { VideosDisplayComponent } from "../videos-display/videos-display.component";
import { UserVideos } from '../../models/user-videos';
import { TaskDetailsComponent } from "../task-details/task-details.component";
import { UserCoursesStore } from '../../stores/usercourses.store';

@Component({
  selector: 'app-coursedetails',
  imports: [CurrencyPipe, SafeUrlPipePipe, CommonModule, VideosDisplayComponent, TaskDetailsComponent],
  templateUrl: './coursedetails.component.html',
  styleUrl: './coursedetails.component.css'
})
export class CoursedetailsComponent implements OnInit {

  router=inject(ActivatedRoute);
  userCourseStore = inject(UserCoursesStore);
  courseId:number=0;
  course=this.userCourseStore.selectedUserCourse;
  isLoading=this.userCourseStore.isLoading;
  error=this.userCourseStore.error;
  video=model<UserVideos | undefined>();
  isDescriptionExpanded = false;
  activeMobileTab: 'playlist' | 'about' = 'playlist';
  setActiveTab(tab: 'playlist' | 'about'): void {
    this.activeMobileTab = tab;
  }
  toggleDescription(): void {
    this.isDescriptionExpanded = !this.isDescriptionExpanded;
  }
  ngOnInit(): void {
    this.courseId=Number(this.router.snapshot.paramMap.get('id'));
    this.userCourseStore.selectCourse(this.courseId);
  }
}


