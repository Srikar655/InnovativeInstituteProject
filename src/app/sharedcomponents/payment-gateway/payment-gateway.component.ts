import { Component, inject, model } from '@angular/core';
import { UserVideosmanageService } from '../../userservices/user-videosmanage.service';

@Component({
  selector: 'app-payment-gateway',
  imports: [],
  templateUrl: './payment-gateway.component.html',
  styleUrl: './payment-gateway.component.css'
})
export class PaymentGatewayComponent {
    videoId=model<number | undefined>(0);
    service=inject(UserVideosmanageService);
  
    payForVideo(event:Event) {
      if(event.isTrusted && this.videoId()!=null && this.videoId()!=0)
      {
        this.service.generatePaymentId(this.videoId() as number).subscribe({
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
