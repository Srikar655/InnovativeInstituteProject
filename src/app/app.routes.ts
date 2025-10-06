import { Routes } from '@angular/router';
import { HomePageComponent } from './AdminComponents/home-page/home-page.component';
import { UserHomePageComponent } from './UserComponents/user-home-page/user-home-page.component';
import { authGuard } from './guards/auth.guard';



export const routes: Routes = [
   {path:'adminHomePage',component:HomePageComponent,canActivate:[authGuard],data:{role:'ROLE_ADMIN'},
      children:[
         { path: 'adminHomePage', redirectTo: '', pathMatch: 'full' },
         {path:'managecourses/:id' , loadComponent:()=>import('./AdminComponents/manage-courses/manage-courses.component').then(c=>c.ManageCoursesComponent), canActivate:[authGuard],data:{role:'ROLE_ADMIN'}},
         {path:'tasks' , loadComponent:()=>import('./AdminComponents/tasks/tasks.component').then(c=>c.TasksComponent) , canActivate:[authGuard],data:{role:'ROLE_ADMIN'}},
         {path:'tutorial-vedios' , loadComponent:()=>import('./AdminComponents/tutorial-vedios/tutorial-vedios.component').then(c=>c.TutorialVediosComponent) , canActivate:[authGuard],data:{role:'ROLE_ADMIN'}},
         {path:'payment-history', loadComponent:()=>import('./AdminComponents/payment-history/payment-history.component').then(c=>c.PaymentHistoryComponent) , canActivate:[authGuard],data:{role:'ROLE_ADMIN'}},
         {path:'courses' , loadComponent:()=>import('./AdminComponents/courses/courses.component').then(c=>c.CoursesComponent) , canActivate:[authGuard],data:{role:'ROLE_ADMIN'}},
         {path:'addcourses' , loadComponent:()=>import('./AdminComponents/add-course/add-course.component').then(c=>c.AddCourseComponent) , canActivate:[authGuard],data:{role:'ROLE_ADMIN'}},
         {path:'user-tasksolution-info',loadComponent:()=>import('./AdminComponents/user-task-solution-notifyinglist/user-task-solution-notifyinglist.component').then(c=>c.UserTaskSolutionNotifyinglistComponent),canActivate:[authGuard],data:{role:'ROLE_ADMIN'}},
         //{path:'login' , loadComponent:()=>import('./AdminComponents/login/login.component').then(c=>c.LoginComponent)}
         {path:'dashboard', loadComponent:()=>import('./sharedcomponents/dashboard/dashboard.component').then(c=>c.DashboardComponent)},
      ]
   },
   {path:'login' , loadComponent:()=>import('./AdminComponents/login/login.component').then(c=>c.LoginComponent)},
   
   {path:'',component:UserHomePageComponent , children:[
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {path:'dashboard', loadComponent:()=>import('./sharedcomponents/dashboard/dashboard.component').then(c=>c.DashboardComponent)},
      {path:'course-details/:id',loadComponent:()=>import('./UserComponents/coursedetails/coursedetails.component').then(c=>c.CoursedetailsComponent),canActivate:[authGuard],data:{role:'ROLE_USER'}},
      {path:'usercourses',loadComponent:()=>import('./UserComponents/homepage/homepage.component').then(c=>c.HomepageComponent),canActivate:[authGuard],data:{role:'ROLE_USER'}}
   ]
   },
   
];
