import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-nothing-found',
  imports: [],
  templateUrl: './nothing-found.component.html',
  styleUrl: './nothing-found.component.css'
})
export class NothingFoundComponent {
  @Input() title: string = 'No Results Found';
  @Input() message!: string;
}
