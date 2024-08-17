import type { Metadata } from "next";
import ShopppingCart from "./components/ShoppingCart";

export const metadata: Metadata = {
  title: "Home Page",
  description: "Home Page Description",
};

const page = () => {
  return (
    <div className="w-full flex flex-col items-center" style={{ height: "calc(100vh - 100px)" }}>
      <ShopppingCart />
    </div>
  );
};
export default page;
