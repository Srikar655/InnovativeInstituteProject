import { Routes } from '@angular/router';
import { redirectGuard } from './redirect.guard';
import { HomePageComponent } from './AdminComponents/home-page/home-page.component';
import { UserHomePageComponent } from './UserComponents/user-home-page/user-home-page.component';



export const routes: Routes = [
   {path:'adminHomePage',component:HomePageComponent,canActivate:[redirectGuard],
      children:[
         { path: 'adminHomePage', redirectTo: 'courses', pathMatch: 'full' },
         {path:'managecourses/:id' , loadComponent:()=>import('./AdminComponents/manage-courses/manage-courses.component').then(c=>c.ManageCoursesComponent), canActivate:[redirectGuard]},
         {path:'tasks' , loadComponent:()=>import('./AdminComponents/tasks/tasks.component').then(c=>c.TasksComponent) , canActivate:[redirectGuard]},
         {path:'tutorial-vedios' , loadComponent:()=>import('./AdminComponents/tutorial-vedios/tutorial-vedios.component').then(c=>c.TutorialVediosComponent) , canActivate:[redirectGuard]},
         {path:'payment-history', loadComponent:()=>import('./AdminComponents/payment-history/payment-history.component').then(c=>c.PaymentHistoryComponent) , canActivate:[redirectGuard]},
         {path:'courses' , loadComponent:()=>import('./AdminComponents/courses/courses.component').then(c=>c.CoursesComponent) , canActivate:[redirectGuard]},
         {path:'addcourses' , loadComponent:()=>import('./AdminComponents/add-course/add-course.component').then(c=>c.AddCourseComponent) , canActivate:[redirectGuard]},
         {path:'user-tasksolution-info',loadComponent:()=>import('./AdminComponents/user-task-solution-notifyinglist/user-task-solution-notifyinglist.component').then(c=>c.UserTaskSolutionNotifyinglistComponent),canActivate:[redirectGuard]},
         {path:'login' , loadComponent:()=>import('./AdminComponents/login/login.component').then(c=>c.LoginComponent)}
      ]
   },
   {path:'',component:UserHomePageComponent,children:[
      { path: '', redirectTo: 'usercourses', pathMatch: 'full' },
      {path:'course-details/:id',loadComponent:()=>import('./UserComponents/coursedetails/coursedetails.component').then(c=>c.CoursedetailsComponent),canActivate:[redirectGuard]},
      {path:'login' , loadComponent:()=>import('./AdminComponents/login/login.component').then(c=>c.LoginComponent)},
      {path:'usercourses',loadComponent:()=>import('./UserComponents/homepage/homepage.component').then(c=>c.HomepageComponent),canActivate:[redirectGuard]}
   ]
   },
   
];
