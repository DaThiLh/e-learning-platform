import type { Metadata } from "next";
import CheckOut from "./components/CheckOut";

export const metadata: Metadata = {
  title: "Home Page",
  description: "Home Page Description",
};

const page = () => {
  return (
    <div className="w-full flex flex-col items-center" style={{ height: "calc(100vh - 100px)" }}>
      <CheckOut />
    </div>
  );
};
export default page;
