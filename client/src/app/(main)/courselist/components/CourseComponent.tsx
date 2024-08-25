"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ConfigProvider } from "antd";
import Search, { SearchProps } from "antd/es/input/Search";
import Image from "next/image";
import starIcon from "@public/icons/star.svg";
import userIcon from "@public/icons/user.svg";

const onSearch: SearchProps["onSearch"] = (value) => {
  // This function will be called when the search is performed
  // You can handle search query logic here if needed
  console.log("Search value:", value);
};

export const SearchBar: React.FC<{ onSearch: (value: string) => void }> = ({
  onSearch,
}) => (
  <ConfigProvider
    theme={{
      token: {
        colorPrimary: "#F5F7FA",
        colorPrimaryActive: "#F5F7FA",
        borderRadius: 20,
        controlHeight: 12,
        fontSize: 16,
        lineWidth: 0,
        colorBgContainer: "#F5F7FA",
      },
      components: {
        Input: {
          inputFontSizeLG: 14,
          paddingBlockLG: 10,
          paddingInlineLG: 16,
          addonBg: "#F5F7FA",
        },
      },
    }}
  >
    <Search
      placeholder="Search by course name"
      onSearch={onSearch}
      style={{ width: "100%" }}
      enterButton
      size="large"
      id="search-bar"
    />
  </ConfigProvider>
);

export default function CourseComponent({ courses }: { courses: Course[] }) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const router = useRouter();

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-4 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <div className="flex gap-40">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            Courses
          </h2>
          <SearchBar onSearch={handleSearch} />
        </div>
        <div className="flex items-center justify-center w-full">
          <div className="slider-container mt-6 grid grid-cols-1 grid-rows-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-4">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className="group relative cursor-pointer"
                onClick={() => router.push(`/course/${course.id}`)}
              >
                <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden bg-gray-200 lg:aspect-none group-hover:opacity-75 h-52 w-64">
                  <img
                    alt={course.title}
                    src={`https://picsum.photos/312/${200 + course.id}`}
                    className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                  />
                </div>
                <div className="flex flex-col p-2 gap-2 border-x-[1.5px] border-b-[1.5px]">
                  <div className="flex justify-between">
                    <p className="body-5 bg-purple3 text-purple-950 font-medium opacity-50 w-fit p-1">
                      {course.subcategory_name}
                    </p>
                    <p className="font-medium text-orange body-2">
                      {course.sale_price}
                    </p>
                  </div>
                  <h3 className="body-3 font-medium text-gray-dark">
                    <span aria-hidden="true" className="absolute inset-0" />
                    {course.title}
                  </h3>
                </div>
                <div className="flex items-center justify-between border-x-[1.5px] border-b-[1.5px] p-2">
                  <div className="flex">
                    <Image
                      src={starIcon}
                      alt="Star Icon"
                      width={16}
                      height={16}
                      priority
                    />
                    <p className="ms-1 text-sm font-medium text-gray-medium dark:text-white">
                      {course.average_rating}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Image
                      src={userIcon}
                      alt="User Icon"
                      width={16}
                      height={16}
                      priority
                    />
                    <p className="text-sm font-medium text-gray-dark dark:text-white">
                      {course.students_enrolled}
                      <span className="text-gray-light">students</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
