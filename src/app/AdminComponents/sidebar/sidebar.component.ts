import { Component, computed, ElementRef, EventEmitter, inject, Input, model, Output, QueryList, signal, ViewChildren } from '@angular/core';
import { SafeUrlPipePipe } from '../../pipes/safe-url-pipe.pipe';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {InfiniteScrollDirective} from 'ngx-infinite-scroll';
import { Vedio } from '../../models/vedio';
import { CoursemanageService } from '../../services/coursemanage.service';
import { MatDialog } from '@angular/material/dialog';
import { AddVideoDialogComponent } from '../add-video-dialog/add-video-dialog.component';
import { MatIconModule } from '@angular/material/icon';
import { CoursecrudService } from '../../services/videomanagement.service';
@Component({
  selector: 'app-sidebar',
  imports: [SafeUrlPipePipe,CommonModule,FormsModule,MatIconModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent
{
  courseId=model<number>();
  service=inject(CoursecrudService);
  videos=this.service.videos;
  page = 0;
  fetchSize = 3;
  dynamicFetchSize = 3;
  sidebarActive = signal<boolean>(false);
  observer!:IntersectionObserver;
  @ViewChildren('scrollContainer') scrollContainers!: QueryList<ElementRef>;
  dialogRef=inject(MatDialog);
  loadVideos=computed(()=>
    {
        const id=this.courseId()    
        if(id!=0)
          {    
            this.loadingVideos=true;
            this.service.getVideos(this.courseId() as number, this.page, this.dynamicFetchSize, false).subscribe({
              next:(res:any)=>{
                this.page += 1;
                if(res==null || res.length<this.dynamicFetchSize)
                  {
                    this.noMoreVideos=true;
                  }
                  this.loadingVideos=false;
              },
              error:err=>{
                console.log(err);
              }
            });
          }
    })
  videoselected=model<Vedio | undefined>(undefined);
  loadingVideos:boolean=false;
  noMoreVideos:boolean=false;
  onVideoSelect(index:any)
  {
    this.videoselected.set(this.videos()[index]);
  } 
  ngAfterViewInit() {
    this.observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        this.onScroll();
      }
    }, {
      threshold: 0.25,rootMargin:'50px',root:null
    });
    this.observeLastItem();
    this.scrollContainers.changes.subscribe(() => {
      this.observeLastItem();
    });
  }

  observeLastItem() {
    if (this.scrollContainers && this.scrollContainers.last) {
      const lastElement = this.scrollContainers.last.nativeElement;
      if (this.observer) {
        this.observer.observe(lastElement);
      }
    }
  }

  onScroll()
  {
    if(this.loadingVideos || this.noMoreVideos)
    {
      return;
    }
    this.loadingVideos=true;
    this.fethVideos()
  }
  fethVideos() { 
      this.service.getVideos(this.courseId() as number, this.page, this.dynamicFetchSize, true).subscribe({
        next:res=>{
          this.page += 1;
          if(res==null || res.length<this.dynamicFetchSize)
            {
              this.noMoreVideos=true;
              this.loadingVideos=false;
            }
        },
        error:err=>{
          console.log(err);
        }
      });
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
        this.videos().push(result);
      }
    });
  }
}
