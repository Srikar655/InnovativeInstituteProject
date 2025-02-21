import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SafeUrlPipePipe } from '../../pipes/safe-url-pipe.pipe';
import { CoursemanageService } from '../../services/coursemanage.service';
import Swal from 'sweetalert2';
import { tap } from 'rxjs';
import { PopupserviceService } from '../../services/popupservice.service';


@Component({
  selector: 'app-add-course',
  imports: [CommonModule,FormsModule,ReactiveFormsModule,SafeUrlPipePipe],
  templateUrl: './add-course.component.html',
  styleUrl: './add-course.component.css'
})
export class AddCourseComponent implements OnInit {
  fb = inject(FormBuilder);
  myReactiveForm!: FormGroup;
  url: string = '';  
  isModalOpen: boolean = false;
  embedUrl: string | null = null;
  courseService=inject(CoursemanageService);
  popupservice=inject(PopupserviceService)
  worker!:Worker;
  openModal($event:Event,url:any): void {
    if($event.isTrusted)
    {
      this.url=url;
      this.convertToEmbedUrl();
      this.isModalOpen = true;
    }
  }
  closeModal($event:Event): void {
    if($event.isTrusted)
    {
      this.isModalOpen = false;
      this.embedUrl = null;
    }
  }
  convertToEmbedUrl(): void {

    if (this.url.includes('youtube.com/watch')) {
      const videoId = this.url.split('v=')[1].split('&')[0];
      this.embedUrl = `https://www.youtube.com/embed/${videoId}`;
    } else if (this.url.includes('vimeo.com')) {
      const videoId = this.url.split('.com/')[1];
      this.embedUrl = `https://player.vimeo.com/video/${videoId}`;
    }
    else{
      this.embedUrl=this.url;
    }
  }
  ngOnInit(): void {
    this.myReactiveForm = this.fb.group({
      coursethumbnail:[],
      coursename: ['', [Validators.required]],
      courseprice: ['', [Validators.required]],
      courseTrailer:['',[Validators.required]],
      courseDescription:['',[Validators.required]],
      courseFeatures:this.fb.array([]),
      vedios: this.fb.array([])
    });
  }
  addFeatures()
  {
    this.courseFeatures.push(this.fb.control('',[Validators.required]));
  }
  get courseFeatures():FormArray
  {
    return this.myReactiveForm.get('courseFeatures') as FormArray;
  }
  deleteFeatures(index:number)
  {
    const features=this.myReactiveForm.get('courseFeatures') as FormArray;
    features.removeAt(index);
  }
  get vedios(): FormArray {
    return this.myReactiveForm.get('vedios') as FormArray;
  }
  addVedios(event:Event): void {
    if(event.isTrusted)
    {
      const vedioGroup = this.fb.group({
        videourl: ['', [Validators.required]],
        vediotitle:['',[Validators.required,Validators.minLength(6),Validators.maxLength(100)]],
        vediodescription:['',[Validators.required,Validators.minLength(6),Validators.maxLength(500)]],
        vedioprice: ['', [Validators.required]],
        tasks: this.fb.array([])
      });
      this.vedios.push(vedioGroup);
    }
  }
  getCourseThumbnail()
  {
    return this.myReactiveForm.get('coursethumbnail') ;
  }
  getTasks(vedioIndex: number): FormArray {
    return this.vedios.at(vedioIndex).get('tasks') as FormArray;
  }
  addTasks(vedioIndex: number,$event:Event): void {
    if($event.isTrusted)
    {
      const taskGroup = this.fb.group({
        task: ['', [Validators.required]],
        taskurl:['',[Validators.required]],
        taskprice: ['', [Validators.required]],
        taskimages:this.fb.array([])
      });
      const tasks = this.getTasks(vedioIndex);
      tasks.push(taskGroup);
    }
  }
  fileChanged($event: any, vedioIndex: number, taskIndex: number): void {
    if ($event.isTrusted) {
      const inputElement = $event.target as HTMLInputElement;
      const files = inputElement.files;
      if (files) {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          this.readFile(file, vedioIndex, taskIndex); 
        }
      }
    }
  }
  readFile(file: File, vedioIndex: number, taskIndex: number): void {
    this.worker=new Worker(new URL('../../webworkers/readfiletobytes.worker',import.meta.url))
    this.worker.postMessage({file:file});
    this.worker.onmessage=({data})=>
      {
        const task = this.getTasks(vedioIndex).at(taskIndex);
        const taskimagesControl = task.get('taskimages') as FormArray;
        taskimagesControl?.push(this.fb.control({taskImage:Array.from(data)}));
      }
  }
  thumbnailchange($event:any)
  {
    if($event.isTrusted)
    {
      const inputElement = $event.target as HTMLInputElement;
      const files = inputElement.files;
      if (files) {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          this.readThumbnail(file); 
        }
      }
    }
  }
  readThumbnail(file:File)
  {
    this.worker=new Worker(new URL('../../webworkers/readfiletobytes.worker',import.meta.url))
    this.worker.postMessage({file:file});
    this.worker.onmessage=({data})=>
      {
        const thumbnail = this.getCourseThumbnail();
        thumbnail?.setValue(Array.from(data));
      }
  }
 
  save($event: Event): void {
    if ($event.isTrusted) {
      if (this.myReactiveForm.valid) {
         this.courseService.save(this.myReactiveForm.value).subscribe(
          {
            next:(res:any)=>
            {
              this.myReactiveForm.reset();
              this.popupservice.sweetSuccessAllert("Course Saved Successfully")
            },
            error:error=>{
              console.error('Error saving course:', error);
              this.popupservice.sweetUnSuccessAllert("Unable To Save Course Please Try Again After Some Time")
            }
            
          }
         )
      }
    }
  }

}
