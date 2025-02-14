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
import { PopupserviceService } from '../../services/popupservice.service';

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
  video!:Vedio | null;
  isPopupOpen=false;
  videoUrl:string='';
  popupservice=inject(PopupserviceService);
  service=inject(CoursecrudService);
  dialog=inject(MatDialogRef<AddVideoDialogComponent>)
  ngOnInit()
  {
    this.courseId=this.dialogdata.courseId;
    this.video=this.dialogdata.video || null
    this.myReactiveForm=this.fb.group({
      id:[this.video?.id || null],
      vediotitle:[ this.video?.vediotitle || '',[Validators.required,Validators.minLength(6),Validators.maxLength(100)]],
      videourl:[this.video?.videourl ||  '',[Validators.required]],
      vediodescription:[this.video?.vediodescription || '',[Validators.required,Validators.minLength(6),Validators.maxLength(500)]],
      vedioprice:[this.video?.vedioprice || '',[Validators.required]],
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
        this.service.addVideo(this.myReactiveForm.value).subscribe({
          next:(res:any)=>
            {
              this.popupservice.sweetSuccessAllert("Video Record Saved Successfully")
              this.dialog.close();
            },
          error:error=>{
            console.error('Error saving Vidoe:', error);
           this.popupservice.sweetUnSuccessAllert('An error occurred while saving the Video. Please try again.');
          }
        })
      }
    }
  }
  updateVideoPreview() {
    this. videoUrl = this.myReactiveForm.get('videourl')?.value;
  }
  
}
