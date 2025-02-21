import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Course } from '../../models/course';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { CoursemanageService } from '../../services/coursemanage.service';
import { PopupserviceService } from '../../services/popupservice.service';
import { SafeUrlPipePipe } from "../../pipes/safe-url-pipe.pipe";

@Component({
  selector: 'app-edit-course',
  imports: [ReactiveFormsModule, CommonModule, SafeUrlPipePipe],
  templateUrl: './edit-course.component.html',
  styleUrls: ['./edit-course.component.css']
})
export class EditCourseComponent {


  service=inject(CoursemanageService);
  popup=inject(PopupserviceService);
  data = inject(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef<EditCourseComponent>);

  course!: Course;
  worker!: Worker;
  courseForm!: FormGroup;
  thumbnailPreview: any;

  constructor(private fb: FormBuilder, private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.course = this.data.course;

    this.courseForm = this.fb.group({
      id: [this.course?.id || 0],
      coursename: [this.course?.coursename || '', [Validators.required]],
      courseprice: [this.course?.courseprice || '', [Validators.required, Validators.min(0)]],
      coursethumbnail: [this.course?.coursethumbnail || '', [Validators.required]],
      courseDescription: [this.course?.courseDescription || '', [Validators.required]],
      courseFeatures: [this.course?.courseFeatures ? this.course.courseFeatures.join(', ') : '', Validators.required],
      courseTrailer: [this.course?.courseTrailer || '', [Validators.required, Validators.pattern('https?://.+')]]
    });

    if (this.course?.coursethumbnail) {
      this.thumbnailPreview = 'data:image/png;base64,' + this.course.coursethumbnail;
    }
  }

  get courseFeatures() {
    return this.courseForm.get('courseFeatures') as FormArray;
  }

  onThumbnailSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.worker=new Worker(new URL('../../webworkers/readfiletobytes.worker',import.meta.url))
      this.worker.postMessage({file:file});
      this.worker.onmessage=({data})=>
        {
          const thumbnail = this.courseForm.get('coursethumbnail') as FormArray;
          thumbnail?.setValue(Array.from(data));
          this.thumbnailPreview =URL.createObjectURL(new Blob([data], { type: file.type }));
        }
    }
  }
  

  onSubmit() {
    if (this.courseForm.valid) {
      const formData = this.courseForm.value;
      formData.courseFeatures = formData.courseFeatures.split(',').map((feature: string) => feature.trim());
      this.service.editCourse(formData).subscribe({
        next: (res) => {
          this.popup.sweetSuccessAllert('Course updated successfully');
          this.dialogRef.close(res);               
        },
        error: (err: any) => {
          this.popup.sweetUnSuccessAllert('Failed to update course');
          console.error(err);
        }
      });
    } else {
      console.log('Form is invalid');
    }
  }
  
  
}
