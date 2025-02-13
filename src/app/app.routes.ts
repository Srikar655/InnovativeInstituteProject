import { Routes } from '@angular/router';
import { redirectGuard } from './redirect.guard';



export const routes: Routes = [
   {path:'managecourses/:id' , loadComponent:()=>import('./AdminComponents/manage-courses/manage-courses.component').then(c=>c.ManageCoursesComponent), canActivate:[redirectGuard]},
   {path:'tasks' , loadComponent:()=>import('./AdminComponents/tasks/tasks.component').then(c=>c.TasksComponent) , canActivate:[redirectGuard]},
   {path:'tutorial-vedios' , loadComponent:()=>import('./AdminComponents/tutorial-vedios/tutorial-vedios.component').then(c=>c.TutorialVediosComponent) , canActivate:[redirectGuard]},
   {path:'payment-history', loadComponent:()=>import('./AdminComponents/payment-history/payment-history.component').then(c=>c.PaymentHistoryComponent) , canActivate:[redirectGuard]},
   {path:'' , loadComponent:()=>import('./AdminComponents/login/login.component').then(c=>c.LoginComponent)},
   {path:'courses' , loadComponent:()=>import('./AdminComponents/courses/courses.component').then(c=>c.CoursesComponent) , canActivate:[redirectGuard]},
   {path:'addcourses' , loadComponent:()=>import('./AdminComponents/add-course/add-course.component').then(c=>c.AddCourseComponent) , canActivate:[redirectGuard]},
   
];
