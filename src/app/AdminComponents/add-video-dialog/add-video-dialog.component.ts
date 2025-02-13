import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Vedio } from '../../models/vedio';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { SafeUrlPipePipe } from '../../pipes/safe-url-pipe.pipe';
import { CoursecrudService } from '../../services/coursecrud.service';
import { tap } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-video-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SafeUrlPipePipe,
    MatIconModule
  ],
  templateUrl: './add-video-dialog.component.html',
  styleUrl: './add-video-dialog.component.css'
})
export class AddVideoDialogComponent implements OnInit{
  dialogdata=inject(MAT_DIALOG_DATA);
  courseId:number=0;
  fb=inject(FormBuilder);
  myReactiveForm!:FormGroup;
  video!:Vedio;
  isPopupOpen=false;
  videoUrl:string='';
  service=inject(CoursecrudService);
  dialog=inject(MatDialogRef<AddVideoDialogComponent>)
  ngOnInit()
  {
    this.courseId=this.dialogdata.courseId;
    this.myReactiveForm=this.fb.group({
      vediotitle:[ '',[Validators.required,Validators.minLength(6),Validators.maxLength(100)]],
      videourl:[ '',[Validators.required]],
      vediodescription:[ '',[Validators.required,Validators.minLength(6),Validators.maxLength(500)]],
      vedioprice:[ '',[Validators.required]],
      course:[{id:this.courseId}]
    });
  }
 
  
  openModal($event:Event) {
    if($event.isTrusted)
    {
      this.videoUrl = this.myReactiveForm.get('videourl')?.value;
      console.log(this.videoUrl);
      if (this.videoUrl) {
        document.querySelector('.popup-overlay')?.classList.add('active');
        this.isPopupOpen = true;
      }
    }
  }
  closeModal($event:Event){
    if($event.isTrusted)
    {
      this.isPopupOpen = false;
      document.querySelector('.popup-overlay')?.classList.remove('active');
    }
  }
  onSubmit($event:Event)
  {
    if($event.isTrusted)
    {
      if (this.myReactiveForm.valid) {
        console.log("Form Data:", this.myReactiveForm.value);
        this.service.addVideo(this.myReactiveForm.value).pipe(
          tap(
            (res:any)=>
            {
              console.log(res);
              Swal.fire({
                          icon: 'success',
                          title: 'Video Record Saved Successfully!',
                          text: 'The Vidoe Has Been Added',
                          showCloseButton: true,
                          showConfirmButton: false,
                          timer: 3000,  
                          backdrop: `rgba(0, 123, 255, 0.4)`,
                          didOpen: () => {
                            const content = Swal.getHtmlContainer();
                            if (content) {
                              content.style.animation = 'fadeInUp 0.8s';  
                            }
                          }
                        });
              this.onCancel(res);
            }
          )
        ).subscribe({
          error:error=>{
            console.error('Error saving Vidoe:', error);
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'An error occurred while saving the Video. Please try again.',
            });
          }
        })
      }
    }
  }
  updateVideoPreview() {
    this. videoUrl = this.myReactiveForm.get('videourl')?.value;
  }
  onCancel(video:Vedio)
  {
    this.dialog.close(video);
  }
}
