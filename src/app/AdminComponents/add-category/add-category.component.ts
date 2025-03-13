import { Component, inject } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CoursemanageService } from '../../services/coursemanage.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-category',
  imports: [CommonModule,FormsModule],
  templateUrl: './add-category.component.html',
  styleUrl: './add-category.component.css'
})
export class AddCategoryComponent {
category='';
  dialog=inject(MatDialogRef<AddCategoryComponent>);
  service=inject(CoursemanageService);
  onSubmit() {
    this.service.addCategory({id:0,category:this.category}).subscribe({
      next:res=>{

      },
      error:err=>{
        console.log(err);
      }
    });
    this.category='';
    this.dialog.close();
  }
}
