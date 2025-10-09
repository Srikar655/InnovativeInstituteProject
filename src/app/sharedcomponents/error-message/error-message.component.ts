import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-error-message',
  imports: [],
  templateUrl: './error-message.component.html',
  styleUrl: './error-message.component.css'
})
export class ErrorMessageComponent {
  @Input() message!:string;

  @Input() buttonText: string = 'Try Again';

  @Output() retry = new EventEmitter<void>();

  onRetryClick(): void {
    this.retry.emit();
  }
}
