// user-course.store.ts
import { computed, inject } from "@angular/core";
import { patchState, signalStore, withComputed, withMethods, withState } from "@ngrx/signals";
import { firstValueFrom } from "rxjs";
import { UserCourseService } from "../userservices/user-course.service";
import { Usercourse } from "../models/usercourse";
import { CoursesStore } from "./courses.store";
import { CoursemanageService } from "../services/coursemanage.service"; // Potentially needed for specific Course fetches



type UserCoursesState = {
    selectedUserCourseData: Usercourse | null;
    isLoading: boolean;
    error: string | null;
    successMessage: string | null;
    userCourses: Usercourse[];
}

const initialState: UserCoursesState = {
    userCourses: [], 
    selectedUserCourseData: null,
    isLoading: false,
    error: null,
    successMessage: null
}

export const UserCoursesStore = signalStore(
    {providedIn:'root'},
    withState(initialState),

    withMethods((state) => {
        const userCourseService = inject(UserCourseService);
        const courseStore = inject(CoursesStore); 

        return {
            async loadUserCourseDetails(courseId: number): Promise<void> {
                if (state.selectedUserCourseData()?.courseId === courseId && !state.isLoading()) {
                    return;
                }

                patchState(state, { isLoading: true, error: null });
                try {
                    const userCourse = await firstValueFrom(userCourseService.getUserCourse(courseId)) as Usercourse;
                    patchState(state, { selectedUserCourseData: {...userCourse,courseId:courseId}, isLoading: false });
                } catch (err: any) {
                    const error = err?.message || 'Failed to load user course details';
                    patchState(state, { isLoading: false, error });
                }
            },

            async selectCourse(courseId: number) {

                await courseStore.selectCourse(courseId);

                await this.loadUserCourseDetails(courseId);
            },
            resetState() {
                patchState(state, initialState);
            }
        };
    }),

    withComputed((state) => {
        const courseStore = inject(CoursesStore);

        return {

            selectedUserCourse: computed(() => {
                const userSpecificData = state.selectedUserCourseData(); 
                const generalCourseData = courseStore.selectedCourse(); 
                console.log('user specific',userSpecificData);
                console.log('general',generalCourseData);
                if (!userSpecificData || !generalCourseData) {
                    return null; 
                }

                if (userSpecificData.courseId !== generalCourseData.id) {
                    console.warn(
                        `Mismatched course IDs: UserCourse.courseId (${userSpecificData.courseId}) ` +
                        `does not match CoursesStore.selectedCourse.id (${generalCourseData.id})`
                    );
                    return null; 
                }
                return {
                    ...userSpecificData, 
                    course: generalCourseData
                };
            }),
            totalCourses: computed(() => state.userCourses().length),
        }
    })
);