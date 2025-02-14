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
  dialogRef=inject(MatDialog);
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
  edit(event:Event,video:Vedio | undefined)
  {
    const dialogReference = this.dialogRef.open(AddVideoDialogComponent, {
          width: '50vw',  
          height: '80vh', 
          maxWidth: '100vw',
          maxHeight: '100vh',
          panelClass: 'custom-dialog-container',
          data: { video:video,courseId:this.courseId},
        });
    
        dialogReference.afterClosed().subscribe(result => {
          /*if (result) {
            console.log('New video added:', result);
            this.videos().push(result);
          }*/
        });
  }
}
