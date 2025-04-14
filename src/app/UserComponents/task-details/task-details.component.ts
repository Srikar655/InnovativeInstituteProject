import { Component, computed, ElementRef, inject, model, QueryList, Signal, ViewChildren } from '@angular/core';
import { UsertaskService } from '../../userservices/usertask.service';
import { Usertask } from '../../models/usertask';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { TaskPdfComponent } from '../../AdminComponents/task-pdf/task-pdf.component';
import { TaskViewComponent } from '../task-view/task-view.component';

@Component({
  selector: 'app-task-details',
  imports: [CommonModule,CurrencyPipe],
  templateUrl: './task-details.component.html',
  styleUrl: './task-details.component.css'
})
export class TaskDetailsComponent {
isModalOpen: boolean=false;
  service = inject(UsertaskService);
  tasks: Signal<Usertask[]> = this.service.tasks;
  pageNumber=0;
  filedialog = inject(MatDialog);
  pageSize=5;
  videoId = model<number>();
    selectedTask: Usertask | null = null;  
    observer!: IntersectionObserver;
    noMoreTasks = false;
    @ViewChildren('scrollableItem') scrollableDiv!: QueryList<ElementRef>;
  fetchTaskDetails=computed(()=>{
    this.service.getTasks(this.videoId(),this.pageNumber,this.pageSize)?.subscribe({
      next:res=>{
        this.pageNumber++;
        if (res==null || this.pageSize>res.length) {
          this.noMoreTasks = true;
        }
      }
    });
  });
  ngAfterViewInit() {
    this.observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        this.onScroll();
      }
    }, {
      threshold: 0.25,
      rootMargin: '50px',
      root: null
    });
    this.observeLastItem();
    this.scrollableDiv.changes.subscribe(() => {
      this.observeLastItem();
    });
  }

  observeLastItem() {
    if (this.scrollableDiv && this.scrollableDiv.last) {
      const lastElement = this.scrollableDiv.last.nativeElement;
      if (this.observer) {
        this.observer.observe(lastElement);
      }
    }
  }

  onScroll() {
    if (!this.noMoreTasks) {
      this.service.getTasks(this.videoId(),this.pageNumber,this.pageSize)?.subscribe({next:(res) => {
        this.pageNumber++;
        if (res==null || this.pageSize>res.length) {
          this.noMoreTasks = true;
        }
      },
      error: (err) => {
        console.log(err);
      }
      });
    }
  }
  openModal() {
    throw new Error('Method not implemented.');
    }
    closeModal(){

    }
    openTaskDetails(task: Usertask) {
        this.filedialog.open(TaskViewComponent, {
          width: '80vw',
          height: '80vh',
          maxWidth: '90vw',
          maxHeight: '90vh',
          panelClass: 'custom-dialog-container',
          data: { taskId: task.id }
        });
      }
    
payForTask($event: Event,userTaskId: number) {
  if($event.isTrusted)
    {
      $event.stopPropagation();
      console.log(userTaskId);
      this.service.generatePaymentId(userTaskId).subscribe({
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
              //console.log(componet.videos());
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
