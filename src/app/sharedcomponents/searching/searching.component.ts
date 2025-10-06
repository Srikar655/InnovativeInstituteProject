import { Component, ElementRef, HostListener, inject, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseCategoryStore } from '../../stores/coursecategory.store';
import { CoursesStore } from '../../stores/courses.store';

@Component({
  selector: 'app-searching',
  imports: [CommonModule],
  templateUrl: './searching.component.html',
  styleUrl: './searching.component.css'
})
export class SearchingComponent {
  categoryStore = inject(CourseCategoryStore);
  coursesStore = inject(CoursesStore);
  selectedCategories: Signal<any[]> = this.categoryStore.selectedCategories;
  allCategories: Signal<any[]> = this.categoryStore.courseCategories;
  searchTerm: Signal<string> = this.coursesStore.searchTerm;
  isDropdownOpen = false;

  private elementRef= inject(ElementRef);
  ngOnInit()
  {
    this.categoryStore.loadCategories();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.querySelector('.dropdown-wrapper').contains(event.target) && this.isDropdownOpen) {
      this.isDropdownOpen = false;
    }
  }
  onSearch(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value;
    this.coursesStore.setSearchTerm(searchTerm);
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
  
  toggleCategory(category: any): void {
    this.categoryStore.toggleCategory(category);
  }

  // Helper method for the template to check if a category is selected
  isCategorySelected(category: any): boolean {
    return this.selectedCategories().some(c => c.id === category.id);
  }


}
