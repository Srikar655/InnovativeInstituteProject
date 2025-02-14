import { Component, computed, EventEmitter, inject, Input, model, Output, signal } from '@angular/core';
import { SafeUrlPipePipe } from '../../pipes/safe-url-pipe.pipe';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {InfiniteScrollDirective} from 'ngx-infinite-scroll';
import { Vedio } from '../../models/vedio';
import { CoursemanageService } from '../../services/coursemanage.service';
import { MatDialog } from '@angular/material/dialog';
import { AddVideoDialogComponent } from '../add-video-dialog/add-video-dialog.component';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-sidebar',
  imports: [SafeUrlPipePipe,CommonModule,FormsModule,InfiniteScrollDirective,MatIconModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  courseId=model<number>();
  service=inject(CoursemanageService);
  videos=this.service.videos;
  page = 0;
  fetchSize = 3;
  dynamicFetchSize = 3;
  sidebarActive = signal<boolean>(false);
  noMoreVideos = computed(() => this.videos().length === 0);
  dialogRef=inject(MatDialog);
  loadVideos=computed(()=>
    {
        const id=this.courseId()    
        this.service.getVideos(id as number, this.page, this.fetchSize, false)
    })
  videoselected=model<Vedio>();
  loadingVideos:boolean=false;
  onVideoSelect(video:any)
  {
    this.videoselected.set(video);
  } 
  onScroll()
  {
    if(this.loadingVideos)
    {
      return;
    }
    this.loadingVideos=true;
    this.fethVideos()
    this.loadingVideos=false;
  }
  fethVideos() {
    if (this.noMoreVideos()) {
      return;
    }
      this.page += 1; 
      this.service.getVideos(this.courseId() as number, this.page, this.dynamicFetchSize, true);
  }
  ngOnInit()
  {
    this.service.getVideos(this.courseId() as number, this.page, this.fetchSize, false)
  }
  openAddVideoDialog(): void {
    const dialogReference = this.dialogRef.open(AddVideoDialogComponent, {
      width: '50vw',  
      height: '80vh', 
      maxWidth: '100vw',
      maxHeight: '100vh',
      panelClass: 'custom-dialog-container',
      data: { courseId: this.courseId() },
    });

    dialogReference.afterClosed().subscribe(result => {
      if (result) {
        console.log('New video added:', result);
        this.videos().push(result);
      }
    });
  }
}
