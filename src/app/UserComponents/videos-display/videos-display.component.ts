import { Component, computed, ElementRef, inject, model, QueryList, signal, Signal, ViewChildren } from '@angular/core';
import { UserVideosmanageService } from '../../userservices/user-videosmanage.service';
import { UserVideos } from '../../models/user-videos';
import { SafeUrlPipePipe } from "../../pipes/safe-url-pipe.pipe";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-videos-display',
  imports: [SafeUrlPipePipe,CommonModule],
  templateUrl: './videos-display.component.html',
  styleUrl: './videos-display.component.css'
})
export class VideosDisplayComponent {

  courseId=model<number | undefined>(0);
  service=inject(UserVideosmanageService); 
  videos:Signal<UserVideos[]>=this.service.videos;
  loadingVideos: boolean=false;
  page = 0;
  fetchSize = 3;
  dynamicFetchSize = 3;
  sidebarActive = signal<boolean>(false);
  observer!:IntersectionObserver;
  @ViewChildren('scrollContainer') scrollContainers!: QueryList<ElementRef>;
  loadVideos=computed(()=>
    {
        const id=this.courseId();
        if(id!=null && id!=0)
        {
          if(id!=null&&id!=0)
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
        }
        return this.courseId();
    })
  videoselected=model<UserVideos | undefined>(undefined);

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
        next:(res:any)=>{
          this.page += 1;
          if(res==null || res.length<this.dynamicFetchSize)
          {
            this.noMoreVideos=true;
          }
          this.loadingVideos=false;
        },
        error:(err:Error)=>{
          console.log(err);
        }
      });
  }
  payForVideo(event:Event,uservideoId: number) {
      if(event.isTrusted)
      {
        this.service.generatePaymentId(uservideoId).subscribe({
          next:(res:any)=>{
            console.log(res);
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
            componet.service.verifypayment(paymentDetails).subscribe({
              next:(res:any)=>{
                console.log(componet.videos());
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

}
