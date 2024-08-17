// import CourseComponent from "./CourseComponent";
// // import SliderMain from "./SliderMain";
// // import getAllCourses from "getAllCourses";
// import { ST } from "next/dist/shared/lib/utils";

// // types.ts
// export interface SafeUser {
//     id: string;
//     name: string;
//     email: string;
// }

export interface safeCourse {
  id: string;
  name: string;
  author: string;
  imageSrc: string;
  price: number;
}

// const images = [
//     "/a.jpg",
//     "b.jpg"
// ]

// const mockUser: SafeUser = {
//     id: "user1",
//     name: "Alice",
//     email: "alice@example.com",
// };

// interface HomeProps {
//     searchParams: string
// }

// export default async function Home({ searchParams }: HomeProps) {

//     //   const courses = await getAllCourses(searchParams);

//     return (
//         <main className="w-screen">

//             <div className="flex w-full justify-end">

//                 <div className="flex flex-wrap sm:px-8 w-full">
//                     {mockCourses.map((item: any) => (
//                         <CourseComponent
//                             key={item.id}
//                             data={item} currentUser={null} />
//                     ))}
//                 </div>

//             </div>
//         </main>
//     )
// }
