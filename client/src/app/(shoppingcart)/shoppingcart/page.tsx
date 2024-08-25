import type { Metadata } from "next";
import ShopppingCart from "./components/ShoppingCart";

export const metadata: Metadata = {
  title: "Home Page",
  description: "Home Page Description",
};

const page = async({ params}: {params: {id: string}}) => {

  const { id }: {id: number} = { id: 60012 };

  const res = await fetch(`http://localhost:5000/read-shopping-cart/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) throw new Error("Failed to fetch shopping cart details");

  const shoppingCart: ShoppingCart[] = await res.json();
  console.log("me", shoppingCart);
  return (
    <div className="w-full flex flex-col items-center" style={{ height: "calc(100vh - 100px)" }}>
      <ShopppingCart shoppingCart={shoppingCart} />
    </div>
  );
};
export default page;
