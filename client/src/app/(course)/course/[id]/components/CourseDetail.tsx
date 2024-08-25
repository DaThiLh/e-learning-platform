"use client";
import React, { useState, useEffect } from "react";
import { cn } from "@/libs/utils";
import s from "./CourseDetail.module.scss";
import { Rate } from "antd";
import ListCom from "./ListCom";
import { Button } from "antd";
import { useRouter } from "next/navigation";
import { ClockCircleOutlined, FieldTimeOutlined } from "@ant-design/icons";

function calculateDiscountPercentage(
  salePrice: number,
  tierPrice: number
): number {
  if (tierPrice === 0) return 0; // Prevent division by zero
  return ((tierPrice - salePrice) / tierPrice) * 100;
}



const CourseDetailComponent = ({ courseId }) => {
  const [courseData, setCourseData] = useState<CourseDetail | null>(null);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const res = await fetch(`http://localhost:5000/coursedetail/${courseId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) throw new Error("Failed to fetch course details");

        const course: CourseDetail = await res.json();
        console.log("me", course);
        setCourseData(course);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCourseData();
  }, [courseId]);

  const router = useRouter();

  if (!courseData) return <p>Loading...</p>;

  return (
    <div className={cn(s.CourseDetailContainer, "h-full w-9/12 mx-auto flex flex-row sm:my-5 lg:my-16")}>
      <div className="w-4/6 h-fit relative border-2 lg:px-16 sm:px-5 sm:py-4 lg:pt-12 lg:pb-8 mr-5">
        <h1 className="text-2xl font-bold">{courseData.course_title}</h1>
        <p className="mt-4">{courseData.course_description}</p>
        <div className="flex sm:flex-col md:flex-row justify-between">
          <div>
            <div>{courseData.instructor_name}</div>
          </div>
          {courseData.course_average_rating !== "0" && (
            <div>
              <Rate disabled defaultValue={parseFloat(courseData.course_average_rating)} />
            </div>
          )}
        </div>

        <div className="w-full relative">
          <div className="relative aspect-[1/0.75]">
            <img
              src={courseData.course_image}
              className="absolute top-0 left-0 w-full h-full object-cover"
              alt={courseData.course_title}
            />
          </div>
        </div>

        <div>
          <ListCom course={courseData} />
        </div>
      </div>
      <div className="w-2/6 h-full border-2 p-4">
        <div>
          <div className="flex md:flex-row sm:flex-col justify-between">
            <div className="flex flex-row sm:justify-center">
              <div className="mr-2 font-medium text-lg flex items-center">
                {courseData.course_sale_price}
              </div>
              <div className="text-xs line-through flex items-center">
                {courseData.tier_price}
              </div>
            </div>
            <div className="text-xs p-2 bg-light_orange text-orange sm:text-center sm:mb-2">
              {calculateDiscountPercentage(courseData.course_sale_price, courseData.tier_price).toFixed(0)}% OFF
            </div>
          </div>
          <div className="text-color text-xs flex flex-row">
            <FieldTimeOutlined />
            <div className="text-orange ml-2 flex flex-row">
              <span>2 days left at this price!</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col mt-3 pt-3 border-t-2">
          <div className="flex lg:flex-row sm:flex-col justify-between">
            <div className="flex flex-row">
              <ClockCircleOutlined />
              <div className="text-xs flex items-center ml-2">Course Duration</div>
            </div>
            <div className="ml-[25px] text-xs flex items-center text-gray-medium">
              6 Month
            </div>
          </div>
          <div className="flex lg:flex-row sm:flex-col justify-between mt-3">
            <div className="flex flex-row">
              <ClockCircleOutlined />
              <div className="text-xs flex items-center ml-2">Course Level</div>
            </div>
            <div className="ml-[25px] text-xs flex items-center text-gray-medium">
              Beginner and Intermediate
            </div>
          </div>
          <div className="flex lg:flex-row sm:flex-col justify-between mt-3">
            <div className="flex flex-row">
              <ClockCircleOutlined />
              <div className="text-xs flex items-center ml-2">Student Enrolled</div>
            </div>
            <div className="ml-[25px] text-xs flex items-center text-gray-medium">
              69,419,618
            </div>
          </div>
          <div className="flex lg:flex-row sm:flex-col justify-between mt-3">
            <div className="flex flex-row">
              <ClockCircleOutlined />
              <div className="text-xs flex items-center ml-2">Language</div>
            </div>
            <div className="ml-[25px] text-xs flex items-center text-gray-medium">
              English
            </div>
          </div>
          <div className="flex lg:flex-row sm:flex-col justify-between mt-3">
            <div className="flex flex-row">
              <ClockCircleOutlined />
              <div className="text-xs flex items-center ml-2">Subtitle Language</div>
            </div>
            <div className="ml-[25px] text-xs flex items-center text-gray-medium">
              English
            </div>
          </div>
        </div>
        <div className="flex flex-col mt-3 pt-3 border-t-2">
          <div>
            <Button type="primary" id="add">Add to Cart</Button>
          </div>
          <div className="mt-2">
            <Button type="primary" id="buy" onClick={() => router.push(`/checkout/${courseId}`)}>
              Buy now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailComponent;
