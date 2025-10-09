import { computed, effect, inject, untracked } from "@angular/core";
import { patchState, signalStore, withComputed, withMethods, withState } from "@ngrx/signals";
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, debounceTime, distinctUntilChanged, tap } from "rxjs";
import { firstValueFrom } from "rxjs";
import { tapResponse } from "@ngrx/operators";
import { Course } from "../models/course";
import { CoursemanageService, PaginatedResponse } from "../services/coursemanage.service";
import { CourseCategoryStore } from "./coursecategory.store";



type CoursesState = {
    courses: Course[];
    detailedCourses : Record<number, Course>; 
    selectedCourse: Course | null;
    isLoading: boolean;
    isMutating: boolean;
    isLoadingNextPage: boolean;
    loadError: string | null;
    mutationError: string | null;
    searchTerm: string;
    pageNumber: number;
    pageSize: number;
    hasMorePages: boolean;
}

const initialState: CoursesState = {
    courses: [],
    detailedCourses: {},
    selectedCourse: null,
    isLoading: false,
    isMutating: false,
    isLoadingNextPage: false,
    loadError: null,
    mutationError: null,
    searchTerm: '',
    pageNumber: 0,
    pageSize: 10,
    hasMorePages: false,
};

export const CoursesStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withMethods((store, courseService = inject(CoursemanageService), categoryStore = inject(CourseCategoryStore)) => {

        const requestParams = computed(() => ({
            page: store.pageNumber(),
            size: store.pageSize(),
            searchTerm: store.searchTerm(),
            categoryIds: categoryStore.selectedCategories().map(c => c.id),
        }));

        const loadCourses = rxMethod<ReturnType<typeof requestParams>>(
            pipe(
                debounceTime(300),
                tap(()=>console.log(store.hasMorePages())),
                distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
                switchMap(params => 
                    methods.load(params)
                ),
            )
        );
        
        loadCourses(requestParams);
        const methods = {
            load(params:ReturnType<typeof requestParams>)
            {
                if(params.page==0)
                    patchState(store,{isLoading:true,loadError:null})
                else
                    patchState(store,{isLoadingNextPage:true,loadError:null})
                return courseService.getCourses(params).pipe(
                    tapResponse({
                        next: (response:PaginatedResponse<Course>) => {
                            const newCourses = params.page === 0 
                                ? response.content 
                                : [...store.courses(), ...response.content];
                
                            patchState(store, {
                                courses: newCourses,
                                hasMorePages: !response.last,
                            });
                        },
                        error: (err: any) => patchState(store, { loadError:err?.message || 'Failed to load courses Please Try Again..' }),
                        finalize: () => patchState(store, { isLoading: false , isLoadingNextPage:false}),
                    })
                )
            },
            ...store 
        };

        effect(() => {
            categoryStore.selectedCategories(); 
            untracked(() => {
                patchState(store,{pageNumber:0,loadError:null})
            });
        });
        

        return {
            async resetAndLoad() : Promise<void>
            {
                await methods.load(requestParams()).subscribe();
            },
            setSearchTerm(searchTerm: string): void {
                patchState(store, { searchTerm });
            },
            
            setPageSize(pageSize: number): void {
                if (store.pageSize() === pageSize) return;
                patchState(store, { pageSize });
            },

            loadNextPage(): void {
                if (!store.isLoading() && !store.isLoadingNextPage() && store.hasMorePages()) {
                    patchState(store, { pageNumber: store.pageNumber() + 1 });
                }
            },
            
            async addCourse(courseData: any): Promise<void> {
                if(store.isMutating()) return;
                patchState(store, { isMutating: true, mutationError: null });
                try {
                    await firstValueFrom(courseService.save(courseData));
                    patchState(store, { pageNumber: 0 });
                } catch (err: any) {
                    patchState(store, { mutationError: err?.message || 'Failed to add course' });
                } finally {
                    patchState(store, { isMutating: false });
                }
            },

            async selectCourse(courseId: number): Promise<void> {
                if (store.isLoading() || store.selectedCourse()?.id === courseId) return;
                const cachedCourse = store.detailedCourses()[courseId];
                if (cachedCourse) {
                    patchState(store, { selectedCourse: cachedCourse });
                    return;
                }
                patchState(store, { isLoading: true });
                try {
                    const course = await firstValueFrom(courseService.getCourse(courseId));
                    patchState(store, { selectedCourse: course, isLoading: false , detailedCourses: {...store.detailedCourses(), [courseId]: course} , mutationError:null });
                } catch(err: any) {
                    patchState(store, { isLoading: false, loadError: 'Failed to load course details' });
                }
            },
            async deleteCourse(courseId:number):Promise<void>{
                if(store.isMutating()) return;
                const originalCourses = [...store.courses()];
                const updatedCourses = originalCourses.filter(c => c.id !== courseId);
                patchState(store, { courses: updatedCourses, mutationError: null , isMutating:true });
                try{
                    await firstValueFrom(courseService.deleteCourse(courseId));
                    const updatedDetailedCourses = { ...store.detailedCourses() };
                    delete updatedDetailedCourses[courseId];
                    const selectedWasDeleted = store.selectedCourse()?.id === courseId;
                    patchState(store,{
                        isMutating:false,
                        detailedCourses: updatedDetailedCourses,
                        selectedCourse: selectedWasDeleted ? null : store.selectedCourse()
                    });
                } catch (err: any) {
                    console.log(err);
                    patchState(store, { courses: originalCourses , isMutating: false ,  mutationError: err?.message || 'Failed to delete course' });
                    throw err;
                }
            }
        };
    }),
    withComputed(({ courses }) => ({
        totalCourses: computed(() => courses().length),
    }))
);