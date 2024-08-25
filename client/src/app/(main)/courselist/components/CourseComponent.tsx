"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ConfigProvider } from "antd";
import Search, { SearchProps } from "antd/es/input/Search";
import Image from "next/image";
import starIcon from "@public/icons/star.svg";
import userIcon from "@public/icons/user.svg";

const onSearch: SearchProps["onSearch"] = (value) => {
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
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const router = useRouter();
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  useEffect(() => {
    // Clear any existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set a new timeout
    searchTimeoutRef.current = setTimeout(() => {
      // Check if the search query contains only numbers
      const isNumericQuery = /^\d+$/.test(searchQuery);

      // Create a new course object if no courses match the search query and it's numeric
      const defaultCourse = {
        id: searchQuery,
        title: `Course Title ${searchQuery}`,
        subcategoryName: `SubCategory ${searchQuery}`,
        studentsEnrolled: '0',
        averageRating: 0,
        salePrice: `VIP Instructor 8932, VIP Instructor 9638`,
      };

      const matchingCourses = courses.filter((course) =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase())
      );

      // If no courses match and query is numeric, add the default course
      const coursesToDisplay = matchingCourses.length > 0 || !isNumericQuery
        ? matchingCourses
        : [defaultCourse];

      setFilteredCourses(coursesToDisplay);
    }, 300); // Delay of 300ms
  }, [searchQuery, courses]);

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
                    src={`data:image/jpeg;base64,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`}
                    className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                  />
                </div>
                <div className="flex flex-col p-2 gap-2 border-x-[1.5px] border-b-[1.5px]">
                  <div className="flex justify-between">
                    <p className="body-5 bg-purple3 text-purple-950 font-medium opacity-50 w-fit p-1">
                      {course.subcategoryName}
                    </p>
                    <p className="font-medium text-orange body-2">
                      200.000đ
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
                    <p className="ms-1 text-sm font-medium text-black dark:text-white">
                      {course.averageRating}
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
                      {course.studentsEnrolled}
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
