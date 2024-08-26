"use client";
import SearchBar from "./components/Search";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

const InstructorHeader = ({ contentName }: { contentName: string }) => {
  // contentName = "Create a new course";
  const currentTime = new Date();
  const router = useRouter();
  const currentHour = currentTime.getHours();

  let greeting;

  if (currentHour >= 5 && currentHour < 12) {
    greeting = "Good morning!";
  } else if (currentHour >= 12 && currentHour < 18) {
    greeting = "Good afternoon!";
  } else {
    greeting = "Good evening!";
  }
  return (
    <div className="h-fit w-full bg-primary-100 px-8 py-6 bg-white flex justify-between items-center border-b-2	cursor-pointer">
      <div className="container mx-auto flex justify-between items-center">
        <section
          className="flex flex-col items-start justify-between gap-1"
          onClick={() => router.push(`/courselist`)}
        >
          <p className="body-medium text-gray-medium">{greeting}</p>
          <p className="body-xxl text-gray-dark">{contentName}</p>
        </section>
        <section className="flex gap-4 items-center">
          <SearchBar />
          <div
            className="cursor-pointer bg-background flex items-center justify-center rounded-2xl p-2 hover:opacity-40"
            onClick={() => router.push(`/shoppingcart`)}
          >
            <ShoppingCartOutlined style={{ fontSize: "24px" }} />
          </div>
          <Link className="hover:opacity-40" href="/profile">
            <Image
              src="/images/avt.png"
              className="rounded-xl"
              alt="avatar"
              width={52}
              height={52}
            />
          </Link>
        </section>
      </div>
    </div>
  );
};

export default InstructorHeader;
