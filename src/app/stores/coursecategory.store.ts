import { computed, inject } from "@angular/core";
import { patchState, signalStore, withComputed, withMethods, withState } from "@ngrx/signals";
import { CoursemanageService } from "../services/coursemanage.service";
import { firstValueFrom } from "rxjs";

type CourseCategoryState = {
    courseCategories: any[];
    selectedCategories: any[];
    isLoading: boolean;
    error: string | null;
    successMessage: string | null;
}

const initialState: CourseCategoryState = {
    courseCategories: [],
    selectedCategories: [],
    isLoading: false,
    error: null,
    successMessage: null
}

export const CourseCategoryStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withMethods((state) => {
        const courseService = inject(CoursemanageService);
        return {
            async addCategory(category: any): Promise<void> {
                patchState(state, { isLoading: true, error: null, successMessage: null });
                try {
                    const newCategory = await firstValueFrom(courseService.addCategory(category));
                    patchState(state, {
                        isLoading: false,
                        courseCategories: [...state.courseCategories(), newCategory],
                        successMessage: 'Category added successfully'
                    });
                } catch (err: any) {
                    const error = err?.message || 'Failed to add category';
                    patchState(state, { isLoading: false, error });
                }
            },

            async loadCategories(): Promise<void> {
                // Prevent re-fetching if categories are already loaded
                if(state.courseCategories().length > 0) return;
                patchState(state, { isLoading: true, error: null });
                try {
                    const categories = await firstValueFrom(courseService.getCategories());
                    patchState(state, { courseCategories: categories, isLoading: false });
                } catch (err: any) {
                    const error = err?.message || 'Failed to load categories';
                    patchState(state, { isLoading: false, error });
                }
            },

            toggleCategory(category: any): void {
                const selected = state.selectedCategories();
                const isSelected = selected.some(c => c.id === category.id);
                
                if (isSelected) {
                    patchState(state, {
                        selectedCategories: selected.filter(c => c.id !== category.id)
                    });
                } else {
                    patchState(state, {
                        selectedCategories: [...selected, category]
                    });
                }
            },
            
            resetState() {
                patchState(state, initialState);
            }
        };
    }),
    withComputed(({ courseCategories }) => ({
        totalCategories: computed(() => courseCategories().length),
    }))
);