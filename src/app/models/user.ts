export interface User {
    id:number;
    username:string;
    email:string;
    phonenumber?:string;
    roles:Role[];
    picture?:string;
}

interface Role
{
    name:string;
}
