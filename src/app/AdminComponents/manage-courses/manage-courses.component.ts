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
import { CoursecrudService } from '../../services/coursecrud.service';
import { PopupserviceService } from '../../services/popupservice.service';

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
  course = signal<Course>({
    id: 0,
    coursename: '',
    courseprice: 0,
    coursethumbnail: undefined
  });
  popupservice=inject(PopupserviceService);
  courseThumbnails:Uint8Array[]=[]
  video=model<Vedio | null>();
  ngOnInit(): void {
    this.courseId = Number(this.route.snapshot.paramMap.get('id'));
    this.service.getCourse(this.courseId).subscribe(
      {
        next:(res:any)=>{
          this.course.set(res);
        }
      }
    );
  }
  editVideo(event:Event,video:Vedio | undefined)
  {
    const dialogReference = this.dialogRef.open(AddVideoDialogComponent, {
          width: '50vw',  
          height: '80vh', 
          maxWidth: '100vw',
          maxHeight: '100vh',
          panelClass: 'custom-dialog-container',
          data: { video:video,courseId:this.courseId},
        });
  }
  deleteVideo(event:Event,video:Vedio | undefined)
  {
    this.videoService.deletevideo(video?.id).subscribe(
      {
        next:(res:any)=>
        {
          this.video.set(null);
          this.popupservice.sweetSuccessAllert(res.response);
        },
        error:(error:any)=>
        {
          console.log(error);
          this.popupservice.sweetUnSuccessAllert("Can't Delete Video Please Try Again....")
        }
      }
    );
  }
}
