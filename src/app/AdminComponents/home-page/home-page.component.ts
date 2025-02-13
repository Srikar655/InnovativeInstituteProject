import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CoursesComponent } from '../courses/courses.component';

@Component({
  selector: 'app-home-page',
  imports: [RouterLink],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {
  router=inject(Router);
  navigateToCourses()
  {
    this.router.navigate(['/courses']);
  }
}
