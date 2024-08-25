import type { Metadata } from "next";
import CheckOut from "./CheckOut";

export const metadata: Metadata = {
  title: "Home Page",
  description: "Home Page Description",
};

const page = async ({ params }: { params: { id: string } }) => {
  const { id } = params;

  // Fetch the course details as shown above
 

  return (
    <div className="w-full flex flex-col items-center" style={{ height: "calc(100vh - 100px)" }}>
      <CheckOut courseId = {id}/>
    </div>
  );
};
export default page;
