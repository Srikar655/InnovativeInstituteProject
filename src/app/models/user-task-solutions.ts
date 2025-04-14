import { Usertask } from "./usertask";

export interface UserTaskSolutions {
    id: number;
    solutionimages:Uint8Array[];
    description:string;
    usertask:Usertask;
    email:string;
}
