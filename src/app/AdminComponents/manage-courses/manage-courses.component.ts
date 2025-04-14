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
import { MatDialog } from '@angular/material/dialog';
import { AddVideoDialogComponent } from '../add-video-dialog/add-video-dialog.component';
import { CoursecrudService } from '../../services/videomanagement.service';
import { PopupserviceService } from '../../services/popupservice.service';
import { EditCourseComponent } from '../edit-course/edit-course.component';

@Component({
  selector: 'app-manage-courses',
  imports: [FormsModule, CommonModule,SidebarComponent,SafeUrlPipePipe,TasksComponent],
  templateUrl: './manage-courses.component.html',
  styleUrls: ['./manage-courses.component.css']
})
export class ManageCoursesComponent implements OnInit {
  route = inject(ActivatedRoute);
  service = inject(CoursemanageService);
  videoService=inject(CoursecrudService)
  courseId!: number;
  videos=this.videoService.videos;
  dialogRef=inject(MatDialog);
  course=signal<Course|null>(null);
  
  popupservice=inject(PopupserviceService);
  video=model<Vedio | undefined>();
  ngOnInit(): void {
    this.courseId = Number(this.route.snapshot.paramMap.get('id'));
    this.service.getCourse(this.courseId).subscribe({
      next: (res: any) => {
        this.course.set(res);
        this.service.getCourseThumbnail(this.courseId).subscribe({
          next:res=>
          {
              if (this.course()) {
                this.course()!.coursethumbnail = res.coursethumbnail as Uint8Array;
              }
          }
        });
      }
    });
    
    
  }
  editVideo(event:Event,video:Vedio | null | undefined)
  {
    const dialogReference = this.dialogRef.open(AddVideoDialogComponent, {
      width: '50vw',  
      height: '80vh', 
      maxWidth: '100vw',
      maxHeight: '100vh',
      panelClass: 'custom-dialog-container',
      data: { video: video, courseId: this.courseId },
    });
    
  }
  deleteVideo(event:Event,video:Vedio | null | undefined)
  {
    this.videoService.deletevideo(video?.id).subscribe(
      {
        next:(res:any)=>
        {
          this.video.set(undefined);
          this.popupservice.sweetSuccessAllert("Video Deleted Successfully");
        },
        error:(error:any)=>
        {
          console.log(error);
          this.popupservice.sweetUnSuccessAllert("Can't Delete Video Please Try Again....")
        }
      }
    );
  }

  editCourse(id: number,$event: MouseEvent) {
    if($event.isTrusted){
      const dialogReference=this.dialogRef.open(EditCourseComponent, {
        width: '50vw',
        height: '80vh',
        maxWidth: '100vw',
        data:{ course:this.course()},
    });
    dialogReference.afterClosed().subscribe((res: any) => {
      if (res) {
        this.course.set(res);
      } else {
        console.log('No response received from dialog');
      }
    });
    } 
  }
   toggleDescription() {
    const description = document.getElementById('course-description');
    const readMoreBtn = document.getElementById('read-more-btn');
    
    if (description && readMoreBtn) {
      if (description.classList.contains('expanded')) {
        description.classList.remove('expanded');
        readMoreBtn.textContent = 'Read More';
      } else {
        description.classList.add('expanded');
        readMoreBtn.textContent = 'Read Less';
      }
    }
  }
  
  
}
