import type { Metadata } from "next";
import CheckOut from "./CheckOut";

export const metadata: Metadata = {
  title: "Home Page",
  description: "Home Page Description",
};

const page = async ({ params }: { params: { id: string } }) => {
  const { id } = params;

  // Fetch the course details as shown above
  const res = await fetch(`http://localhost:5000/coursedetail/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) throw new Error("Failed to fetch course details");

  const course: CourseDetail = await res.json();
  console.log("me",course);
  interface CourseDetailProps {
    course: CourseDetail; // Assuming CourseDetail is defined correctly
    courseId: string;     // Assuming courseId is a string
  }
  return (
    <div className="w-full flex flex-col items-center" style={{ height: "calc(100vh - 100px)" }}>
      <CheckOut course={course.data}/>
    </div>
  );
};
export default page;
