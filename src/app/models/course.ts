export interface Course {
    id:number
    coursename:string,
    courseprice:number
    coursethumbnail?:Uint8Array,
    courseDescription:string,
     courseFeatures:string[],
      courseTrailer:string
}
