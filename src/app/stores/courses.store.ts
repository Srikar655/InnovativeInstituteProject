import { computed, inject } from "@angular/core";
import { Course } from "../models/course";
import { patchState, signalStore, withComputed, withMethods, withState } from "@ngrx/signals";
import { CoursemanageService } from "../services/coursemanage.service";
import { firstValueFrom } from "rxjs";
import { CourseCategoryStore } from "./coursecategory.store";
import { UserCourseService } from "../userservices/user-course.service";


type CoursesState = {
    courses: Course[];
    selectedCourse: Course | null;
    searchTerm: string;
    isLoading: boolean;
    isThumnailLoading: boolean;
    error: string | null;
    successMessage: string | null;
}

const initialState: CoursesState = {
    courses: [],
    selectedCourse: null,
    searchTerm:'',
    isLoading: false,
    isThumnailLoading: false,
    error: null,
    successMessage: null
}


export const CoursesStore = signalStore(
    {providedIn:'root'},
    withState(initialState),

    withMethods((state) => {
        const courseService = inject(CoursemanageService);
        const userCourseService = inject(UserCourseService);

        return {
            async loadCourses(): Promise<void> {
                patchState(state, { isLoading: true, error: null });
                try {
                    const courses = await firstValueFrom(courseService.get());
                    patchState(state, { courses, isLoading: false });
                } catch (err: any) {
                    const error = err?.message || 'Failed to load courses';
                    patchState(state, { isLoading: false, error });
                }
            },

            async loadCourseThumbnail(courseId: number): Promise<void> {
                const course = state.courses().find(c => c.id === courseId);
                if(course?.coursethumbnail) return; 
                patchState(state, { isThumnailLoading: true, error: null });
                try{
                    const {coursethumbnail} = await firstValueFrom(courseService.getCourseThumbnail(courseId));
                    const updatedCourses = state.courses().map(course => 
                        course.id == courseId ? { ...course, coursethumbnail } : course
                    );
                    patchState(state, { courses: updatedCourses, isThumnailLoading: false });

                } catch(err:any){
                    const error = err?.message || 'Failed to load thumbnail';
                    patchState(state, { isThumnailLoading: false, error });
                }
            },

            async addCourse(course: any): Promise<void> {
                patchState(state, { isLoading: true, error: null, successMessage: null });
                try {
                    const newCourse = await firstValueFrom(courseService.save(course));
                    patchState(state, {
                        courses: [...state.courses(), newCourse],
                        isLoading: false,
                        successMessage: 'Course added successfully'
                    });
                } catch (err: any) {
                    const error = err?.message || 'Failed to add course';
                    patchState(state, { isLoading: false, error });
                }
            },

            async deleteCourse(courseId: number): Promise<void> {
                patchState(state, { isLoading: true, error: null, successMessage: null });
                try {
                    await firstValueFrom(courseService.deleteCourse(courseId));
                    patchState(state, {
                        isLoading: false,
                        courses: state.courses().filter(c => c.id !== courseId),
                        successMessage: 'Course deleted successfully'
                    });
                } catch (err: any) {
                    const error = err?.message || 'Failed to delete course';
                    patchState(state, { isLoading: false, error });
                }
            },

            async updateCourse(course: any): Promise<void> {
                patchState(state, { isLoading: true, error: null, successMessage: null });
                try {
                    const updatedCourse = await firstValueFrom(courseService.editCourse(course));
                    patchState(state, {
                        isLoading: false,
                        courses: state.courses().map(c => c.id == updatedCourse.id ? updatedCourse : c),
                        successMessage: 'Course updated successfully'
                    });
                } catch (err: any) {
                    const error = err?.message || 'Failed to update course';
                    patchState(state, { isLoading: false, error });
                }
            },

            async selectCourse(courseId: number) {
                if(state.selectedCourse()?.id === courseId) return;
                if(!courseId){
                    patchState(state, { selectedCourse: null });
                    return;
                }
                patchState(state, { isLoading: true, error: null });
                try {
                     const course =  await firstValueFrom(courseService.getCourse(courseId));
                     patchState(state, { selectedCourse: course, isLoading: false });
                } catch (err: any) {
                    const error = err?.message || 'Failed to load course details';
                    patchState(state, { isLoading: false, error });
                }
               
            },

            setSearchTerm(searchTerm: string): void {
                patchState(state, { searchTerm });
            },
            
            resetState() {
                patchState(state, initialState);
            }
        };
    }),


    withComputed((state) => {
        const categoryStore = inject(CourseCategoryStore);

        return {
            filteredCourses: computed(() => {
                const term = state.searchTerm().toLowerCase();
                const selectedCategories = categoryStore.selectedCategories();
                const selectedCatIds = new Set(selectedCategories.map(c => c.id));
                
                // `state.entities()` is the signal containing all course objects
                // This is automatically provided by `withEntities`
                return state.courses()
                    .filter(course => 
                        course.coursename.toLowerCase().includes(term)
                    )
                    .filter(course => {
                        if (selectedCatIds.size === 0) return true;
                        return selectedCatIds.has(course.categoryId); 
                    });
            }),
            
            // totalCourses is now simpler
            totalCourses: computed(() => state.courses().length),
        }
    })
);