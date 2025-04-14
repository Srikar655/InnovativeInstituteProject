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

@Component({
  selector: 'app-coursedetails',
  imports: [CurrencyPipe, SafeUrlPipePipe, CommonModule, VideosDisplayComponent, TaskDetailsComponent],
  templateUrl: './coursedetails.component.html',
  styleUrl: './coursedetails.component.css'
})
export class CoursedetailsComponent implements OnInit {
editVideo($event: MouseEvent,arg1: UserVideos|undefined) {
throw new Error('Method not implemented.');
}
  router=inject(ActivatedRoute);
  courseId:number=0;
  service1=inject(UserCourseService);
  service2=inject(CoursemanageService);
  course=signal<Usercourse|null>(null);
  video=model<UserVideos | undefined>();
  ngOnInit(): void {
    this.courseId=Number(this.router.snapshot.paramMap.get('id'));
    this.service1.getUserCourse(this.courseId).subscribe({
      next:res=>{
        this.course.set(res as Usercourse);
        this.service2.getCourseThumbnail(this.courseId).subscribe({
          next:res=>
          {
              if (this.course()) {
                this.course()!.course.coursethumbnail = res.coursethumbnail as Uint8Array;
              }
          }
        });

      },
      error:err=>{
        console.log(err);
      }
    });
  }
   toggleDescription() {
    const description = document.getElementById('course-description');
    const readMoreBtn = document.getElementById('read-more-btn');
    
    if (description?.style.maxHeight === 'none') {
      description.style.maxHeight = '200px';
      readMoreBtn!.textContent = 'Read More';
    } else {
      description!.style.maxHeight = 'none';
      readMoreBtn!.textContent = 'Read Less';
    }
  }
  redirectToPaymentGateWay()
  {
    this.service1.payment(this.course()?.course.id).subscribe({
      next:(res:any)=>
      {
        const componet=this;
        const options: any = {
          "key": "rzp_test_PafRro48qAcsSh", // Razorpay Key ID from Razorpay dashboard
          "amount": res.amount * 100, // Amount in paise
          "currency": "INR",
          "name": "Innovative Tutorials",
          "description": "Test Transaction",
          "order_id": res.orderId, // Pass the order ID from backend
          "handler": function (response: any) {
            const paymentDetails={
              orderId:options.order_id,
              paymentId:response.razorpay_payment_id,
              signature:response.razorpay_signature,
            };
            console.log(response);
            componet.service1.verifypayment(paymentDetails).subscribe({
              next:(res:any)=>{
                componet.course.set(res.UserCourse as Usercourse);  
              },
              error:(err:any)=>
              {
                console.log(err);
              }
            })
          },
          "theme": {
            "color": "#3399cc"
          }
        };
        var razorpay=new (window as any).Razorpay(options);
        razorpay.open();
      },
      error:err=>{
        console.log(err);
      }
    });
  }
}


