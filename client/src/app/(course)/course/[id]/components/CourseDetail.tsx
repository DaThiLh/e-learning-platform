import React from 'react';
import { cn } from "@/libs/utils";
import s from "./CourseDetail.module.scss";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Rate } from 'antd';
import ListCom from './ListCom';
import { Button } from 'antd';
import {
  ClockCircleOutlined,FieldTimeOutlined
} from '@ant-design/icons';
type Teacher = {
  id: number;
  name: string;
  expertise: string;
};

type Course = {
  id: number;
  title: string;
  description: string;
  subcategory_name: string;
  sale_price: string;
  origin_price: string;
  average_rating: number;
  students_enrolled: number;
  teachers: Teacher[]; // Array of Teacher objects
};

// Single course object
const course: Course = {
  id: 1,
  title: "Course 1",
  description: "This is the first course.",
  subcategory_name: "Category 1",
  sale_price: "$99",
  origin_price: "$199",
  average_rating: 4.5,
  students_enrolled: 1500,
  teachers: [
    { id: 1, name: "John Doe", expertise: "Mathematics" },
    { id: 2, name: "Jane Smith", expertise: "Physics" },
  ],
};
const calculateDiscountPercentage = (salePrice: string, originPrice: string): number => {
  // Remove currency symbols and convert to numbers
  const sale = parseFloat(salePrice.replace(/[^0-9.-]+/g, ""));
  const origin = parseFloat(originPrice.replace(/[^0-9.-]+/g, ""));
  
  // Calculate the discount percentage
  return ((origin - sale) / origin) * 100;
};

// Calculate the discount percentage
const discountPercentage = calculateDiscountPercentage(course.sale_price, course.origin_price);

const CourseDetail = () => {
  const { id } = useParams();

  // Directly use the single course object as there's no array
  if (parseInt(id as string, 10) !== course.id) {
    return <p>Course not found</p>;
  }

  return (
    <div className={cn(s.CourseDetailContainer, "h-full w-9/12 mx-auto flex flex-row sm:my-5 lg:my-16 ")}>
      <div className="w-4/6 h-fit relative border-2 lg:px-16 sm:px-5 sm:py-4 lg:pt-12 lg:pb-8 mr-5">
        <h1 className="text-2xl font-bold">{course.title}</h1>
        <p className="mt-4">{course.description}</p>
        <div className="flex sm:flex-col md:flex-row justify-between">
          <div>
            <ul>
              {course.teachers.map((teacher) => (
                <span key={teacher.id}>{teacher.name}{course.teachers.indexOf(teacher) < course.teachers.length - 1 && ', '}</span>
              ))}
            </ul>
          </div>
          <div>
            <Rate disabled defaultValue={course.average_rating} />
            {course.average_rating}
          </div>
        </div>
        
        <div className="mt-4 aspect-h-1 aspect-w-1 w-full overflow-hidden bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-100 lg:w-62">
          <img
            alt={course.title}
            src={`https://picsum.photos/312/${220 + course.id}`}
            className="h-full w-full object-cover object-center lg:h-full lg:w-full"
          />            
        </div>
        <div>
          <ListCom/>
        </div>
      </div>
      <div className="w-2/6 h-full border-2 p-4">
        <div>
          <div className ="flex md:flex-row sm:flex-col justify-between">
            <div className ="flex flex-row sm:justify-center">
              <div className ="mr-2 font-medium text-lg flex items-center">
                {course.sale_price}
              </div>
              <div className ="text-xs line-through flex items-center">
                {course.origin_price}
              </div>
            </div>
            <div className ="text-xs p-2 bg-light_orange text-orange sm:text-center sm:mb-2">
              {discountPercentage.toFixed(0)}% OFF
            </div>
          </div>
          <div className ="text-color text-xs flex flex-row">
            <FieldTimeOutlined />
            <div className ="text-orange ml-2 flex flex-row">
              <span>
                2 days left at this price!
              </span>
            </div>
          </div>
        </div>
        <div className ="flex flex-col mt-3 pt-3 border-t-2	">
          <div className ="flex lg:flex-row sm:flex-col justify-between">
            <div className ="flex flex-row ">
              <ClockCircleOutlined />
              <div className ="text-xs flex items-center ml-2">Course Duration</div>
            </div>
            <div className ="ml-[25px] text-xs flex items-center text-gray-medium ">
              6 Month
            </div>
          </div>
          <div className ="flex lg:flex-row sm:flex-col justify-between mt-3">
            <div className ="flex flex-row">
              <ClockCircleOutlined />
              <div className ="text-xs flex items-center ml-2">Course Level</div>
            </div>
            <div className ="ml-[25px] text-xs flex items-center text-gray-medium">
              Beginner and Intermediate
            </div>
          </div>
          <div className ="flex lg:flex-row sm:flex-col justify-between mt-3">
            <div className ="flex flex-row">
              <ClockCircleOutlined />
              <div className ="text-xs flex items-center ml-2">Student Enrolled</div>
            </div>
            <div className ="ml-[25px] text-xs flex items-center text-gray-medium">
              69,419,618
            </div>
          </div>
          <div className ="flex lg:flex-row sm:flex-col justify-between mt-3">
            <div className ="flex flex-row">
              <ClockCircleOutlined />
              <div className ="text-xs flex items-center ml-2">Language</div>
            </div>
            <div className ="ml-[25px] text-xs flex items-center text-gray-medium">
              English
            </div>
          </div>
          <div className ="flex lg:flex-row sm:flex-col justify-between mt-3">
            <div className ="flex flex-row">
              <ClockCircleOutlined />
              <div className ="text-xs flex items-center ml-2">Subtittle Language</div>
            </div>
            <div className ="ml-[25px] text-xs flex items-center text-gray-medium">
              English
            </div>
          </div>
        </div>
        <div className ="flex flex-col mt-3 pt-3 border-t-2	">
          <div>
            <Button
              type="primary"
              id="add"
            >Add to Cart</Button>
          </div>
          <div className ="mt-2">
            <Button
              type="primary"
              id="buy"
            >Buy now</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseDetail;
